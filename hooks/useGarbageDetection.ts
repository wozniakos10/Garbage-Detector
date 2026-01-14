import { decode } from 'base64-arraybuffer';
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';
import { useEffect } from 'react';
import { ScalarType, useExecutorchModule } from 'react-native-executorch';

const CLASSES = [
    'biological', 'trash', 'metal', 'plastic', 'battery',
    'glass', 'paper', 'clothes', 'cardboard', 'shoes'
];

const MODEL_INPUT_SIZE = 256;

export function useGarbageDetection() {
    const executorchModule = useExecutorchModule({
        modelSource: require('../assets/models/model.pte')
    });

    useEffect(() => {
        if (executorchModule.isReady) {
            console.log('✅ Model ready');
        }
    }, [executorchModule.isReady]);

    // Getting pixels
    const getPixelData = async (imageUri: string): Promise<Uint8Array> => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
                {
                    format: ImageManipulator.SaveFormat.JPEG,
                    compress: 1, // Max quality for model
                    base64: true
                }
            );

            if (!manipResult.base64) {
                throw new Error('Failed to get base64 data');
            }

            // Conversion Base64 -> ArrayBuffer -> Raw Pixels
            const arrayBuffer = decode(manipResult.base64);

            // Decode JPEG to raw pixel data
            const rawImageData = jpeg.decode(arrayBuffer, { useTArray: true });

            return rawImageData.data;
        } catch (e) {
            console.error('Error in getPixelData', e);
            throw e;
        }
    };

    const preprocessImage = async (imageUri: string): Promise<Float32Array> => {
        try {
            // Getting raw and scaled data
            const pixelData = await getPixelData(imageUri);

            // Creating input tensor
            // Format CHW (Channel, Height, Width)
            const inputTensor = new Float32Array(3 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE);

            const imageSize = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;

            // ImageNet normalization constants
            const IMAGENET_MEAN = [0.485, 0.456, 0.406];
            const IMAGENET_STD = [0.229, 0.224, 0.225];

            // Vectorized preprocessing: separate channels first
            for (let i = 0; i < imageSize; i++) {
                const pixelIndex = i * 4; // RGBA format

                // Extract and normalize to [0, 1], then apply ImageNet normalization
                inputTensor[i] = (pixelData[pixelIndex] / 255.0 - IMAGENET_MEAN[0]) / IMAGENET_STD[0];
                inputTensor[imageSize + i] = (pixelData[pixelIndex + 1] / 255.0 - IMAGENET_MEAN[1]) / IMAGENET_STD[1];
                inputTensor[imageSize * 2 + i] = (pixelData[pixelIndex + 2] / 255.0 - IMAGENET_MEAN[2]) / IMAGENET_STD[2];
            }

            return inputTensor;
        } catch (error) {
            console.error('Error preprocessing image:', error);
            throw new Error(`Failed to preprocess image: ${error}`);
        }
    };

    const detect = async (imageUri: string) => {
        if (!executorchModule.isReady) {
            console.warn('Model not ready yet');
            return null;
        }

        console.log('🔍 Processing image...');
        const startTime = performance.now();

        try {
            const inputData = await preprocessImage(imageUri);

            const inputTensor = {
                dataPtr: inputData,
                sizes: [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE],
                scalarType: ScalarType.FLOAT,
            };

            const output = await executorchModule.forward([inputTensor]);

            if (!output || output.length === 0) {
                throw new Error('No output from model');
            }

            // parsing logic
            const outputTensor = output[0];
            const logits = new Float32Array(outputTensor.dataPtr as ArrayBuffer);

            // argmax with softmax
            let maxIndex = 0;
            let maxScore = logits[0];
            for (let i = 1; i < logits.length; i++) {
                if (logits[i] > maxScore) {
                    maxScore = logits[i];
                    maxIndex = i;
                }
            }


            const exps = logits.map(Math.exp);
            const sumExps = exps.reduce((a, b) => a + b, 0);
            const confidence = exps[maxIndex] / sumExps;

            const label = CLASSES[maxIndex] || 'unknown';

            console.log(`✅ Result: ${label} (${(confidence * 100).toFixed(1)}%) in ${(performance.now() - startTime).toFixed(0)}ms`);

            return { label, confidence };

        } catch (err) {
            console.error('Detection failed:', err);
            throw err;
        }
    };

    return {
        detect,
        isReady: executorchModule.isReady,
        downloadProgress: executorchModule.downloadProgress,
    };
}
import { decode } from 'base64-arraybuffer';
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';
import { useEffect } from 'react';
import { ScalarType, useExecutorchModule } from 'react-native-executorch';

const CLASSES = [
    'biological', 'trash', 'metal', 'plastic', 'battery',
    'glass', 'paper', 'clothes', 'cardboard', 'shoes'
];

const MODEL_INPUT_SIZE = 128;

export function useYoloDetection() {
    const executorchModule = useExecutorchModule({
        modelSource: require('../assets/models/model.pte')
    });

    useEffect(() => {
        if (executorchModule.isReady) {
            console.log('✅ Model ready');
        }
    }, [executorchModule.isReady]);

    // Funkcja pomocnicza do pobierania surowych pikseli
    const getPixelData = async (imageUri: string): Promise<Uint8Array> => {
        try {
            // 1. Zmień rozmiar I pobierz Base64 w jednym kroku
            // Używamy JPEG, ponieważ jpeg-js jest szybki i niezawodny w JS
            const manipResult = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
                {
                    format: ImageManipulator.SaveFormat.JPEG,
                    compress: 1, // Max jakość dla modelu
                    base64: true
                }
            );

            if (!manipResult.base64) {
                throw new Error('Failed to get base64 data');
            }

            // 2. Konwersja Base64 -> ArrayBuffer
            const arrayBuffer = decode(manipResult.base64);

            // 3. Dekodowanie JPEG -> Surowe piksele (Uint8Array [r,g,b,a, r,g,b,a...])
            // useTArray: true zwraca Uint8Array zamiast tablicy Node Buffer
            const rawImageData = jpeg.decode(arrayBuffer, { useTArray: true });

            return rawImageData.data;
        } catch (e) {
            console.error('Error in getPixelData', e);
            throw e;
        }
    };

    const preprocessImage = async (imageUri: string): Promise<Float32Array> => {
        try {
            // Pobieramy surowe dane (już przeskalowane do 128x128 wewnątrz getPixelData)
            const pixelData = await getPixelData(imageUri);

            // Tworzymy tensor wejściowy: [1, 3, 128, 128]
            // Format CHW (Channel, Height, Width)
            const inputTensor = new Float32Array(3 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE);

            const imageSize = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;

            // Pętla po pikselach
            for (let i = 0; i < imageSize; i++) {
                // jpeg-js zwraca dane w formacie RGBA (4 bajty na piksel)
                const pixelIndex = i * 4;

                // Normalizacja do [0, 1] (standard dla YOLO/Torch)
                // Jeśli Twój model wymaga normalizacji ImageNet (mean/std), dodaj to tutaj.
                const r = pixelData[pixelIndex] / 255.0;
                const g = pixelData[pixelIndex + 1] / 255.0;
                const b = pixelData[pixelIndex + 2] / 255.0;

                // Wypełnianie tensora w formacie CHW
                // Płaski index dla każdego kanału
                inputTensor[i] = r;                 // R (0 * size + i)
                inputTensor[imageSize + i] = g;     // G (1 * size + i)
                inputTensor[imageSize * 2 + i] = b; // B (2 * size + i)
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

            // ... reszta logiki parsowania (softmax itp.) pozostaje bez zmian ...
            const outputTensor = output[0];
            const logits = new Float32Array(outputTensor.dataPtr as ArrayBuffer);

            // Prosta implementacja argmax i softmax
            let maxIndex = 0;
            let maxScore = logits[0];
            for (let i = 1; i < logits.length; i++) {
                if (logits[i] > maxScore) {
                    maxScore = logits[i];
                    maxIndex = i;
                }
            }

            // Opcjonalnie: Softmax calculation dla pewności
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
import { useEffect } from 'react';
import { SSDLITE_320_MOBILENET_V3_LARGE, useObjectDetection } from 'react-native-executorch';

export function useYoloDetection() {
    // TODO:
    // Right now SSDLITE_320_MOBILENET_V3_LARGE model from libary is used
    //  For our usage, we will need to export out torch model to .pte format and use useExecutorchModule
    // https://docs.swmansion.com/react-native-executorch/docs/hooks/executorch-bindings/useExecutorchModule
    
    const ssdlite = useObjectDetection({
        model: SSDLITE_320_MOBILENET_V3_LARGE
    });

    useEffect(() => {
        console.log('Model ready:', ssdlite.isReady);
        console.log('Loading progress:', (ssdlite.downloadProgress * 100).toFixed(0) + '%');
    }, [ssdlite.isReady, ssdlite.downloadProgress]);

    const detect = async (imageUri: string) => {
        if (!ssdlite.isReady) {
            throw new Error('Model not ready');
        }

        console.log('🔍 Running detection on:', imageUri);
        const results = await ssdlite.forward(imageUri);

        if (results && results.length > 0) {
            const best = results[0];
            console.log(`✅ Detected: ${best.label} (score: ${best.score})`);

            return {
                label: best.label,
                confidence: best.score
            };
        }

        throw new Error('No objects detected');
    };

    return {
        detect,
        isReady: ssdlite.isReady,
        isGenerating: ssdlite.isGenerating,
        downloadProgress: ssdlite.downloadProgress
    };
}

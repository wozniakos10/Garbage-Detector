import { CLASSES } from '@/constants/wasteClasses';

/**
 * Simple prediction service with mocked responses
 * Returns random waste category: Plastik, Szkło, Papier, or Śmieci Zmieszane
 */
class PredictionService {
    /**
     * Simulate waste classification
     * Returns a random waste category with confidence score
     */
    async predict(): Promise<{ label: string; confidence: number }> {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800));

        // Random waste category
        const randomIndex = Math.floor(Math.random() * CLASSES.length);
        const wasteClass = CLASSES[randomIndex];

        // Random confidence between 75% and 99%
        const confidence = Math.random() * (0.99 - 0.75) + 0.75;

        return {
            label: wasteClass,
            confidence: confidence
        };
    }
}

export const predictionService = new PredictionService();

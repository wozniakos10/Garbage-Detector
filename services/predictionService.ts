import * as ort from "onnxruntime-react-native";

export class PredictionService {
  private session: ort.InferenceSession | null = null;

  async loadModel() {
    if (this.session) return;

    // Load asset URI
    // const modelAsset = Asset.fromModule(require());
    // await modelAsset.downloadAsync();

    // Create ONNX Runtime session
    this.session = await ort.InferenceSession.create("../assets/models/waste_model.onnx", {
      executionProviders: ["cpu"], // or "xnnpack" if available
    });
  }

  async predict(imageTensor: ort.Tensor): Promise<{ label: string; confidence: number }> {
    if (!this.session) throw new Error("Model not loaded");

    const feeds: Record<string, ort.Tensor> = { input: imageTensor };
    const results = await this.session.run(feeds);
    const output = results.output.data as Float32Array;

    const maxIdx = output.indexOf(Math.max(...output));
    const confidence = output[maxIdx];

    // Replace CLASSES with your actual labels array
    const CLASSES = ["Plastik", "Szkło", "Papier", "Śmieci Zmieszane"];

    return { label: CLASSES[maxIdx], confidence };
  }
}

export const predictionService = new PredictionService();

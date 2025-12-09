import * as ImageManipulator from "expo-image-manipulator";
import * as ort from "onnxruntime-react-native";


export async function imageToTensor(uri: string): Promise<ort.Tensor> {
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 256, height: 256 } }],
    { format: ImageManipulator.SaveFormat.PNG }
  );

  const response = await fetch(resized.uri);
  const arrayBuffer = await response.arrayBuffer();
  const imageData = new Uint8Array(arrayBuffer);


  const float32Data = new Float32Array(1 * 3 * 256 * 256);


  return new ort.Tensor("float32", float32Data, [1, 3, 256, 256]);
}

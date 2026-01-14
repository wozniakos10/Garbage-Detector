import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

interface CameraScreenProps {
    onPhotoTaken: (uri: string) => void;
    historyCount: number;
    onShowHistory: () => void;
    onGoHome: () => void;
}

export default function CameraScreen({ onPhotoTaken, historyCount, onShowHistory, onGoHome }: CameraScreenProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [zoom, setZoom] = useState(0);
    const startZoom = useRef(0);
    const router = useRouter();

    // Zoom Gesture
    const pinch = Gesture.Pinch()
        .onStart(() => {
            startZoom.current = zoom;
        })
        .onUpdate((e) => {
            // Apply sensitivity to avoid jumps. 
            // e.scale starts at 1. If we use (scale - 1) directly, it's 1:1 mapping.
            // Using 0.05 sensitivity makes the zoom smoother.
            const SENSITIVITY = 0.005; // Very smooth, requires more pinching
            const velocity = e.velocity / 20;

            // Calculate delta based on scale linear change
            const delta = (e.scale - 1) * 0.5; // 0.5 sensitivity factor

            // Clamp between 0 and 1
            const newZoom = Math.min(Math.max(startZoom.current + delta, 0), 1);
            runOnJS(setZoom)(newZoom);
        });

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Zezwól na dostęp do kamery, aby używać aplikacji</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>Przyznaj dostęp</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photoData = await (cameraRef.current as any).takePictureAsync({
                    quality: 1,
                });
                onPhotoTaken(photoData.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.topButton} onPress={onGoHome}>
                    <Text style={styles.topButtonText}>Menu Główne</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton} onPress={onShowHistory}>
                    <Text style={styles.topButtonText}>
                        Historia {historyCount > 0 ? `(${historyCount})` : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            <GestureDetector gesture={pinch}>
                <View style={{ flex: 1 }}>
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        ref={cameraRef}
                        autofocus="on"
                        responsiveOrientationWhenOrientationLocked={true}
                        zoom={zoom}
                    >
                        <View style={styles.cameraOverlay}>
                            {zoom > 0 && (
                                <View style={styles.instructionBox}>
                                    <Text style={styles.instructionText}>
                                        {`Zoom: ${(zoom * 100).toFixed(0)}%`}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </CameraView>
                </View>
            </GestureDetector>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.innerCaptureButton} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    topBar: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    topButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 20,
    },
    topButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    instructionBox: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 100, // Move down to avoid overlapping with top buttons
    },
    instructionText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCaptureButton: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: 'white',
    },
});

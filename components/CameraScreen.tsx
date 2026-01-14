import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraScreenProps {
    onPhotoTaken: (uri: string) => void;
    historyCount: number;
    onShowHistory: () => void;
    onGoHome: () => void;
}

export default function CameraScreen({ onPhotoTaken, historyCount, onShowHistory, onGoHome }: CameraScreenProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Aplikacja potrzebuje dostępu do kamery</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Przyznaj uprawnienia</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photoData = await (cameraRef.current as any).takePictureAsync({
                    quality: 0.5,
                });
                onPhotoTaken(photoData.uri);
            } catch (error) {
                console.error("Błąd aparatu:", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <TouchableOpacity style={styles.homeButtonTop} onPress={onGoHome}>
                <Text style={styles.homeButtonText}>🏠 Menu Główne</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.historyButtonTop} onPress={onShowHistory}>
                <Text style={styles.historyButtonTopText}>📋 Historia</Text>
                {historyCount > 0 && (
                    <View style={styles.historyBadge}>
                        <Text style={styles.historyBadgeText}>{historyCount}</Text>
                    </View>
                )}
            </TouchableOpacity>

            <CameraView style={styles.camera} facing="back" ref={cameraRef}>
                <View style={styles.cameraOverlay}>
                    <View style={styles.instructionBox}>
                        <Text style={styles.instructionText}>
                            Skieruj kamerę na śmieć i zrób zdjęcie
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 20,
        borderRadius: 10,
        margin: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
    },
    instructionBox: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 100, // Increased margin to avoid overlap with top buttons
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    historyButtonTop: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(33, 150, 243, 0.9)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyButtonTopText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    historyBadge: {
        backgroundColor: '#F44336',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    historyBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    homeButtonTop: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(33, 150, 243, 0.9)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

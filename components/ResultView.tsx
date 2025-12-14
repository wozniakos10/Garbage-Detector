import { Prediction } from '@/types';
import { useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhotoPreviewModal from './PhotoPreviewModal';

interface ResultViewProps {
    photo: string;
    prediction: Prediction | null;
    loading: boolean;
    onReset: () => void;
    onSave: () => void;
    onShowHistory: () => void;
    historyCount: number;
}

export default function ResultView({
    photo,
    prediction,
    loading,
    onReset,
    onSave,
    onShowHistory,
    historyCount
}: ResultViewProps) {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <TouchableOpacity onPress={() => setShowPreview(true)}>
                    <Image source={{ uri: photo }} style={styles.previewImage} />
                    <View style={styles.imageOverlay}>
                        <Text style={styles.imageOverlayText}>👆 Kliknij aby powiększyć</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.resultContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2196F3" />
                            <Text style={styles.loadingText}>Analizowanie obrazu...</Text>
                        </View>
                    ) : prediction ? (
                        <>
                            <View style={styles.mainResult}>
                                <Text style={styles.iconLarge}>🤖</Text>
                                <Text style={styles.labelTitle}>YOLO wykrył:</Text>
                                <Text style={styles.labelText}>{prediction.label}</Text>
                                <Text style={[styles.confidenceText, { color: '#2196F3' }]}>
                                    Pewność: {(parseFloat(prediction.confidence.toString()) * 100).toFixed(1)}%
                                </Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.infoTitle}>ℹ️ Info</Text>
                                <Text style={styles.infoText}>
                                    To jest surowy wynik z modelu YOLO (COCO dataset).
                                    {'\n'}Klasa: {prediction.label}
                                    {'\n'}Timestamp: {prediction.timestamp}
                                </Text>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.saveButton]}
                                    onPress={onSave}
                                >
                                    <Text style={styles.actionButtonText}>💾 Zapisz</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.historyButton]}
                                    onPress={() => {
                                        onReset();
                                        onShowHistory();
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>📋 Historia ({historyCount})</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.retryButton} onPress={onReset}>
                                <Text style={styles.retryButtonText}>📸 Skanuj ponownie</Text>
                            </TouchableOpacity>
                        </>
                    ) : null}
                </View>
            </ScrollView>

            <PhotoPreviewModal
                visible={showPreview}
                photoUri={photo}
                onClose={() => setShowPreview(false)}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    previewImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    imageOverlayText: {
        color: 'white',
        fontSize: 12,
    },
    resultContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 30,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 18,
        color: '#666',
    },
    mainResult: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconLarge: {
        fontSize: 60,
        marginBottom: 10,
    },
    labelTitle: {
        fontSize: 16,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    labelText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
    },
    confidenceText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    infoBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    binBadge: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    binText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        gap: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    historyButton: {
        backgroundColor: '#FF9800',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 15,
        width: '100%',
        marginTop: 10,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    detectionClass: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    detectionConfidence: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

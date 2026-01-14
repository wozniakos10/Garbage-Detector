import { CLASSES_INFO, CLASS_NAME_MAPPER } from '@/constants/wasteClasses';
import { HistoryItem } from '@/types';
import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhotoPreviewModal from './PhotoPreviewModal';

interface HistoryDetailsModalProps {
    visible: boolean;
    item: HistoryItem | null;
    onClose: () => void;
}

export default function HistoryDetailsModal({ visible, item, onClose }: HistoryDetailsModalProps) {
    const [showFullPhoto, setShowFullPhoto] = useState(false);

    if (!item) return null;

    const wasteInfo = CLASSES_INFO[item.label];
    const displayName = CLASS_NAME_MAPPER[item.label];

    if (!wasteInfo || !displayName) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Szczegóły skanu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <TouchableOpacity onPress={() => setShowFullPhoto(true)}>
                            <Image source={{ uri: item.photo }} style={styles.image} />
                            <View style={styles.imageOverlay}>
                                <Text style={styles.imageOverlayText}>👆 Kliknij zdjęcie aby powiększyć</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.detailsContainer}>
                            <View style={styles.mainInfo}>
                                <Text style={styles.iconLarge}>{wasteInfo.icon}</Text>
                                <View>
                                    <Text style={styles.labelText}>{displayName}</Text>
                                    <Text style={[styles.confidenceText, { color: wasteInfo.color }]}>
                                        Pewność: {(item.confidence * 100).toFixed(1)}%
                                    </Text>
                                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                                </View>
                            </View>

                            <View style={[styles.infoBox, { borderLeftWidth: 4, borderLeftColor: wasteInfo.color }]}>
                                <Text style={styles.infoTitle}>♻️ Gdzie wyrzucić?</Text>
                                <Text style={[styles.binText, { color: wasteInfo.color }]}>{wasteInfo.bin}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.infoTitle}>💡 Wskazówki</Text>
                                <Text style={styles.infoText}>{wasteInfo.tips}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.infoTitle}>⏱️ Czas rozkładu</Text>
                                <Text style={styles.infoText}>{wasteInfo.recyclingTime}</Text>
                            </View>

                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.bottomCloseButton} onPress={onClose}>
                        <Text style={styles.bottomCloseButtonText}>Zamknij</Text>
                    </TouchableOpacity>

                    <PhotoPreviewModal
                        visible={showFullPhoto}
                        photoUri={item.photo}
                        onClose={() => setShowFullPhoto(false)}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#999',
    },
    content: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 250,
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
    detailsContainer: {
        padding: 20,
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15,
    },
    iconLarge: {
        fontSize: 50,
    },
    labelText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    confidenceText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
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
    binText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    bottomCloseButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        alignItems: 'center',
        margin: 20,
        borderRadius: 15,
    },
    bottomCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

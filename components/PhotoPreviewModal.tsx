import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PhotoPreviewModalProps {
    visible: boolean;
    photoUri: string | null;
    onClose: () => void;
}

export default function PhotoPreviewModal({ visible, photoUri, onClose }: PhotoPreviewModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                    <View style={styles.modalContent}>
                        {photoUri && (
                            <Image source={{ uri: photoUri }} style={styles.fullImage} resizeMode="contain" />
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>✕ Zamknij</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

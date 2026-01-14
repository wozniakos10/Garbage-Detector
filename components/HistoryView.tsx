import { CLASSES_INFO, CLASS_NAME_MAPPER } from '@/constants/wasteClasses';
import { HistoryItem } from '@/types';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HistoryDetailsModal from './HistoryDetailsModal';

interface HistoryViewProps {
    history: HistoryItem[];
    onClose: () => void;
    onClear: () => void;
}

export default function HistoryView({ history, onClose, onClear }: HistoryViewProps) {
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Historia skanowań</Text>
                <View style={styles.headerButtons}>
                    {history.length > 0 && (
                        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                            <Text style={styles.clearButtonText}>Wyczyść</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backButtonText}>← Powrót</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.list}>
                {history.length === 0 ? (
                    <View style={styles.emptyHistory}>
                        <Text style={styles.emptyHistoryText}>Brak zapisanych skanowań</Text>
                        <Text style={styles.emptyHistorySubtext}>Rozpocznij skanowanie i zapisz wyniki!</Text>
                    </View>
                ) : (
                    history.map((item) => {
                        const info = CLASSES_INFO[item.label];
                        const displayName = CLASS_NAME_MAPPER[item.label];
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.item}
                                onPress={() => setSelectedItem(item)}
                            >
                                <Image source={{ uri: item.photo }} style={styles.image} />
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemLabel}>
                                        {info.icon} {displayName}
                                    </Text>
                                    <Text style={styles.itemConfidence}>
                                        Pewność: {(item.confidence * 100).toFixed(0)}%
                                    </Text>
                                    <Text style={styles.itemTime}>{item.timestamp}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            <HistoryDetailsModal
                visible={!!selectedItem}
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    backButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#F44336',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    emptyHistory: {
        padding: 40,
        alignItems: 'center',
    },
    emptyHistoryText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    emptyHistorySubtext: {
        fontSize: 14,
        color: '#999',
    },
    item: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 15,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    itemLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    itemConfidence: {
        fontSize: 14,
        color: '#4CAF50',
        marginBottom: 3,
    },
    itemTime: {
        fontSize: 12,
        color: '#999',
    },
});

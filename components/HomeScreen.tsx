import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HomeScreenProps {
    onStartScanning: () => void;
    onShowHistory: () => void;
    historyCount: number;
}

export default function HomeScreen({ onStartScanning, onShowHistory, historyCount }: HomeScreenProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>♻️</Text>
                <Text style={styles.title}>EcoSort</Text>
                <Text style={styles.subtitle}>Inteligentna segregacja śmieci</Text>

                <View style={styles.features}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📸</Text>
                        <Text style={styles.featureText}>Zrób zdjęcie</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🤖</Text>
                        <Text style={styles.featureText}>AI rozpozna typ</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🗑️</Text>
                        <Text style={styles.featureText}>Segreguj prawidłowo</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.mainButton} onPress={onStartScanning}>
                    <Text style={styles.mainButtonText}>📸 Rozpocznij skanowanie</Text>
                </TouchableOpacity>

                {historyCount > 0 && (
                    <TouchableOpacity style={styles.historyButton} onPress={onShowHistory}>
                        <Text style={styles.historyButtonText}>
                            📋 Zobacz historię ({historyCount})
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        🌍 Razem dbajmy o naszą planetę!{'\n'}
                        Każda prawidłowo posegregowana rzecz ma znaczenie.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        fontSize: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
    },
    feature: {
        alignItems: 'center',
        flex: 1,
    },
    featureIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    mainButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        marginBottom: 15,
    },
    mainButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    historyButton: {
        backgroundColor: '#FF9800',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        marginBottom: 30,
    },
    historyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
});

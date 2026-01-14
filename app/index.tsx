import CameraScreen from '@/components/CameraScreen';
import HistoryView from '@/components/HistoryView';
import HomeScreen from '@/components/HomeScreen';
import ResultView from '@/components/ResultView';
import { useGarbageDetection } from '@/hooks/useGarbageDetection';
import { HistoryItem, Prediction } from '@/types';
import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Screen = 'home' | 'camera' | 'result' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [photo, setPhoto] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Hook model
  const model = useGarbageDetection();

  const mockPredict = async (imageUri: string) => {
    setLoading(true);
    try {
      const result = await model.detect(imageUri);

      if (!result) {
        throw new Error('Model nie jest jeszcze gotowy');
      }

      setPrediction({
        label: result.label,
        confidence: result.confidence,
        timestamp: new Date().toLocaleString('pl-PL')
      });
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Wystąpił nieznany błąd podczas klasyfikacji';

      setLoading(false);
      Alert.alert(
        'Błąd wykrywania',
        errorMessage,
        [
          {
            text: 'Spróbuj ponownie',
            onPress: () => {
              setPhoto(null);
              setPrediction(null);
              setCurrentScreen('camera');
            }
          }
        ]
      );
      return;
    } finally {
      setLoading(false);
    }
  };

  // Show loader
  if (!model.isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loaderText}>
            Ładowanie modelu... {(model.downloadProgress * 100).toFixed(0)}%
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  const handlePhotoTaken = (uri: string) => {
    setPhoto(uri);
    setCurrentScreen('result');
    mockPredict(uri);
  };

  const resetApp = () => {
    setPhoto(null);
    setPrediction(null);
    setCurrentScreen('camera');
  };

  const saveToHistory = () => {
    if (prediction && photo) {
      setHistory(prev => [{
        ...prediction,
        photo: photo,
        id: Date.now()
      }, ...prev].slice(0, 20));

      Alert.alert('✅ Zapisano', 'Dodano do historii skanowań!');
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Wyczyść historię',
      'Czy na pewno chcesz usunąć wszystkie zapisy?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            setCurrentScreen('home');
          }
        }
      ]
    );
  };

  const showHistory = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('history');
  };

  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <HomeScreen
          onStartScanning={() => setCurrentScreen('camera')}
          onShowHistory={showHistory}
          historyCount={history.length}
        />
      </SafeAreaView>
    );
  }

  if (currentScreen === 'camera') {
    return (
      <CameraScreen
        onPhotoTaken={handlePhotoTaken}
        historyCount={history.length}
        onShowHistory={showHistory}
        onGoHome={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'result' && photo) {
    return (
      <ResultView
        photo={photo}
        prediction={prediction}
        loading={loading}
        onReset={resetApp}
        onSave={saveToHistory}
        onShowHistory={showHistory}
        historyCount={history.length}
        onGoHome={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'history') {
    return (
      <HistoryView
        history={history}
        onClose={() => setCurrentScreen(previousScreen)}
        onClear={clearHistory}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
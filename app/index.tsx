import CameraScreen from '@/components/CameraScreen';
import HistoryView from '@/components/HistoryView';
import HomeScreen from '@/components/HomeScreen';
import ResultView from '@/components/ResultView';
import { imageToTensor } from '@/services/imageUtils';
import { predictionService } from '@/services/predictionService';
import { HistoryItem, Prediction } from '@/types';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';

type Screen = 'home' | 'camera' | 'result' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [photo, setPhoto] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

useEffect(() => {
  (async () => {
    await predictionService.loadModel();
  })();
}, []);

  const runPrediction = async () => {
    if (!photo) return;
    setLoading(true);

    try {
      const tensor = await imageToTensor(photo); // ONNX tensor
      const result = await predictionService.predict(tensor);

      setPrediction({
        label: result.label,
        confidence: result.confidence,
        timestamp: new Date().toLocaleString('pl-PL'),
      });
    } catch (e) {
      console.error("Prediction error", e);
    } finally {
      setLoading(false);
    }
  };



  const handlePhotoTaken = (uri: string) => {
    setPhoto(uri);
    setCurrentScreen('result');
    runPrediction();
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

  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <HomeScreen
          onStartScanning={() => setCurrentScreen('camera')}
          onShowHistory={() => setCurrentScreen('history')}
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
        onShowHistory={() => setCurrentScreen('history')}
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
        onShowHistory={() => setCurrentScreen('history')}
        historyCount={history.length}
      />
    );
  }

  if (currentScreen === 'history') {
    return (
      <HistoryView
        history={history}
        onClose={() => setCurrentScreen('home')}
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
});
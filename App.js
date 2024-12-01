import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { WebView } from 'react-native-webview';

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [arModelUrl, setArModelUrl] = useState(null);

  // Request Camera Permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // QR Scanner Logic
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setShowScanner(false);

    if (data.includes("unity-model-url")) {
      setArModelUrl(data); // Replace with actual Unity WebGL model URL
    } else if (data.startsWith("http://") || data.startsWith("https://")) {
      alert(`Opening URL: ${data}`);
      setArModelUrl(data); // Allow fallback for URLs
    } else {
      alert("Invalid QR code!");
      setScanned(false);
    }
  };

  // Main Screen with Logo and QR Scanner Button
  if (!showScanner && !arModelUrl) {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://drive.google.com/uc?export=view&id=1XOXn8uA3zh8D8KI5kFlKeNvRQVbNu0oD",
          }}
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShowScanner(true);
            setScanned(false);
          }}
        >
          <Text style={styles.buttonText}>QR Scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera Screen for QR Scanning
  if (showScanner) {
    return (
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.cameraOverlay}>
          <Text style={styles.scanText}>Point the camera at a QR code</Text>
        </View>
      </Camera>
    );
  }

  // WebView for AR Model or Generic URLs
  if (arModelUrl) {
    return (
      <WebView
        source={{ uri: arModelUrl }}
        style={styles.webview}
        onError={() => alert("Failed to load AR model or URL.")}
      />
    );
  }

  return null; // Fallback
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
});

export default App;

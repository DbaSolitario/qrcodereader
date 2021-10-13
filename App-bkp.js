import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ColorPropType } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Appbkp() {
  const [hasPermission, setHaspermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet Scanned');

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHaspermission(status == 'granted');
    })()
  }

  // Requisitar o uso da camera
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // Trigger para o barcode e o que acontecerá

  const handlerBarcodeScanner = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log(`Read barcode - Type ${type} `)
  };

  // Check Permissions
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.maintext}>Requesting for camera Permission</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.maintext}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => { askForCameraPermission() }} />
      </View>
    )
  }
  // Main view
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handlerBarcodeScanner}
          style={{ height: 500, width: 500 }}
        />
      </View>
      {
        scanned &&
        <View>
          <Text style={styles.maintext}>Read {text}</Text>
          <Button title={'Scan again?'} onPress={() => { setScanned(false) }} color='tomato' />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'black'
  }
});

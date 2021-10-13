import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ColorPropType } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Col, Row, Grid } from "react-native-easy-grid";

const serverIP = "http://192.168.0.100:3000";

class car {
  constructor(bno, vin, info) {
    this.bno = bno;
    this.vin = vin;
    this.info = info;
  }

}

function HomeScreen({ navigation, route }) {
  const [hasPermission, setHaspermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet Scanned');

  if (route.params) {
    setScanned(false);
  }

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
    navigation.navigate({ name: 'Details', params: data });
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

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? setScanned(false) : handlerBarcodeScanner}
          style={{ height: 500, width: 500 }}
        />
      </View>
    </View>

  );
}

function DetailsScreen({ navigation, route }) {
  const [data, setData] = useState(null);
  const [respCar, setRespCar] = useState(new car('', '', ''));
  // Preventing some issue in run time
  
    if (!route.params) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
          <View>
            <Text style={styles.maintext}>SOMETHING WENT WRONG, PLEASE TRY AGAIN</Text>
            <Button title={'try again'} onPress={() =>  navigation.navigate({ name: 'Home' })} color='tomato' />
          </View>
        </View>
      )
    }
    

  useEffect(() => {
    // POST request using fetch inside useEffect React hook

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bodyno: route.params })
      //body: JSON.stringify({ bodyno: 'JBW 000000' })
    };

    fetch(serverIP, requestOptions)
      .then(response => response.json())
      .then(data => {
        data = data.info;
        setData(JSON.stringify(data));
        setRespCar(new car(data.bno, data.vin, data.info))
      });
  }, []);
  //setData(JSON.stringify(data))
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>
        <Grid>
          <Col style={styles.col}>
            <Row style={styles.row}>
              <Text>Details Screen</Text>
            </Row>
            <Row style={styles.row}>
              <Text>Model Car {respCar.info}</Text>
            </Row>
            <Row style={styles.row} >
              <Text>BNO {respCar.bno}</Text>
            </Row>
            <Row style={styles.row}>
              <Text>VIN {respCar.vin}</Text>
            </Row>
            <Row style={styles.rowbutton}>
              <Button title={'Scan again?'} onPress={() => navigation.goBack()} color='tomato' />
            </Row>
          </Col>
        </Grid>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
  },
  rowbutton:{
    height:50,
    width:300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    height: 50
  },
  col: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    width: 300
  }
});

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Sqlite from "./src/services/sqlite";
import Routes from "./src/routes";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [conf, setConf] = useState(false);

  useEffect(() => {
    console.log('App.js loading...')
    new Sqlite(() => {
      setConf(true);
    });
  }, []);

  return (
    <SafeAreaProvider>
      {conf ? (
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      ) : (
        <></>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, TextInput, Button } from "react-native-paper";
import Sqlite from "../services/sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Form({ navigation, identity }) {
  const sqlite = new Sqlite();
  const [name, setName] = useState();
  const [weight, setWeight] = useState("");

  const handleSave = () => {
    if (name)
      sqlite.createIdentity({ name, weight: +weight }, (_, data) =>
        navigation.goBack()
      );
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput
          placeholder="Name"
          mode="outlined"
          value={name}
          onChangeText={(val) => {
            setName(val);
          }}
        />
        <TextInput
          placeholder="Weight"
          mode="outlined"
          value={weight}
          onChangeText={(val) => {
            setWeight(val);
          }}
        />
        <Button onPress={handleSave}>Guardar</Button>
      </View>
    </SafeAreaView>
  );
}

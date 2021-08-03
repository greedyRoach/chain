import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, TextInput, Button } from "react-native-paper";
import Sqlite from "../services/sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";

export default function Index({ navigation }) {
  const sqlite = new Sqlite();
  const [identities, setIdentities] = useState([]);
  const [identity, setIdentity] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    sqlite.getIdentities((_, { rows: { _array } }) => {
      setIdentities(_array);
    });
  }, []);

  const handleSave = () => {
    if (name)
      sqlite.createHabit({ name, identity_id: identity }, (_, data) => {
        navigation.goBack();
      });
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput
          placeholder="Nombre"
          mode="outlined"
          value={name}
          onChangeText={(val) => {
            setName(val);
          }}
        />
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            style={{
              inputAndroid: { color: "black" },
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 0.5,
              borderColor: "purple",
              borderRadius: 8,
              color: "black",
              paddingRight: 30, // to ensure the text is never behind the icon}
            }}
            placeholder={{
              label: "Identidades",
              value: null,
            }}
            value={identity}
            onValueChange={(value) => setIdentity(value)}
            items={identities.map((val) => {
              return { label: val.name, value: val.identity_id };
            })}
          />
        </View>
        <Button onPress={handleSave}>Guardar</Button>
      </View>
    </SafeAreaView>
  );
}

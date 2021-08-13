import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FAB, TextInput, Button, RadioButton, Text } from "react-native-paper";
import Sqlite from "../services/sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";

export default function Index({ navigation }) {
  const sqlite = new Sqlite();
  const [identities, setIdentities] = useState([]);
  const [identity, setIdentity] = useState();
  const [name, setName] = useState();

  const [mon, setMon] = useState(true);
  const [tue, setTue] = useState(true);
  const [wen, setWen] = useState(true);
  const [thu, setThu] = useState(true);
  const [fri, setFri] = useState(true);
  const [sat, setSat] = useState(false);
  const [sun, setSun] = useState(false);

  useEffect(() => {
    sqlite.getIdentities((_, { rows: { _array } }) => {
      setIdentities(_array);
    });
  }, []);

  const handleSave = () => {
    if (name) {
      const habit = {
        name,
        identity_id: identity,
        mon,
        tue,
        wen,
        thu,
        fri,
        sat,
        sun,
      };

      sqlite.createHabit(habit, (_, data) => {
        navigation.goBack();
      });
    }
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
        <View style={styles.radio}>
          <Text>Monday</Text>
          <RadioButton
            status={mon ? "checked" : "unchecked"}
            onPress={() => setMon(!mon)}
          />
        </View>
        <View style={styles.radio}>
          <Text>Tuesday</Text>
          <RadioButton
            status={tue ? "checked" : "unchecked"}
            onPress={() => setTue(!tue)}
          />
        </View>
        <View style={styles.radio}>
          <Text>Wednesday</Text>
          <RadioButton
            status={wen ? "checked" : "unchecked"}
            onPress={() => setWen(!wen)}
          />
        </View>
        <View style={styles.radio}>
          <Text>thu</Text>
          <RadioButton
            status={thu ? "checked" : "unchecked"}
            onPress={() => setThu(!thu)}
          />
        </View>
        <View style={styles.radio}>
          <Text>Friday</Text>
          <RadioButton
            status={fri ? "checked" : "unchecked"}
            onPress={() => setFri(!fri)}
          />
        </View>
        <View style={styles.radio}>
          <Text>Saturday</Text>
          <RadioButton
            status={sat ? "checked" : "unchecked"}
            onPress={() => setSat(!sat)}
          />
        </View>
        <View style={styles.radio}>
          <Text>Sunday</Text>
          <RadioButton
            status={sun ? "checked" : "unchecked"}
            onPress={() => setSun(!sun)}
          />
        </View>

        <Button onPress={handleSave}>Guardar</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  radio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

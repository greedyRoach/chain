import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, Text, Subheading } from "react-native-paper";
import Sqlite from "../services/sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index({ navigation }) {
  const sqlite = new Sqlite();
  const [identities, setIdentities] = useState([]);

  useEffect(() => {
    loadIdentities();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadIdentities();
    });

    return unsubscribe;
  }, [navigation]);

  const loadIdentities = () => {
    sqlite.getIdentities((_, { rows: { _array } }) => {
      setIdentities(_array);
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View>
        {identities.map((identity, index) => {
          return (
            <View key={index} style={{ padding: 15 }}>
              <Subheading>{identity.name}</Subheading>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 100 / 2,
                  backgroundColor:
                    identity.weight > 0
                      ? "green"
                      : identity.weight < 0
                      ? "red"
                      : "grey",
                }}
              ></View>
            </View>
          );
        })}
      </View>
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={() => navigation.navigate("FormIdentity")}
      />
    </SafeAreaView>
  );
}

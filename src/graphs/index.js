import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, Text, Subheading } from "react-native-paper";
import Sqlite from "../services/sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function Graphs({ navigation }) {
  const sqlite = new Sqlite();
  const [data, setData] = useState([]);

  useEffect(() => {
    loadGraphData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadGraphData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadGraphData = () => {
    sqlite.getRepetitions((repetitions) => {
      const today = new Date();

      const identities = [];

      repetitions.sort((a, b) => {
        if (a.end == false) return 1;
        else if (b.end == false) return -1;
        return a.init - b.init;
      });

      for (const repetition of repetitions) {
        const identity = identities.find(
          (val) => val.identity_id == repetition.identity_id
        );

        if (!identity) identities.push({
          identity_id: repetition.identity_id,
          identity_name: repetition.identity_name,
        });
      }

      for (const identity of identities) {
        identity.repetitions = repetitions.filter(
          (rep) => rep.identity_id == identity.identity_id
        );

        const init = identity.repetitions[0].init;
        const end =
          identity.repetitions[identity.repetitions.length - 1].end != null
            ? identity.repetitions[identity.repetitions.length - 1].end
            : today.getTime();
        identity.started =
          identity.repetitions[identity.repetitions.length - 1].end == null;
        identity.total_seconds = Math.floor((end - init) / 1000);
        identity.total_minutes = Math.floor(identity.total_seconds / 60);
      }

      const data = identities.map((identity) => {
        const color = getRandomColor();

        return {
          name: identity.identity_name,
          total: identity.total_seconds,
          color: color,
          legendFontColor: color,
          legendFontSize: 15,
        };
      });

      setData(data);
    });
  };

  const getRandomColor = () => {
    return (
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")"
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View>
        <PieChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2, // optional, default 3
          }}
          accessor="total"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </SafeAreaView>
  );
}

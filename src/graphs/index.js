import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, Text, Subheading } from "react-native-paper";
import Sqlite from "../services/sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PieChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function Graphs({ navigation }) {
  const sqlite = new Sqlite();
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    console.log('graphs')
    loadHabits();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHabits();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHabits = () => {
    sqlite.getHabits((habits) => {
      sqlite.getRepetitions((repetitions) => {
        const today = new Date();

        for (const habit of habits) {
          habit.repetitions = repetitions
            .filter((rep) => rep.habit_id == habit.habit_id)
            .sort((a, b) => {
              if (a.end == false) return 1;
              else if (b.end == false) return -1;
              return a.init - b.init;
            });
          if (habit.repetitions && habit.repetitions.length > 0) {
            const init = habit.repetitions[0].init;
            const end =
              habit.repetitions[habit.repetitions.length - 1].end != null
                ? habit.repetitions[habit.repetitions.length - 1].end
                : today.getTime();
            habit.started =
              habit.repetitions[habit.repetitions.length - 1].end == null;
            habit.total_seconds = Math.floor((end - init) / 1000);
            habit.total_minutes = Math.floor(habit.total_seconds / 60);
          }
        }

        habits = habits.filter(
          (habit) => habit.repetitions && habit.repetitions.length > 0
        );

        habits = habits.map((habit) => {
          const color = getRandomColor();

          return {
            name: habit.name,
            total: habit.total_seconds,
            color: color,
            legendFontColor: color,
            legendFontSize: 15,
          };
        });

        setHabits(habits);
        console.log('setting, habits data', habits)
      });
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
          data={habits}
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

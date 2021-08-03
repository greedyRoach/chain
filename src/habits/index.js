import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  Caption,
  Subheading,
  FAB,
  List,
  IconButton,
  Colors,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Sqlite from "../services/sqlite";

const Habit = ({
  habit_id,
  name,
  started,
  identity_name,
  identity_weight,
  total_today,
  onPlay,
}) => {
  const [start, setStart] = useState(started);
  const sqlite = new Sqlite();

  const handleToggle = () => {
    let onDone;
    if (start) {
      onDone = () => {
        setStart(false);
      };
    } else {
      onDone = () => {
        sqlite.startHabit(habit_id, () => {
          onPlay(habit_id);
          setStart(true);
        });
      };
    }

    sqlite.stopHabit(onDone);
  };

  return (
    <View style={{ padding: 10 }}>
      <Subheading>
        {name}: ({total_today} minutos hoy)
      </Subheading>
      <Caption>{identity_name}</Caption>
      <IconButton
        icon={start ? "pause" : "play"}
        color={Colors.red500}
        size={20}
        onPress={handleToggle}
      />
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 100 / 2,
          backgroundColor:
            identity_weight > 0
              ? "green"
              : identity_weight < 0
              ? "red"
              : "grey",
        }}
      ></View>
    </View>
  );
};

export default function Home({ navigation }) {
  const sqlite = new Sqlite();
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHabits();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHabits = () => {
    sqlite.getHabits((_, { rows: { _array } }) => {
      setHabits(_array);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {habits.map((habit, index) => {
          return (
            <Habit
              key={`${index}${habit.started}`}
              onPlay={(habit_id) => {
                const stopHabits = habits.map((habit) => {
                  if (habit.habit_id != habit_id) {
                    habit.started = false;
                  }
                  return habit;
                });
                setHabits([...stopHabits]);
              }}
              habit_id={habit.habit_id}
              name={habit.name}
              started={habit.started}
              total_today={habit.total_today ? habit.total_today : 0}
              identity_name={habit.identity_name}
              identity_weight={habit.identity_weight}
            />
          );
        })}
        <View style={{ paddingBottom: 60 }}></View>
      </ScrollView>
      <FAB
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: 16,
        }}
        icon="plus"
        onPress={() => navigation.push("FormHabit")}
      />
    </SafeAreaView>
  );
}

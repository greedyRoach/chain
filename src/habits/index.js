import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, FAB, List, IconButton, Colors } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Sqlite from "../services/sqlite";

const Habit = ({ habit_id, name, started, identity_name, total_today}) => {
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
        sqlite.startHabit(
          habit_id,
          () => {
            setStart(true);
          }
        );
      };
    }

    sqlite.stopHabit(onDone);
  }

  return <List.Item
    onPress={() => {
      console.log('habit', habit_id);
    }}
    title={`${name}: (${total_today} minutos hoy)`}
    description={`${identity_name}`}
    right={start ? (props) => (
      <IconButton
        icon={"pause"}
        color={Colors.red500}
        size={20}
        onPress={handleToggle}
      />
    ) : (props) => (
      <IconButton
        icon={"play"}
        color={Colors.red500}
        size={20}
        onPress={handleToggle}
      />
    )}
  />
}

export default function Home({ navigation }) {
  const sqlite = new Sqlite();
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
  }, [])

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
              key={index}
              habit_id={habit.habit_id} 
              name={habit.name} 
              started={habit.started} 
              total_today={habit.total_today ? habit.total_today : 0}
              identity_name={habit.identity_name}
            />
          );
        })}
        <View style={{paddingBottom: 60}}></View>
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

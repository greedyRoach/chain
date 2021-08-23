import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Sqlite from "../services/sqlite";

export default function Index({ navigation }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthDate = new Date(1995, 4, 29);
  //75 is my pronosticated death age
  const deathDate = new Date(1995 + 75, 4, 29);
  const [remainingDays, setRemainingDays] = useState(0);
  const [remainingWeeks, setRemainingWeeks] = useState(0);
  const [RemainingMonths, setRemainingMonths] = useState(0);
  const [remainingYears, setRemainingYears] = useState(0);

  const [initDate, setInitDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth() + 1, 0)
  );
  const [data, setData] = useState([])

  const sqlite = new Sqlite();

  useEffect(() => {
    const diff = deathDate - today;
    setRemainingDays(Math.ceil(diff / 1000 / 60 / 60 / 24));
    setRemainingWeeks(Math.ceil(diff / 1000 / 60 / 60 / 24 / 7));
    setRemainingMonths(Math.ceil(diff / 1000 / 60 / 60 / 24 / 30));
    setRemainingYears(Math.ceil(diff / 1000 / 60 / 60 / 24 / 365));

    console.log("loading contributions 2");
    loadContributions();
  }, []);

  const loadContributions = () => {
    console.log("getRepetitions");
    sqlite.getRepetitions(
      (repetitions) => {
        console.log(1, repetitions.length);
        const now = new Date();

        repetitions = repetitions.map((repetition) => {
          //todo make this correction on the sqlite service? i think so, and replace as well in graps and habits list
          if (repetition.end == null) repetition.end = now;
          repetition.total_minutes = Math.floor(
            (repetition.end - repetition.init) / 1000
          );

          console.log('repetition total, minutes', repetition.total_minutes, repetition.end, repetition.init)
          return repetition;
        });

        let init = initDate;

        const data = [];

        while (init.getTime() < endDate.getTime()) {
          let end = new Date(
            init.getFullYear(),
            init.getMonth(),
            init.getDate() + 1
          );

          const repetitionsOfDay = repetitions.filter((repetition) => {
            return (
              repetition.init >= init.getTime() &&
              repetition.end <= end.getTime()
            );
          });

          data.push({
            init: new Date(init.getTime()),
            score: calculateScore(repetitionsOfDay),
          });
          init.setDate(init.getDate() + 1);
        }

        setData(data)
      },
      initDate,
      endDate
    );
  };

  const calculateScore = (repetitions) => {
    return Math.floor(repetitions.reduce((accumulator, currentValue) => {
      return (
        accumulator + currentValue.total_minutes * currentValue.identity_weight
      );
    }, 0) / 60);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <Text>RemainingDays: {remainingDays}</Text>
          <Text>RemainingWeeks: {remainingWeeks}</Text>
          <Text>RemainingMonths: {RemainingMonths}</Text>
          <Text>RemainingYears: {remainingYears}</Text>
        </View>
        {
          data.map((repetition, index) => {
            return (<View key={index}>
              <View style={{ width: 20, height: 20, backgroundColor: repetition.score > 0 ? 'green' : repetition.score < 0 ? 'red' : 'grey' }}></View>
              <Text> {repetition.init.toString()} </Text>
            </View>)
          })
        }
      </ScrollView>
    </SafeAreaView>
  );
}

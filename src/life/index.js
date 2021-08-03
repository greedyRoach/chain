import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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

  useEffect(() => {
    const diff = deathDate - today;
    setRemainingDays(Math.ceil(diff / 1000 / 60 / 60 / 24));
    setRemainingWeeks(Math.ceil(diff / 1000 / 60 / 60 / 24 / 7));
    setRemainingMonths(Math.ceil(diff / 1000 / 60 / 60 / 24 / 30));
    setRemainingYears(Math.ceil(diff / 1000 / 60 / 60 / 24 / 365));
  }, []);

  return (
    <SafeAreaView>
      <View style={{ padding: 10 }}>
        <Text>RemainingDays: {remainingDays}</Text>
        <Text>RemainingWeeks: {remainingWeeks}</Text>
        <Text>RemainingMonths: {RemainingMonths}</Text>
        <Text>RemainingYears: {remainingYears}</Text>
      </View>
    </SafeAreaView>
  );
}

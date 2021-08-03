import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./home";
import Identities from "./identities/index"
import FormIdentity from "./identities/form"
import Habits from "./habits/index";
import FormHabit from "./habits/form";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Identities"
        component={Identities}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Habits"
        component={Habits}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FormIdentity"
        component={FormIdentity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FormHabit"
        component={FormHabit}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

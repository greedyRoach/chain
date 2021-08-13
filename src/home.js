import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Habits from "./habits/index";
import Identities from "./identities/index";
import LifeDays from "./life/index"
import Graphs from "./graphs/index";

export default function Home({ navigation }) {
  const HabitsRoute = () => <Habits navigation={navigation}></Habits>;
  const IdentitiesRoute = () => <Identities navigation={navigation}></Identities>;
  const LifeDaysRoute = () => <LifeDays navigation={navigation}></LifeDays>;
  const GraphsRoute = () => <Graphs navigation={navigation}></Graphs>;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "habits", title: "Habits" },
    { key: "identities", title: "Id's" },
    { key: "life", title: "Life" },
    { key: "graphs", title: "Graphs" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    habits: HabitsRoute,
    identities: IdentitiesRoute,
    life: LifeDaysRoute,
    graphs: GraphsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

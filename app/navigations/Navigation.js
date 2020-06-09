import React from "react";
import { Icon } from "react-native-elements";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import FindScreen from "../navigations/FindStack";
import HomeScreen from "../navigations/HomeStack";
import ChatScreen from "../navigations/ChatStack";

const NavigationStack = createBottomTabNavigator(
  {
    Find: {
      screen: FindScreen,
      navigationOptions: () => ({
        tabBarLabel: "FIND",
        tabBarIcon: ({ tintColor }) => (
          <Icon type="font-awesome" name="search" size={30} color={tintColor} />
        ),
      }),
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        tabBarLabel: "HOME",
        tabBarIcon: ({ tintColor }) => (
          <Icon type="font-awesome" name="paw" size={30} color={tintColor} />
        ),
      }),
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: () => ({
        tabBarLabel: "CHAT",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="font-awesome"
            name="comments"
            size={30}
            color={tintColor}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: "Find",
    order: ["Find", "Home", "Chat"],
    tabBarOptions: {
      inactiveTintColor: "#6b7a8f",
      activeTintColor: "#f7882f",
    },
  }
);

export default createAppContainer(NavigationStack);

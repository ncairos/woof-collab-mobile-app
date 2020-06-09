import { createStackNavigator } from "react-navigation-stack";
import FindScreen from "../screens/Find";
import DogProfileScreen from "../components/Dog/DogProfile";
import CenterProfileScreen from "../components/Center/CenterProfile";
import FindByDogScreen from "../components/Find/FindByDog";
import FindByCenterScreen from "../components/Find/FindByCenter";

const FindStack = createStackNavigator({
  Find: {
    screen: FindScreen,
    navigationOptions: () => ({
      title: "Find",
    }),
  },
  FindByDog: {
    screen: FindByDogScreen,
    navigationOptions: () => ({
      title: "Dogs",
    }),
  },
  FindByCenter: {
    screen: FindByCenterScreen,
    navigationOptions: () => ({
      title: "Centers",
    }),
  },
  DogProfile: {
    screen: DogProfileScreen,
    navigationOptions: () => ({
      // title: props.navigation.state.params.restaurant.name,
      title: "Dog Profile",
    }),
  },
  CenterProfile: {
    screen: CenterProfileScreen,
    navigationOptions: () => ({
      title: "Center Profile",
    }),
  },
});

export default FindStack;

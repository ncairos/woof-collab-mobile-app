import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../screens/Home";
import AccountScreen from "../components/Account/Account";
import LoginScreen from "../components/Account/Login";
import SignupScreen from "../components/Account/Signup";
import CalendarScreen from "../components/Calendar";

const HomeScreenStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      title: "Home",
    }),
  },
  Account: {
    screen: AccountScreen,
    navigationOptions: () => ({
      title: "Account",
    }),
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: () => ({
      title: "Login",
    }),
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: () => ({
      title: "Signup",
    }),
  },
  Calendar: {
    screen: CalendarScreen,
    navigationOptions: () => ({
      title: "Calendar",
    }),
  },
});

export default HomeScreenStack;

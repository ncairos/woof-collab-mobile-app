import { createStackNavigator } from "react-navigation-stack";
import ChatScreen from "../screens/Chat";
import ChatRoomScreen from "../components/ChatRoom";

const ChatStack = createStackNavigator({
  Chat: {
    screen: ChatScreen,
    navigationOptions: () => ({
      title: "Chat",
    }),
  },
  ChatRoom: {
    screen: ChatRoomScreen,
    navigationOptions: () => ({
      title: "ChatRoom",
    }),
  },
});

export default ChatStack;

import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Input, Icon } from "react-native-elements";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ChatRoom() {
  const mock = [
    {
      id: 1,
      message: "Hello",
      side: "left",
      createdAt: "2020-05-18T10:57:59.166Z",
    },
    {
      id: 2,
      message: "Hi!",
      side: "right",
      createdAt: "2020-05-18T16:57:59.166Z",
    },
  ];

  // const fetchUserMsg = async () => {
  //   const user = await firebase.auth().currentUser.uid;
  //   db.collection("chats")
  //     .doc(`${user}`)
  //     .get()
  //     .then((doc) => {
  //       // setUserMsg(doc.data());
  //       console.log(doc.data());
  //     });
  // };

  // fetchUserMsg();

  return (
    <>
      <ScrollView>
        {mock.map((elm, idx) => (
          <Message
            key={idx}
            side={elm.side}
            message={elm.message}
            createdAt={elm.createdAt}
          />
        ))}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 10,
        }}
      >
        <InputMessage />
      </View>
    </>
  );
}

function Message(props) {
  const { side, message, createdAt } = props;
  const messageDate = new Date(createdAt);

  const isLeftSide = side === "left";

  const textStyles = isLeftSide ? styles.leftText : styles.rightText;
  const textContainer = isLeftSide ? styles.leftTextCont : styles.rightTextCont;
  const containerStyle = isLeftSide ? styles.leftCont : styles.rightCont;

  return (
    <>
      <View style={containerStyle}>
        <View style={textContainer}>
          <Text style={textStyles}>{message}</Text>
          <Text style={styles.textSmall}>
            {messageDate.getUTCHours()}:{messageDate.getMinutes()}{" "}
            {messageDate.getUTCHours() >= 12 ? "pm" : "am"}
          </Text>
        </View>
      </View>
    </>
  );
}

function InputMessage() {
  const [message, setMessage] = useState("");

  const handlePress = () => {
    const user = firebase.auth().currentUser;
    const payload = {
      message,
      userID: user.uid,
      createdAt: new Date(),
    };
    db.collection("chats")
      .doc(`${user.uid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          db.collection("chats")
            .doc(`${user.uid}`)
            .update({
              chat: firebase.firestore.FieldValue.arrayUnion(payload),
            });
        } else {
          db.collection("chats")
            .doc(`${user.uid}`)
            .set({ chat: [payload] });
        }
      });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <View style={{ width: "100%" }}>
        <Input
          placeholder="Type a message..."
          onChange={(elm) => setMessage(elm.nativeEvent.text)}
          rightIcon={
            <Icon
              type="material-community"
              name="send"
              color="#6b7a8f"
              onPress={handlePress}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftCont: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rightCont: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  leftTextCont: {
    width: "60%",
    backgroundColor: "#6b7a8f",
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    marginVertical: 2.5,
  },
  rightTextCont: {
    width: "60%",
    backgroundColor: "#f7882f",
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginVertical: 2.5,
  },
  leftText: {
    textAlign: "left",
    fontWeight: "bold",
    color: "white",
  },
  rightText: {
    textAlign: "right",
    fontWeight: "bold",
    color: "white",
  },
  textSmall: {
    marginTop: 10,
    fontSize: 12,
    color: "white",
    textAlign: "right",
  },
});

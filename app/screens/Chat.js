import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-elements";
import { withNavigation } from "react-navigation";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

function Chat(props) {
  const { navigation } = props;
  const [chatRoom, setChatRoom] = useState([]);

  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser.uid;
      db.collection("chatRoom")
        .where("user1ID", "==", user)
        .get()
        .then((response) => {
          const chatRoomArray = [];
          response.forEach((doc) => {
            chatRoomArray.push(doc.data());
          });
          setChatRoom(chatRoomArray);
        });
    })();
  }, []);

  return (
    <>
      <View>
        {chatRoom.map((elm, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate("ChatRoom")}
          >
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Avatar
                  size="large"
                  rounded
                  source={{
                    uri:
                      "https://api.adorable.io/avatars/285/abott@adorable.png",
                  }}
                />
                <Text style={styles.textMain}>{elm.user2Name}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "#6b7a8f",
          }}
        >
          COMING SOON
        </Text>
      </View>
    </>
  );
}

export default withNavigation(Chat);

const styles = StyleSheet.create({
  textMain: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f7882f",
    marginBottom: 5,
  },
  textSubtitle: {
    color: "#6b7a8f",
    marginBottom: 5,
  },
  textSmall: {
    marginTop: 10,
    fontSize: 12,
    color: "white",
    textAlign: "right",
  },
});

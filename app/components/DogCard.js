import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Avatar, Icon, Divider } from "react-native-elements";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function DogCard(props) {
  const { setReloadDog, navigation } = props;
  const { name, sex, age, images, id } = props.dogCatalog;
  const [dogImage, setDogImage] = useState(JSON.stringify(null));

  useEffect(() => {
    const img = images[3];
    firebase
      .storage()
      .ref(`dog-img/${img}`)
      .getDownloadURL()
      .then((result) => {
        setDogImage(result);
      });
  }, []);

  const removeDog = (id) => {
    db.collection("dogs")
      .doc(`${id}`)
      .delete()
      .then(() => {
        setReloadDog(true);
      });
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DogProfile", { dogInfo: props.dogCatalog })
      }
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar size="large" source={{ uri: dogImage }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.textMain}>
              Name: <Text style={styles.textSubtitle}>{name}</Text>{" "}
            </Text>
            <Text style={styles.textMain}>
              Sex: <Text style={styles.textSubtitle}>{sex}</Text>{" "}
            </Text>
            <Text style={styles.textMain}>
              Age: <Text style={styles.textSubtitle}>{age} years</Text>{" "}
            </Text>
          </View>
        </View>
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <Icon
            type="material-community"
            name="trash-can-outline"
            color="#f7882f"
            onPress={() => {
              removeDog(id);
            }}
          />
        </View>
      </View>
      <Divider style={{ marginVertical: 10 }} />
    </TouchableOpacity>
  );
}

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
});

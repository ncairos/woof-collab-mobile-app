import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, Avatar, Button } from "react-native-elements";

import Map from "../Map";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function CenterInfo(props) {
  const {
    navigation,
    centerInfo: {
      name,
      address,
      location,
      description,
      email,
      id,
      images,
      phone,
      webpage,
      schedule,
    },
  } = props;

  const [centerImg, setCenterImg] = useState([]);

  //----------PHONE FORMAT----------//
  let str = phone.toString();
  let chuncks = str.replace(/^(\d{3})(\d{3})/, "$1-$2-");

  useEffect(() => {
    const arrayImg = [];
    (async () => {
      await Promise.all(
        images.map(async (imgID) => {
          await firebase
            .storage()
            .ref(`center-img/${imgID}`)
            .getDownloadURL()
            .then((result) => {
              arrayImg.push(result);
            });
        })
      );
      setCenterImg(arrayImg);
    })();
  }, []);

  const handlePress = () => {
    const user = firebase.auth().currentUser;
    db.collection("chatRoom")
      .doc()
      .set({
        user1ID: user.uid,
        user1Name: user.displayName,
        user2ID: id,
        user2Name: name,
        createdAt: new Date(),
      })
      .then(() => navigation.navigate("Chat"));
  };

  return (
    <>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {centerImg.map((centerImg, idx) => (
            <Avatar
              key={idx}
              style={styles.contImg}
              source={{ uri: centerImg }}
            />
          ))}
        </View>
      </Card>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <Text style={styles.textMain2}>ABOUT US</Text>
        <Text style={styles.textSubtitle2}>{description}</Text>
        <Text style={styles.textMain2}>¡FIND US HERE!</Text>
        <Text style={styles.textSubtitle2}>{address}</Text>
        <Text style={styles.textSubtitle2}>Opening Hours: {schedule}</Text>
        <View style={{ marginBottom: 10 }}>
          <Map location={location} name={name} height={200} />
        </View>
        <Text style={styles.textMain2}>CONTACTS</Text>
        <Text style={styles.textSmall}>
          {webpage} | +34 {chuncks} | {email}
        </Text>
        <Button
          title="CHAT WITH US"
          containerStyle={styles.btnCont}
          buttonStyle={styles.btnStyle}
          onPress={handlePress}
        />
      </Card>
    </>
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7a8f",
    marginBottom: 5,
  },
  textSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
  textMain2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f7882f",
    marginBottom: 5,
    textAlign: "center",
  },
  textSubtitle2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7a8f",
    marginBottom: 5,
    textAlign: "center",
  },
  contImg: {
    height: 70,
    width: 70,
  },
  btnCont: {
    width: "100%",
    marginTop: 10,
  },
  btnStyle: {
    backgroundColor: "#6b7a8f",
  },
});

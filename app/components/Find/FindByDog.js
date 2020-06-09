import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Avatar, Icon, Divider } from "react-native-elements";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function FindByDog(props) {
  const { navigation } = props;
  const [dogCollection, setDogCollection] = useState([]);

  useEffect(() => {
    (async () => {
      db.collection("dogs")
        .get()
        .then((response) => {
          const dogArray = [];
          response.forEach((doc) => {
            let dogID = doc.data();
            dogID.id = doc.id;
            dogArray.push(dogID);
          });
          setDogCollection(dogArray);
        });
    })();
  }, []);

  return (
    <>
      {dogCollection.map((elm, idx) => (
        <View key={idx}>
          <DogListCard dogCollection={elm} navigation={navigation} />
        </View>
      ))}
    </>
  );
}

function DogListCard(props) {
  const { navigation } = props;
  const { name, age, sex, createdBy, images, rating } = props.dogCollection;
  const [centerInfo, setCenterInfo] = useState({});
  const [dogImage, setDogImage] = useState(JSON.stringify(null));

  useEffect(() => {
    db.collection("centers")
      .doc(`${createdBy}`)
      .get()
      .then((doc) => {
        setCenterInfo(doc.data());
      });
  }, []);

  useEffect(() => {
    const img = images[0];
    firebase
      .storage()
      .ref(`dog-img/${img}`)
      .getDownloadURL()
      .then((result) => {
        setDogImage(result);
      });
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DogProfile", { dogInfo: props.dogCollection })
      }
    >
      <Card>
        <View style={styles.mainCard}>
          <Avatar size="large" source={{ uri: dogImage }} />
          <View style={{ paddingLeft: 10, width: "50%" }}>
            <Text style={styles.textMain}>
              Name: <Text style={styles.textSubtitle}>{name}</Text>
            </Text>
            <Text style={styles.textMain}>
              Sex: <Text style={styles.textSubtitle}>{sex}</Text>
            </Text>
            <Text style={styles.textMain}>
              Age: <Text style={styles.textSubtitle}>{age}</Text>
            </Text>
          </View>
          <View style={styles.ratingView}>
            <Icon
              type="material-community"
              name="star"
              color="#f7882f"
              size={30}
            />
            <Text style={styles.textRating}>{rating}/5</Text>
          </View>
        </View>
        <Divider style={{ marginTop: 10 }} />
        <Text
          style={styles.textSmall}
          onPress={() => console.log("GO TO CENTER")}
        >
          {centerInfo.name}
        </Text>
      </Card>
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
  textSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7a8f",
    marginTop: 10,
    textAlign: "center",
  },
  textRating: { fontSize: 20, fontWeight: "bold", color: "#6b7a8f" },
  mainCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  ratingView: {
    padding: 5,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
});

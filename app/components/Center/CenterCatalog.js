import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Avatar, Icon, Divider } from "react-native-elements";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function CenterCatalog(props) {
  const {
    navigation,
    centerInfo: { id },
  } = props;

  const [dogInfo, setDogInfo] = useState([]);

  useEffect(() => {
    (async () => {
      db.collection("dogs")
        .where("createdBy", "==", id)
        .get()
        .then((response) => {
          const dogArray = [];
          response.forEach((doc) => {
            let dogID = doc.data();
            dogID.id = doc.id;
            dogArray.push(dogID);
          });
          setDogInfo(dogArray);
        });
    })();
  }, []);

  return (
    <>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <Text style={styles.textMain2}>¡MEET OUR DOGS!</Text>
        <View>
          {dogInfo.map((elm, idx) => (
            <DogCard key={idx} dogInfo={elm} navigation={navigation} />
          ))}
        </View>
      </Card>
    </>
  );
}

function DogCard(props) {
  const { navigation } = props;
  const { name, age, sex, images, rating } = props.dogInfo;
  const [dogImage, setDogImage] = useState(JSON.stringify(null));

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
        navigation.navigate("DogProfile", { dogInfo: props.dogInfo })
      }
    >
      <View style={styles.mainCard}>
        <Avatar size="large" source={{ uri: dogImage }} />
        <View
          style={{
            paddingLeft: 10,
            width: "50%",
            borderRightWidth: 2,
            borderRightColor: "#f7882f",
          }}
        >
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
      <Divider style={{ marginVertical: 10 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
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
  textMain2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f7882f",
    textAlign: "center",
  },
  textSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
  ratingView: {
    padding: 5,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  textRating: { fontSize: 20, fontWeight: "bold", color: "#6b7a8f" },
});

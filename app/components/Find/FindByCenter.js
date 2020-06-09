import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Divider, Image } from "react-native-elements";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function FindByCenter(props) {
  const { navigation } = props;
  const [centerCollection, setCenterCollection] = useState([]);

  useEffect(() => {
    (async () => {
      db.collection("centers")
        .get()
        .then((response) => {
          const centerArray = [];
          response.forEach((doc) => {
            let centerID = doc.data();
            centerID.id = doc.id;
            centerArray.push(centerID);
          });
          setCenterCollection(centerArray);
        });
    })();
  }, []);

  return (
    <>
      {centerCollection.map((elm, idx) => (
        <View key={idx}>
          <CenterListCard centerCollection={elm} navigation={navigation} />
        </View>
      ))}
    </>
  );
}

function CenterListCard(props) {
  const { navigation } = props;
  const { name, address, phone, images, webpage, id } = props.centerCollection;
  const [dogSize, setDogSize] = useState([]);
  const [centerImage, setCenterImage] = useState(JSON.stringify(null));

  //----------PHONE FORMAT----------//
  let str = phone.toString();
  let chuncks = str.replace(/^(\d{3})(\d{3})/, "$1-$2-");

  useEffect(() => {
    db.collection("dogs")
      .where("createdBy", "==", id)
      .get()
      .then((snap) => {
        setDogSize(snap.size);
      });
  }, []);

  useEffect(() => {
    const img = images[0];
    firebase
      .storage()
      .ref(`center-img/${img}`)
      .getDownloadURL()
      .then((result) => {
        setCenterImage(result);
      });
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CenterProfile", {
          centerInfo: props.centerCollection,
        })
      }
    >
      <Card>
        <View style={styles.mainCard}>
          <Image
            style={{ width: "100%", height: 150, marginBottom: 10 }}
            source={{ uri: centerImage }}
          />
          <View style={{ width: "100%" }}>
            <Text style={styles.textMain}>{`${name}`.toUpperCase()}</Text>
            <Text style={styles.textMain}>
              Address: <Text style={styles.textSubtitle}>{address}</Text>
            </Text>
            <Text style={styles.textMain}>
              Phone: <Text style={styles.textSubtitle}>+34 {chuncks}</Text>
            </Text>
            <Text style={styles.textMain}>
              Webpage: <Text style={styles.textSubtitle}>{webpage}</Text>
            </Text>
          </View>
        </View>
        <Divider style={{ marginTop: 10 }} />
        <Text style={styles.textSmall}>
          ¡We have {dogSize} dogs for you to meet!
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
    textAlign: "center",
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
    justifyContent: "space-between",
  },
});

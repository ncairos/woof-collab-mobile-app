import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Icon, Image } from "react-native-elements";

import DogCard from "./DogCard";
import DogForm from "./Setting/DogForm";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function MyInfo(props) {
  const { navigation, toastRef } = props;
  const [visibleForm, setVisibleForm] = useState(false);

  const [reloadDog, setReloadDog] = useState(false);
  const [dogCatalog, setDogCatalog] = useState([]);

  const toogleSwitch = () => setVisibleForm((previousState) => !previousState);

  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser.uid;
      db.collection("dogs")
        .where("createdBy", "==", user)
        .get()
        .then((response) => {
          const dogArray = [];
          response.forEach((doc) => {
            let dogID = doc.data();
            dogID.id = doc.id;
            dogArray.push(dogID);
          });
          setDogCatalog(dogArray);
        });
      setReloadDog(false);
    })();
  }, [reloadDog]);

  return (
    <ScrollView>
      <Card containerStyle={{ marginHorizontal: 0, width: "100%" }}>
        <Icon
          type="material-community"
          name="calendar"
          color="#f7882f"
          size={35}
          onPress={() => navigation.navigate("Calendar", { dogCatalog })}
        />
        <Text style={styles.textSub}>CALENDAR</Text>
      </Card>

      <Card containerStyle={{ marginHorizontal: 0 }}>
        <TouchableOpacity onPress={toogleSwitch}>
          <Card
            containerStyle={{
              marginHorizontal: 0,
              backgroundColor: "#6b7a8f",
              paddingVertical: 5,
              marginVertical: 0,
            }}
          >
            <Icon
              type="material-community"
              name="plus"
              color="white"
              size={20}
            />
          </Card>
        </TouchableOpacity>
        <View style={{ marginBottom: 20 }}>
          {visibleForm && (
            <DogForm
              setVisibleForm={setVisibleForm}
              setReloadDog={setReloadDog}
              toastRef={toastRef}
            />
          )}
        </View>

        {dogCatalog.length == 0 && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.shadow}>
              <Image
                source={require("../../assets/img/LOGO-WC.png")}
                style={{ height: 200, width: 200 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.textSub}>THIS CENTER DOES NOT HAVE DOGS</Text>
          </View>
        )}
        {dogCatalog.map((elm, idx) => (
          <DogCard
            key={idx}
            dogCatalog={elm}
            setReloadDog={setReloadDog}
            navigation={navigation}
          />
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textSub: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
});

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Icon, Avatar, Rating, Divider } from "react-native-elements";

import ReviewForm from "../Setting/ReviewForm";
import DogReview from "../Dog/DogReview";

import * as firebase from "firebase";

export default function DogInfo(props) {
  const {
    toastRef,
    dogInfo: {
      weight,
      size,
      personality,
      description,
      color,
      breed,
      images,
      id,
      rating,
    },
  } = props;
  const [visibleForm, setVisibleForm] = useState(false);
  const [reloadReview, setReloadReview] = useState(false);

  const [dogImg, setDogImg] = useState([]);

  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  const toogleSwitch = () => setVisibleForm((previousState) => !previousState);

  useEffect(() => {
    const arrayImg = [];
    (async () => {
      await Promise.all(
        images.map(async (imgID) => {
          await firebase
            .storage()
            .ref(`dog-img/${imgID}`)
            .getDownloadURL()
            .then((result) => {
              arrayImg.push(result);
            });
        })
      );
      setDogImg(arrayImg);
    })();
  }, []);

  return (
    <>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {dogImg.map((dogImg, idx) => (
            <Avatar key={idx} style={styles.contImg} source={{ uri: dogImg }} />
          ))}
        </View>
      </Card>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <View style={{ marginBottom: 10 }}>
          <Rating imageSize={25} startingValue={rating} readonly />
        </View>
        <Divider style={{ marginBottom: 10 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.textMain}>
            WEIGHT: <Text style={styles.textSubtitle}>{weight}kl</Text>
          </Text>
          <Text style={styles.textMain}>---</Text>
          <Text style={styles.textMain}>
            SIZE: <Text style={styles.textSubtitle}>{size}</Text>
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.textMain}>
            BREED: <Text style={styles.textSubtitle}>{breed}</Text>
          </Text>
          <Text style={styles.textMain}>---</Text>
          <Text style={styles.textMain}>
            COLOR: <Text style={styles.textSubtitle}>{color}</Text>
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.textMain2}>PERSONALITY</Text>
          <Text style={styles.textSubtitle2}>{personality}</Text>
          <Text style={styles.textMain2}>DOG DESCRIPTION</Text>
          <Text style={styles.textSubtitle2}>{description}</Text>
        </View>
      </Card>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        {userLogged ? (
          <>
            <Text style={styles.textMain2}>ADD REVIEW</Text>
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
          </>
        ) : (
          <View>
            <Text style={styles.textSmall}>SIGN IN TO LEAVE A REVIEW</Text>
          </View>
        )}
        <View>
          {visibleForm && (
            <ReviewForm
              dogID={id}
              setVisibleForm={setVisibleForm}
              setReloadReview={setReloadReview}
              toastRef={toastRef}
            />
          )}
          <DogReview
            dogID={id}
            reloadReview={reloadReview}
            setReloadReview={setReloadReview}
          />
        </View>
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
  textSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
});

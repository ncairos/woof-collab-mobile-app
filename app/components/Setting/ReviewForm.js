import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, AirbnbRating } from "react-native-elements";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ReviewForm(props) {
  const { toastRef, dogID, setVisibleForm, setReloadReview } = props;
  const [error, setError] = useState({});
  const [loadingIsVisible, setLoadingIsVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(null);

  const addReview = () => {
    setError({});
    if (!title || !review) {
      setError({
        title: "This field cannot be empty",
        review: "This field cannot be empty",
      });
    } else if (!title) {
      setError({ title: "This field cannot be empty" });
    } else if (!review) {
      setError({ rating: "This field cannot be empty" });
    } else if (rating === null) {
      toastRef.current.show("You need to give a score");
    } else {
      setLoadingIsVisible(true);
      const user = firebase.auth().currentUser;
      db.collection("reviews")
        .doc()
        .set({
          userID: user.uid,
          userAvatar: user.photoURL,
          dogID: dogID,
          title: title,
          review: review,
          rating: rating,
          createAt: new Date(),
        })
        .then(() => {
          updateDog();
        });
    }
  };

  const updateDog = () => {
    const dogRef = db.collection("dogs").doc(dogID);

    dogRef.get().then((response) => {
      const dogData = response.data();
      const ratingTotal = dogData.ratingTotal + rating;
      const voteQuantity = dogData.voteQuantity + 1;
      const ratingResult = ratingTotal / voteQuantity;
      dogRef
        .update({ rating: ratingResult, ratingTotal, voteQuantity })
        .then(() => {
          setLoadingIsVisible(false);
          setReloadReview(true);
          toastRef.current.show("Review has been sent");
          setVisibleForm(false);
        });
    });
  };

  return (
    <View>
      <Input
        placeholder="TITLE"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setTitle(elm.nativeEvent.text)}
        errorMessage={error.title}
        autoCapitalize="none"
      />
      <Input
        placeholder="REVIEW"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        multiline={true}
        maxLength={140}
        inputContainerStyle={{ height: 100 }}
        onChange={(elm) => setReview(elm.nativeEvent.text)}
        errorMessage={error.review}
        autoCapitalize="none"
      />
      <Text style={styles.textSmall}>MAX 140 CHARACTERS</Text>

      <View style={{ height: 100 }}>
        <AirbnbRating
          count={5}
          readonly
          defaultRating={0}
          size={30}
          onFinishRating={(value) => setRating(value)}
          style={{ fontSize: 10 }}
        />
      </View>
      <Button
        title="UPDATE"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={loadingIsVisible}
        onPress={addReview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnCont: {
    width: "100%",
  },
  btnStyle: {
    backgroundColor: "#6b7a8f",
  },
  textSmall: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
    color: "#6b7a8f",
  },
});

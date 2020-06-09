import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Rating } from "react-native-elements";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function DogReview(props) {
  const { dogID, reloadReview, setReloadReview } = props;

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      const resultReview = [];
      db.collection("reviews")
        .where("dogID", "==", dogID)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            resultReview.push(doc.data());
          });
          setReviews(resultReview);
        });
      setReloadReview(false);
    })();
  }, [reloadReview]);

  return (
    <>
      {reviews.map((elm, idx) => (
        <ReviewCard key={idx} dogReview={elm} />
      ))}
    </>
  );
}

function ReviewCard(props) {
  const { title, review, rating, createAt, userAvatar } = props.dogReview;
  const reviewDate = new Date(createAt.seconds * 1000);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        paddingVertical: 10,
        borderBottomColor: "#f7882f",
        borderBottomWidth: 1,
      }}
    >
      <View style={{ width: "25%" }}>
        <Avatar
          rounded
          size="large"
          source={{
            url: userAvatar
              ? userAvatar
              : "https://api.adorable.io/avatars/285/abott@adorable.png",
          }}
        />
      </View>
      <View style={{ width: "75%", padding: 10 }}>
        <Text style={styles.textMain}>{title}</Text>
        <Text style={styles.textSubtitle}>{review}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Rating imageSize={15} startingValue={rating} readonly />
          <View>
            <Text style={styles.textDate}>
              {reviewDate.getDate()}/{reviewDate.getMonth() + 1}/
              {reviewDate.getFullYear()} - {reviewDate.getHours()}:
              {reviewDate.getMinutes() < 10 ? "0" : ""}
              {reviewDate.getMinutes()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textMain: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f7882f",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  textSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7a8f",
    marginBottom: 5,
  },
  textDate: {
    fontSize: 12,
    color: "#6b7a8f",
  },
});

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Divider, Card } from "react-native-elements";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function CenterCalendar(props) {
  const { navigation } = props;
  const { dogCatalog } = navigation.state.params;

  const [walkerCalendar, setWalkerCalendar] = useState([]);

  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser.uid;
      db.collection("calendar")
        .where("userID", "==", user)
        .get()
        .then((response) => {
          let calendarArray = [];
          response.forEach((doc) => {
            let calendarID = doc.data();
            calendarID.id = doc.id;
            calendarArray.push(calendarID);
          });
          setWalkerCalendar(calendarArray);
        });
    })();
  }, []);

  return (
    <>
      {dogCatalog.length === 0
        ? walkerCalendar.map((elm, idx) => (
            <Card key={idx}>
              <Text style={styles.textMain}>
                {`${elm.dogName}`.toUpperCase()}
              </Text>
              <Divider style={{ marginVertical: 10 }} />
              <Text style={styles.textSubtitle}>
                <Text style={styles.highlight}>Date: </Text> {elm.date}
                <Text style={styles.highlight}> Time: </Text>
                {elm.slot}
              </Text>
            </Card>
          ))
        : dogCatalog.map((elm, idx) => <CenterCard key={idx} dogInfo={elm} />)}
    </>
  );
}

function CenterCard(props) {
  const {
    dogInfo: { name, id },
  } = props;

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async () => {
      db.collection("calendar")
        .where("dogID", "==", id)
        .get()
        .then((response) => {
          let bookingArray = [];
          response.forEach((doc) => {
            let bookedID = doc.data();
            bookedID.id = doc.id;
            bookingArray.push(bookedID);
          });
          setBookings(bookingArray);
        });
    })();
  }, []);

  return (
    <Card>
      <Text style={styles.textMain}>{`${name}`.toUpperCase()}</Text>
      <Text style={styles.textSmall}> Has {bookings.length} appointments</Text>

      {bookings.map((elm, idx) => (
        <View key={idx}>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={styles.textSubtitle}>
            <Text style={styles.highlight}>Date: </Text> {elm.date}
            <Text style={styles.highlight}> Time: </Text>
            {elm.slot}
          </Text>
          <Text style={styles.textSmall}>
            Walker: {`${elm.username}`.toUpperCase()}
          </Text>
        </View>
      ))}
    </Card>
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
  highlight: {
    color: "#F7882F",
  },
  textSubtitle: {
    color: "#6b7a8f",
    marginBottom: 5,
    textAlign: "center",
  },
  textSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
});

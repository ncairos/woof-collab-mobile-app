import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Button, Icon } from "react-native-elements";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ConfirmForm(props) {
  const {
    toastRef,
    setModalIsVisible,
    selected,
    setReloadCalendar,
    dogInfo: { name, id },
  } = props;

  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);
  const [slot, setSlot] = useState("");

  const addAppointment = () => {
    if (!selected) {
      toastRef.current.show("You need to select a date");
    } else {
      setLoadingIsVisible(true);
      const userID = firebase.auth().currentUser;
      db.collection("calendar")
        .doc()
        .set({
          dogID: id,
          dogName: name,
          userID: userID.uid,
          username: userID.displayName,
          mark: selected,
          date: fetchDate(selected),
          slot: slot,
          createdAt: new Date(),
        })
        .then(() => {
          setLoadingIsVisible(false);
          setReloadCalendar(true);
          toastRef.current.show("Appointment has been created");
          setModalIsVisible(false);
        })
        .catch(() => {
          setLoadingIsVisible(false);
          toastRef.current.show("Error creating appointment, Try Again Later!");
        });
    }
  };

  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchDate = (selected) => {
    const bookedDate = new Date(selected);
    const month = bookedDate.getMonth();
    return (
      bookedDate.getDate() +
      " " +
      monthArray[month] +
      " " +
      bookedDate.getFullYear()
    );
  };

  return (
    <View>
      <Icon
        type="material-community"
        name="close-circle"
        color="#f7882f"
        size={25}
        containerStyle={{ marginBottom: 10 }}
        onPress={() => setModalIsVisible(false)}
      />
      <Text style={styles.textMain}>
        Are you sure you want to book an appointment for the
      </Text>
      <Text style={styles.textSubtitle}>{fetchDate(selected)}</Text>
      <Text style={styles.textMain}>with</Text>
      <Text style={styles.textSubtitle}>{`${name}`.toUpperCase()}</Text>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.textMain}>CHOOSE A SLOT</Text>
        <TouchableOpacity onPress={() => setSlot("10:00 - 12:00")}>
          <Card
            containerStyle={
              slot === "10:00 - 12:00" ? styles.activeSlot : styles.disableSlot
            }
          >
            <Text
              style={
                slot === "10:00 - 12:00"
                  ? styles.textSmallActive
                  : styles.textSmall
              }
            >
              10:00 - 12:00
            </Text>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSlot("14:00 - 16:00")}>
          <Card
            containerStyle={
              slot === "14:00 - 16:00" ? styles.activeSlot : styles.disableSlot
            }
          >
            <Text
              style={
                slot === "14:00 - 16:00"
                  ? styles.textSmallActive
                  : styles.textSmall
              }
            >
              14:00 - 16:00
            </Text>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSlot("18:00 - 20:00")}>
          <Card
            containerStyle={
              slot === "18:00 - 20:00" ? styles.activeSlot : styles.disableSlot
            }
          >
            <Text
              style={
                slot === "18:00 - 20:00"
                  ? styles.textSmallActive
                  : styles.textSmall
              }
            >
              18:00 - 20:00
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
      <Button
        title="CONFIRM BOOKING"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={LoadingIsVisible}
        onPress={addAppointment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnCont: {
    width: "100%",
    marginTop: 10,
  },
  btnStyle: {
    backgroundColor: "#6b7a8f",
  },
  textMain: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f7882f",
    textAlign: "center",
    textTransform: "uppercase",
  },
  textSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
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
  textSmallActive: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  activeSlot: {
    paddingVertical: 0,
    marginVertical: 10,
    width: "50%",
    backgroundColor: "#6b7a8f",
  },
  disableSlot: {
    paddingVertical: 0,
    marginVertical: 10,
    width: "50%",
  },
});

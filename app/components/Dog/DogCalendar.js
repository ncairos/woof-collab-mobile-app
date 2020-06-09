import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import { Calendar } from "react-native-calendars";

import Modal from "../Modal";
import CalendarForm from "../Setting/CalendarForm";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function DogCalendar(props) {
  const { dogInfo, toastRef, reloadCalendar, setReloadCalendar } = props;
  const [selected, setSelected] = useState();

  const [bookedDay, setBookedDay] = useState([]);

  const [marked, setMarked] = useState({});

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const onDayPress = (day) => {
    setSelected(day.dateString);
    setReloadCalendar(true);
  };

  useEffect(() => {
    (async () => {
      db.collection("calendar")
        .where("dogID", "==", dogInfo.id)
        .get()
        .then((response) => {
          const calendarArray = [];
          response.forEach((doc) => {
            let calendar = doc.data();
            calendarArray.push(calendar.mark);
          });
          setBookedDay(calendarArray);
          markDate();
          setReloadCalendar(false);
        });
    })();
  }, [reloadCalendar]);

  const markDate = () => {
    let arr = bookedDay;
    let obj = arr.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: { selected: true, selectedColor: "#6b7a8f" },
        }),
      { [selected]: { selected: true, selectedColor: "#f7882f" } }
    );
    setMarked(obj);
  };

  return (
    <View>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ flexDirection: "row" }}>
            <Icon
              type="material-community"
              name="checkbox-blank-circle"
              color="#f7882f"
              size={15}
              containerStyle={{ marginRight: 5 }}
            />
            <Text style={styles.textSmall}>Selected Day</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Icon
              type="material-community"
              name="checkbox-blank-circle"
              color="#6b7a8f"
              size={15}
              containerStyle={{ marginRight: 5 }}
            />
            <Text style={styles.textSmall}>Booked Days</Text>
          </View>
        </View>
      </Card>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <Calendar
          style={styles.calendar}
          hideExtraDays
          onDayPress={onDayPress}
          markedDates={marked}
          theme={{
            arrowColor: "#f7882f",
            textMonthFontWeight: "bold",
            todayTextColor: "#f7882f",
            monthTextColor: "#6b7a8f",
          }}
        />
      </Card>
      <Button
        title="BOOK AN APPOINTMENT"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        onPress={() => setModalIsVisible(true)}
      />
      <Modal isVisible={modalIsVisible} setModalIsVisible={setModalIsVisible}>
        <CalendarForm
          dogInfo={dogInfo}
          setModalIsVisible={setModalIsVisible}
          selected={selected}
          setReloadCalendar={setReloadCalendar}
          toastRef={toastRef}
        />
      </Modal>
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
  textSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
});

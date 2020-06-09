import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { Avatar } from "react-native-elements";

import * as firebase from "firebase";

export default function DogBanner(props) {
  const {
    dogInfo: { name, age, sex, images },
    infoDog,
    setInfoDog,
    calendarDog,
    setCalendarDog,
    setReloadCalendar,
  } = props;

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
    <View>
      <ImageBackground
        style={{ height: 100, justifyContent: "center", alignItems: "center" }}
        source={require("../../../assets/img/BG-WC.png")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar size="large" source={{ uri: dogImage }} />
          <View style={{ marginLeft: 30 }}>
            <Text style={styles.textMain}>
              ¡THIS IS {`${name}`.toUpperCase()}!
            </Text>
            <Text style={styles.textSub}>{`${sex}`.toUpperCase()}</Text>
            <Text style={styles.textSub}>{age}YEAR OLD</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.viewMenu}>
        <View style={infoDog ? styles.activeView : styles.disableView}>
          <Text
            style={styles.textMenu}
            onPress={() => {
              setInfoDog(true), setCalendarDog(false), setReloadCalendar(false);
            }}
          >
            DOG INFO
          </Text>
        </View>
        <View style={calendarDog ? styles.activeView : styles.disableView}>
          <Text
            style={styles.textMenu}
            onPress={() => {
              setInfoDog(false), setCalendarDog(true), setReloadCalendar(true);
            }}
          >
            CALENDAR
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textMain: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textSub: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7a8f",
    textAlign: "center",
  },
  textMenu: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  viewMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: "#6b7a8f",
    marginBottom: 20,
  },
  activeView: {
    backgroundColor: "#6b7a8f",
    height: 60,
    width: "50%",
    justifyContent: "center",
    borderRadius: 5,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  disableView: {
    backgroundColor: "#6b7a8f",
    height: 50,
    width: "50%",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
});

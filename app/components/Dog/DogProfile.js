import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Toast from "react-native-easy-toast";

import DogBanner from "./DogBanner";
import DogInfo from "./DogInfo";
import DogCalendar from "./DogCalendar";

export default function DogProfile(props) {
  const { navigation } = props;
  const { dogInfo } = navigation.state.params;
  const toastRef = useRef();

  const [infoDog, setInfoDog] = useState(true);
  const [calendarDog, setCalendarDog] = useState();

  const [reloadCalendar, setReloadCalendar] = useState(false);

  return (
    <ScrollView>
      <DogBanner
        dogInfo={dogInfo}
        infoDog={infoDog}
        setInfoDog={setInfoDog}
        calendarDog={calendarDog}
        setCalendarDog={setCalendarDog}
        setReloadCalendar={setReloadCalendar}
      />
      <View style={styles.viewMain}>
        {infoDog && <DogInfo dogInfo={dogInfo} toastRef={toastRef} />}
        {calendarDog && (
          <DogCalendar
            dogInfo={dogInfo}
            toastRef={toastRef}
            reloadCalendar={reloadCalendar}
            setReloadCalendar={setReloadCalendar}
          />
        )}
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    marginHorizontal: 20,
  },
});

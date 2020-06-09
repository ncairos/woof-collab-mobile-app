import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading(props) {
  const { isVisible, text } = props;
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0, .5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.viewOverlay}>
        <ActivityIndicator size="large" color="#f7882f" />
        {text && <Text style={styles.textOverlay}>{text}</Text>}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  viewOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    height: 100,
    width: 200,
    backgroundColor: "#fff",
    borderColor: "#f7882f",
    borderWidth: 2,
    borderRadius: 10,
  },
  textOverlay: {
    textTransform: "uppercase",
    marginTop: 10,
    color: "#f7882f",
    fontWeight: "bold",
  },
});

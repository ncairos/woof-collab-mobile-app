import React, { useState } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { Avatar } from "react-native-elements";

export default function ProfileCard(props) {
  const {
    userInfo: { displayName, photoURL },
    centerInfo,
    infoMenu,
    setInfoMenu,
    settingMenu,
    setSettingMenu,
  } = props;

  return (
    <>
      <ImageBackground
        style={{ height: 100, justifyContent: "center", alignItems: "center" }}
        source={require("../../assets/img/BG-WC.png")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            size="large"
            source={{
              uri: photoURL
                ? photoURL
                : "https://api.adorable.io/avatars/285/abott@adorable.png",
            }}
          />
          <View style={{ marginLeft: 30 }}>
            <Text style={styles.textMain}>
              ¡HELLO {`${displayName}`.toUpperCase()}!
            </Text>
            {centerInfo ? (
              <Text style={styles.textSub}>CENTER</Text>
            ) : (
              <Text style={styles.textSub}>WALKER</Text>
            )}
          </View>
        </View>
      </ImageBackground>
      <View style={styles.viewMenu}>
        <View style={infoMenu ? styles.activeView : styles.disableView}>
          <Text
            style={styles.textMenu}
            onPress={() => {
              setInfoMenu(true), setSettingMenu(false);
            }}
          >
            MY INFO
          </Text>
        </View>
        <View style={settingMenu ? styles.activeView : styles.disableView}>
          <Text
            style={styles.textMenu}
            onPress={() => {
              setInfoMenu(false), setSettingMenu(true);
            }}
          >
            SETTINGS
          </Text>
        </View>
      </View>
    </>
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
  textProfile: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7a8f",
    marginTop: 10,
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

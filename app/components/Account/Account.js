import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image, Button } from "react-native-elements";
import { withNavigation } from "react-navigation";

function Account(props) {
  const { navigation } = props;
  return (
    <View style={styles.viewMain}>
      <View style={styles.shadow}>
        <Image
          source={require("../../../assets/img/LOGO-WC.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </View>
      <Button
        title="LOGIN"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        title="SIGNUP"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        onPress={() => navigation.navigate("Signup")}
      />
      <Text style={styles.textMain}>¡BE A PART OF OUR WOOF FAMILY!</Text>
    </View>
  );
}

export default withNavigation(Account);

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  logoImg: {
    height: 200,
    width: "100%",
  },
  btnCont: {
    width: "100%",
    marginVertical: 10,
  },
  btnStyle: { backgroundColor: "#6b7a8f" },
  textMain: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#6b7a8f",
  },
});

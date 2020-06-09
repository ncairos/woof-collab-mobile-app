import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image, Card, Icon } from "react-native-elements";
import { withNavigation } from "react-navigation";

function Find(props) {
  const { navigation } = props;
  return (
    <View style={styles.viewMain}>
      <View style={styles.shadow}>
        <Image
          source={require("../../assets/img/LOGO-WC.png")}
          style={styles.logImg}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("FindByDog", { navigation })}
      >
        <Card containerStyle={styles.card}>
          <Icon
            type="material-community"
            name="dog-side"
            color="#6b7a8f"
            size={45}
          />
          <Text style={styles.textMain}>FIND BY DOG</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("FindByCenter", { navigation })}
      >
        <Card containerStyle={styles.card}>
          <Icon
            type="material-community"
            name="home"
            color="#6b7a8f"
            size={45}
          />
          <Text style={styles.textMain}>FIND BY CENTER</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

export default withNavigation(Find);

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    justifyContent: "center",
  },
  logImg: {
    height: 200,
    width: "100%",
    marginBottom: 10,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  card: {
    height: "auto",
    justifyContent: "center",
  },
  textMain: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#6b7a8f",
    textAlign: "center",
  },
});

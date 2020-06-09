import React, { useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image, Input, Icon, Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../Loading";

import * as firebase from "firebase";
import { validateEmail } from "../../utils/Validation";
import { withNavigation } from "react-navigation";

function Login(props) {
  const { navigation } = props;
  const toastRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({});

  const [loadingIsVisible, setLoadingIsVisible] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const login = async () => {
    setLoadingIsVisible(true);
    setError({});
    if (!email || !password) {
      let objError = {};
      !email && (objError.email = "You must fill out everything");
      !password && (objError.password = "You must fill out everything");
      setError(objError);
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("The email is not correct");
      } else {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            navigation.navigate("Home");
          })
          .catch(() => {
            toastRef.current.show("Incorrect email or password");
          });
      }
    }
    setLoadingIsVisible(false);
  };

  return (
    <View style={styles.viewMain}>
      <View style={styles.shadow}>
        <Image
          source={require("../../../assets/img/LOGO-WC.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </View>
      <Input
        placeholder="EMAIL ADDRESS"
        containerStyle={{ marginVertical: 10 }}
        onChange={(elm) => setEmail(elm.nativeEvent.text)}
        errorMessage={error.email}
        leftIcon={
          <Icon
            type="material-community"
            name="email"
            iconStyle={styles.leftIcon}
          />
        }
      />
      <Input
        placeholder="PASSWORD"
        containerStyle={{ marginVertical: 10 }}
        password={true}
        secureTextEntry={hidePassword}
        onChange={(elm) => setPassword(elm.nativeEvent.text)}
        errorMessage={error.password}
        leftIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "lock" : "lock-open"}
            iconStyle={styles.leftIcon}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Button
        title="LOGIN"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        onPress={login}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading text="Login Account" isVisible={loadingIsVisible} />
    </View>
  );
}

export default withNavigation(Login);

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: "center",
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
  leftIcon: { color: "#f7882f", marginRight: 15 },
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

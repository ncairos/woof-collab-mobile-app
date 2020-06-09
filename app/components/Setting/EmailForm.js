import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, Input, Icon, Button } from "react-native-elements";

import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Reauthenticate";

export default function EmailForm(props) {
  const { email, setRenderEmail, setReloadData, toastRef } = props;

  const [error, setError] = useState({});
  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateEmail = () => {
    setError({});
    if (!newEmail || !password) {
      let objError = {};
      !newEmail && (objError.newEmail = "You must fill out everything");
      !password && (objError.password = "You must fill out everything");
      setError(objError);
    } else if (!newEmail || email === newEmail) {
      setError({ email: "Email has not been change" });
    } else {
      setLoadingIsVisible(true);
      reauthenticate(password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(newEmail)
            .then(() => {
              setLoadingIsVisible(false);
              setReloadData(true);
              toastRef.current.show("Email has been updated");
              setRenderEmail(false);
            })
            .catch(() => {
              toastRef.current.show("Error updating, Try Again Later!");
            });
        })
        .catch(() => {
          setError({ password: "Password is not correct" });
          setLoadingIsVisible(false);
        });
    }
  };

  return (
    <Card containerStyle={{ marginHorizontal: 0 }}>
      <Icon
        type="material-community"
        name="close-circle"
        color="#f7882f"
        size={25}
        containerStyle={{ alignItems: "center" }}
        onPress={() => setRenderEmail(false)}
      />
      <Input
        placeholder="EMAIL ADDRESS"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setNewEmail(elm.nativeEvent.text)}
        errorMessage={error.newEmail}
      />
      <Input
        placeholder="PASSWORD"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        password={true}
        secureTextEntry={hidePassword}
        onChange={(elm) => setPassword(elm.nativeEvent.text)}
        errorMessage={error.password}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.leftIcon}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Button
        title="UPDATE"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={LoadingIsVisible}
        onPress={updateEmail}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  btnCont: {
    width: "100%",
    marginTop: 20,
  },
  btnStyle: {
    backgroundColor: "#6b7a8f",
  },
  leftIcon: { color: "#6b7a8f", marginRight: 15 },
});

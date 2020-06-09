import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, Input, Icon, Button } from "react-native-elements";

import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Reauthenticate";

export default function PasswordForm(props) {
  const { setRenderPassword, toastRef } = props;

  const [error, setError] = useState({});
  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideRepPassword, setHideRepPassword] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const updatePassword = () => {
    setError({});
    if (!oldPassword || !newPassword || !repPassword) {
      let objError = {};
      !oldPassword && (objError.oldPassword = "You must fill out everything");
      !newPassword && (objError.newPassword = "You must fill out everything");
      !repPassword && (objError.repPassword = "You must fill out everything");
      setError(objError);
    } else {
      if (newPassword !== repPassword) {
        setError({
          newPassword: "passwords do not match",
          repPassword: "passwords do not match",
        });
      } else {
        setLoadingIsVisible(true);
        reauthenticate(oldPassword)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePassword(newPassword)
              .then(() => {
                setLoadingIsVisible(false);
                toastRef.current.show("Password has been updated");
                setRenderPassword(false);
                firebase.auth().signOut();
              })
              .catch(() => {
                toastRef.current.show("Error updating, Try Again Later!");
                setLoadingIsVisible(false);
              });
          })
          .catch(() => {
            setError({ oldPassword: "Password is not correct" });
            setLoadingIsVisible(false);
          });
      }
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
        onPress={() => setRenderPassword(false)}
      />
      <Input
        placeholder="OLD PASSWORD"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        password={true}
        secureTextEntry={hideOldPassword}
        onChange={(elm) => setOldPassword(elm.nativeEvent.text)}
        errorMessage={error.oldPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={hideOldPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.leftIcon}
            onPress={() => setHideOldPassword(!hideOldPassword)}
          />
        }
      />
      <Input
        placeholder="NEW PASSWORD"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        password={true}
        secureTextEntry={hideNewPassword}
        onChange={(elm) => setNewPassword(elm.nativeEvent.text)}
        errorMessage={error.newPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={hideNewPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.leftIcon}
            onPress={() => setHideNewPassword(!hideNewPassword)}
          />
        }
      />
      <Input
        placeholder="REPEAT PASSWORD"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        password={true}
        secureTextEntry={hideRepPassword}
        onChange={(elm) => setRepPassword(elm.nativeEvent.text)}
        errorMessage={error.repPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={hideRepPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.leftIcon}
            onPress={() => setHideRepPassword(!hideRepPassword)}
          />
        }
      />
      <Button
        title="UPDATE"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={LoadingIsVisible}
        onPress={updatePassword}
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

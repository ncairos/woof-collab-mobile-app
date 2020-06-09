import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, Input, Icon, Button } from "react-native-elements";

import * as firebase from "firebase";

export default function NameForm(props) {
  const { setRenderName, setReloadData, toastRef } = props;

  const [error, setError] = useState(null);
  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);

  const [newDisplayName, setNewDisplayName] = useState("");

  const updateName = () => {
    setError(null);
    if (!newDisplayName) {
      setError("You must fill this field");
    } else {
      setLoadingIsVisible(true);
      const update = {
        displayName: newDisplayName,
      };
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setLoadingIsVisible(false);
          setReloadData(true);
          toastRef.current.show("Full Name has been updated");
          setRenderName(false);
        })
        .catch(() => {
          toastRef.current.show("Error updating, Try Again Later!");
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
        onPress={() => setRenderName(false)}
      />
      <Input
        placeholder="FULL NAME"
        inputStyle={{ fontSize: 14 }}
        onChange={(elm) => setNewDisplayName(elm.nativeEvent.text)}
        errorMessage={error}
      />
      <Button
        title="UPDATE"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={LoadingIsVisible}
        onPress={updateName}
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
});

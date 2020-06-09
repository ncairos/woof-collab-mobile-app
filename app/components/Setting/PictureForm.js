import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Icon } from "react-native-elements";

import Loading from "../Loading";

import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function PictureForm(props) {
  const {
    userInfo: { uid },
    setRenderPicture,
    setReloadData,
    toastRef,
  } = props;

  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);

  const avatarChange = async () => {
    const responsePermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const responseCamera = responsePermission.permissions.cameraRoll.status;

    if (responseCamera === "denied") {
      toastRef.current.show("You need to grant permission");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show("You have closed the gallery");
      } else {
        uploadImage(result.uri, uid).then(() => {
          uploadPhotoURL(uid);
        });
      }
    }
  };

  const uploadImage = async (uri, imgName) => {
    setLoadingIsVisible(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`avatar/${imgName}`);
    return ref.put(blob);
  };

  const uploadPhotoURL = (uid) => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (result) => {
        const update = {
          photoURL: result,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setReloadData(true);
        setLoadingIsVisible(false);
      })
      .catch(() => {
        toastRef.current.show("Error retrieving avatar, Try again later!");
      });
  };

  return (
    <Card containerStyle={{ marginHorizontal: 0 }}>
      <Icon
        type="material-community"
        name="close-circle"
        color="#f7882f"
        size={25}
        containerStyle={{ alignItems: "center" }}
        onPress={() => setRenderPicture(false)}
      />
      <View style={{ alignItems: "center" }}>
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.contIcon}
          onPress={avatarChange}
        />
      </View>
      <Loading text="UPDATING PROFILE" isVisible={LoadingIsVisible} />
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
  contIcon: {
    height: 100,
    width: "100%",
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

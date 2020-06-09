import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Card,
  Input,
  Icon,
  Button,
  CheckBox,
  Avatar,
} from "react-native-elements";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function CenterForm(props) {
  const { setRenderCenter, setReloadData, toastRef } = props;

  const [error, setError] = useState({});
  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);
  const [mapIsVisible, setMapIsVisible] = useState(false);
  const [centerLocation, setCenterLocation] = useState(null);

  const [centerRole, setCenterRole] = useState(false);
  const [centerName, setCenterName] = useState(" ");
  const [centerWebpage, setCenterWebpage] = useState(" ");
  const [centerEmail, setCenterEmail] = useState(" ");
  const [centerPhone, setCenterPhone] = useState(" ");
  const [centerHours, setCenterHours] = useState(" ");
  const [centerAddress, setCenterAddress] = useState(" ");
  const [centerDescription, setCenterDescription] = useState("");

  const [selectedImg, setSelectedImg] = useState([]);

  const addCenter = () => {
    setError({});
    if (!centerRole) {
      toastRef.current.show("Center account is not checked");
    } else if (
      !centerName ||
      !centerAddress ||
      !centerWebpage ||
      !centerPhone ||
      !centerHours ||
      !centerDescription ||
      !centerEmail
    ) {
      setError({
        centerName: "This field cannot be empty",
        centerAddress: "This field cannot be empty",
        centerWebpage: "This field cannot be empty",
        centerPhone: "This field cannot be empty",
        centerHours: "This field cannot be empty",
        centerDescription: "This field cannot be empty",
        centerEmail: "This field cannot be empty",
      });
    } else if (selectedImg.length === 0) {
      toastRef.current.show("You need to add at least one picture");
    } else if (!centerLocation) {
      toastRef.current.show("You need to add a location");
    } else {
      setLoadingIsVisible(true);
      uploadImage(selectedImg)
        .then((imgArray) => {
          const user = firebase.auth().currentUser;
          db.collection("centers")
            .doc(user.uid)
            .set({
              name: centerName,
              address: centerAddress,
              email: centerEmail,
              location: centerLocation,
              webpage: centerWebpage,
              phone: centerPhone,
              schedule: centerHours,
              description: centerDescription,
              images: imgArray,
              createdAt: new Date(),
              createdBy: user.uid,
            })
            .then(() => {
              setLoadingIsVisible(false);
              toastRef.current.show("Center account has been created");
              setRenderCenter(false);
            });
        })
        .catch(() => {
          setLoadingIsVisible(false);
          toastRef.current.show("Error creating account, Try Again Later!");
        });
    }
  };

  const uuidGenerator = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };

  const uploadImage = async (imgArray) => {
    const imgBlob = [];
    await Promise.all(
      imgArray.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = await firebase
          .storage()
          .ref("center-img")
          .child(uuidGenerator());
        await ref
          .put(blob)
          .then((result) => {
            imgBlob.push(result.metadata.name);
          })
          .catch(() => {
            toastRef.current.show("Error uploading, Try again later!");
          });
      })
    );
    return imgBlob;
  };

  return (
    <Card containerStyle={{ marginHorizontal: 0 }}>
      <Icon
        type="material-community"
        name="close-circle"
        color="#f7882f"
        size={25}
        containerStyle={{ alignItems: "center" }}
        onPress={() => setRenderCenter(false)}
      />
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <CheckBox
          title="CENTER ACCOUNT"
          checkedIcon={"dot-circle-o"}
          checkedColor="#f7882f"
          uncheckedColor="#c2c2c2"
          uncheckedIcon={"circle-o"}
          textStyle={{ color: centerRole ? "#f7882f" : "#c2c2c2" }}
          checked={centerRole === true}
          onPress={() => setCenterRole(!centerRole)}
        />
      </View>
      <Input
        placeholder="CENTER NAME"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setCenterName(elm.nativeEvent.text)}
        errorMessage={error.centerName}
        autoCapitalize="none"
      />
      <Input
        placeholder="CENTER WEBPAGE"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setCenterWebpage(elm.nativeEvent.text)}
        errorMessage={error.centerWebpage}
        autoCapitalize="none"
      />
      <Input
        placeholder="CENTER EMAIL ADDRESS"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setCenterEmail(elm.nativeEvent.text)}
        errorMessage={error.centerEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="CENTER PHONE NUMBER"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setCenterPhone(elm.nativeEvent.text)}
        errorMessage={error.centerPhone}
        autoCapitalize="none"
        maxLength={9}
      />
      <Text style={styles.textSmall}>09 Digits</Text>
      <Input
        placeholder="CENTER OPENING HOURS"
        inputStyle={{ fontSize: 14 }}
        onChange={(elm) => setCenterHours(elm.nativeEvent.text)}
        errorMessage={error.centerHours}
        autoCapitalize="none"
      />
      <Input
        placeholder="CENTER ADDRESS"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setCenterAddress(elm.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: centerLocation ? "#f7882f" : "#6b7a8f",
          onPress: () => setMapIsVisible(true),
        }}
        errorMessage={error.centerAddress}
        autoCapitalize="none"
      />
      <Input
        placeholder="CENTER DESCRIPTION"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        multiline={true}
        maxLength={140}
        inputContainerStyle={{ height: 100 }}
        onChange={(elm) => setCenterDescription(elm.nativeEvent.text)}
        errorMessage={error.centerDescription}
        autoCapitalize="none"
      />
      <Text style={styles.textSmall}>140 characters</Text>
      <ImgGallery
        selectedImg={selectedImg}
        setSelectedImg={setSelectedImg}
        toastRef={toastRef}
      />
      <Button
        title="UPDATE"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={LoadingIsVisible}
        onPress={addCenter}
      />
      <Map
        mapIsVisible={mapIsVisible}
        setMapIsVisible={setMapIsVisible}
        setCenterLocation={setCenterLocation}
        toastRef={toastRef}
      />
    </Card>
  );
}

function ImgGallery(props) {
  const { selectedImg, setSelectedImg, toastRef } = props;

  const selectImg = async () => {
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
        setSelectedImg([...selectedImg, result.uri]);
      }
    }
  };

  const removeImg = (image) => {
    const imgArray = selectedImg;

    Alert.alert(
      "Delete Image",
      "¿Are you sure you want to delete it?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () =>
            setSelectedImg(imgArray.filter((imgURL) => imgURL !== image)),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {selectedImg.length < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.contIcon}
          onPress={selectImg}
        />
      )}
      {selectedImg.map((centerImg, idx) => (
        <Avatar
          key={idx}
          onPress={() => removeImg(centerImg)}
          style={styles.contImg}
          source={{ uri: centerImg }}
        />
      ))}
    </View>
  );
}

function Map(props) {
  const { mapIsVisible, setMapIsVisible, setCenterLocation, toastRef } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const responsePermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = responsePermissions.permissions.location.status;
      if (statusPermissions !== "granted") {
        toastRef.current.show("You need to grant permission");
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setCenterLocation(location);
    toastRef.current.show("Center Location saved correctly");
    setMapIsVisible(false);
  };

  return (
    <Modal isVisible={mapIsVisible} setIsVisible={setMapIsVisible}>
      <View>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          <Button
            title="Save Location"
            containerStyle={{ paddingRight: 10, width: "50%" }}
            buttonStyle={{ backgroundColor: "#f7882f" }}
            onPress={confirmLocation}
          />
          <Button
            title="Cancel Location"
            containerStyle={{ paddingLeft: 10, width: "50%" }}
            buttonStyle={{ backgroundColor: "#6b7a8f" }}
            onPress={() => setMapIsVisible(false)}
          />
        </View>
      </View>
    </Modal>
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
  textSmall: {
    fontSize: 10,
    fontWeight: "bold",
    marginVertical: 10,
    marginRight: 10,
    textAlign: "right",
    color: "#6b7a8f",
  },
  switchBox: {
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    paddingVertical: 10,
    marginTop: 20,
  },
  map: {
    width: "100%",
    height: 500,
  },
  contIcon: {
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 10,
  },
  contImg: {
    height: 70,
    width: 70,
    marginTop: 20,
    marginLeft: 10,
  },
});

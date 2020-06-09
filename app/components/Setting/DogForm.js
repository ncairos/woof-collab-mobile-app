import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, Icon, Avatar } from "react-native-elements";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function DogForm(props) {
  const { setVisibleForm, setReloadDog, toastRef } = props;
  const [error, setError] = useState({});

  const [loadingIsVisible, setLoadingIsVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState([]);

  const [dogName, setDogName] = useState("");
  const [dogAge, setDogAge] = useState("");
  const [dogSex, setDogSex] = useState("");
  const [dogWeight, setDogWeight] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [dogColor, setDogColor] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogPersonality, setDogPersonality] = useState("");
  const [dogDescription, setDogDescription] = useState("");

  const addDog = () => {
    setError({});
    if (
      !dogName ||
      !dogAge ||
      !dogSex ||
      !dogWeight ||
      !dogSize ||
      !dogColor ||
      !dogBreed ||
      !dogPersonality ||
      !dogDescription
    ) {
      setError({
        dogName: "This field cannot be empty",
        dogAge: "This field cannot be empty",
        dogSex: "This field cannot be empty",
        dogWeight: "This field cannot be empty",
        dogSize: "This field cannot be empty",
        dogColor: "This field cannot be empty",
        dogBreed: "This field cannot be empty",
        dogPersonality: "This field cannot be empty",
        dogDescription: "This field cannot be empty",
      });
    } else if (selectedImg.length === 0) {
      toastRef.current.show("You need to add at least one picture");
    } else {
      setLoadingIsVisible(true);
      uploadImage(selectedImg).then((imgArray) => {
        const user = firebase.auth().currentUser;
        db.collection("dogs")
          .doc()
          .set({
            name: dogName,
            age: dogAge,
            sex: dogSex,
            weight: dogWeight,
            size: dogSize,
            color: dogColor,
            breed: dogBreed,
            personality: dogPersonality,
            description: dogDescription,
            images: imgArray,
            rating: 0,
            ratingTotal: 0,
            voteQuantity: 0,
            createdBy: user.uid,
            createdAt: new Date(),
          })
          .then(() => {
            setLoadingIsVisible(false);
            setReloadDog(true);
            toastRef.current.show("Dog has been created");
            setVisibleForm(false);
          })
          .catch(() => {
            setLoadingIsVisible(false);
            toastRef.current.show("Error creating dog, Try Again Later!");
          });
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
          .ref("dog-img")
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
    <View>
      <Input
        placeholder="DOG NAME"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setDogName(elm.nativeEvent.text)}
        errorMessage={error.dogName}
        autoCapitalize="none"
      />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "50%" }}>
          <Input
            placeholder="DOG AGE"
            inputStyle={{ fontSize: 14, marginVertical: 10 }}
            onChange={(elm) => setDogAge(elm.nativeEvent.text)}
            errorMessage={error.dogAge}
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={styles.textSmall}>YEARS OLD</Text>
        </View>
        <View style={{ width: "50%" }}>
          <Input
            placeholder="DOG SEX"
            inputStyle={{ fontSize: 14, marginVertical: 10 }}
            onChange={(elm) => setDogSex(elm.nativeEvent.text)}
            errorMessage={error.dogSex}
            autoCapitalize="none"
          />
          <Text style={styles.textSmall}>MALE - FEMALE</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "50%" }}>
          <Input
            placeholder="DOG WEIGHT"
            inputStyle={{ fontSize: 14, marginVertical: 10 }}
            onChange={(elm) => setDogWeight(elm.nativeEvent.text)}
            errorMessage={error.dogWeight}
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.textSmall}>KILOGRAMS</Text>
        </View>
        <View style={{ width: "50%" }}>
          <Input
            placeholder="DOG SIZE"
            inputStyle={{ fontSize: 14, marginVertical: 10 }}
            onChange={(elm) => setDogSize(elm.nativeEvent.text)}
            errorMessage={error.dogSize}
            autoCapitalize="none"
          />
          <Text style={styles.textSmall}>SMALL - MEDIUM - LARGE</Text>
        </View>
      </View>
      <Input
        placeholder="DOG COLOR"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setDogColor(elm.nativeEvent.text)}
        errorMessage={error.dogColor}
        autoCapitalize="none"
      />
      <Input
        placeholder="DOG BREED"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setDogBreed(elm.nativeEvent.text)}
        errorMessage={error.dogBreed}
        autoCapitalize="none"
      />
      <Input
        placeholder="DOG PERSONALITY"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        onChange={(elm) => setDogPersonality(elm.nativeEvent.text)}
        errorMessage={error.dogPersonality}
        autoCapitalize="none"
      />
      <Input
        placeholder="DOG DESCRIPTION"
        inputStyle={{ fontSize: 14, marginVertical: 10 }}
        multiline={true}
        maxLength={140}
        inputContainerStyle={{ height: 100 }}
        onChange={(elm) => setDogDescription(elm.nativeEvent.text)}
        errorMessage={error.dogDescription}
        autoCapitalize="none"
      />
      <Text style={styles.textSmall}>MAX 140 CHARACTERS</Text>
      <ImgGallery
        selectedImg={selectedImg}
        setSelectedImg={setSelectedImg}
        toastRef={toastRef}
      />
      <Button
        title="UPDATE"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        loading={loadingIsVisible}
        onPress={addDog}
      />
    </View>
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
    marginTop: 5,
    textAlign: "center",
    color: "#6b7a8f",
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

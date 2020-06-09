import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Icon, Button } from "react-native-elements";

import * as firebase from "firebase";

import NameForm from "./Setting/NameForm";
import PictureForm from "./Setting/PictureForm";
import EmailForm from "./Setting/EmailForm";
import PasswordForm from "./Setting/PasswordForm";
import CenterForm from "./Setting/CenterForm";

export default function Settings(props) {
  const { userInfo, setReloadData, toastRef } = props;

  const [renderName, setRenderName] = useState();
  const [renderEmail, setRenderEmail] = useState();
  const [renderPicture, setRenderPicture] = useState();
  const [renderPassword, setRenderPassword] = useState();
  const [renderCenter, setRenderCenter] = useState();

  const settingMenu = [
    {
      title: "FULL NAME",
      iconType: "material-community",
      iconColor: "#f7882f",
      iconNameLeft: "face",
      iconNameRight: "chevron-right",
      onPress: () => {
        setRenderName(true),
          setRenderPicture(false),
          setRenderEmail(false),
          setRenderPassword(false),
          setRenderCenter(false);
      },
    },
    {
      title: "PROFILE PICTURE",
      iconType: "material-community",
      iconColor: "#f7882f",
      iconNameLeft: "camera",
      iconNameRight: "chevron-right",
      onPress: () => {
        setRenderName(false),
          setRenderPicture(true),
          setRenderEmail(false),
          setRenderPassword(false),
          setRenderCenter(false);
      },
    },
    {
      title: "EMAIL ADDRESS",
      iconType: "material-community",
      iconColor: "#f7882f",
      iconNameLeft: "email",
      iconNameRight: "chevron-right",
      onPress: () => {
        setRenderName(false),
          setRenderPicture(false),
          setRenderEmail(true),
          setRenderPassword(false),
          setRenderCenter(false);
      },
    },
    {
      title: "PASSWORD",
      iconType: "material-community",
      iconColor: "#f7882f",
      iconNameLeft: "lock",
      iconNameRight: "chevron-right",
      onPress: () => {
        setRenderName(false),
          setRenderPicture(false),
          setRenderEmail(false),
          setRenderPassword(true),
          setRenderCenter(false);
      },
    },
    {
      title: "CENTER ACCOUNT",
      iconType: "material-community",
      iconColor: "#f7882f",
      iconNameLeft: "home",
      iconNameRight: "chevron-right",
      onPress: () => {
        setRenderName(false),
          setRenderPicture(false),
          setRenderEmail(false),
          setRenderPassword(false),
          setRenderCenter(true);
      },
    },
  ];

  return (
    <ScrollView>
      {renderName && (
        <NameForm
          setRenderName={setRenderName}
          setReloadData={setReloadData}
          toastRef={toastRef}
        />
      )}
      {renderEmail && (
        <EmailForm
          email={userInfo.email}
          setRenderEmail={setRenderEmail}
          setReloadData={setReloadData}
          toastRef={toastRef}
        />
      )}
      {renderPassword && (
        <PasswordForm
          setRenderPassword={setRenderPassword}
          setReloadData={setReloadData}
          toastRef={toastRef}
        />
      )}
      {renderPicture && (
        <PictureForm
          userInfo={userInfo}
          setRenderPicture={setRenderPicture}
          setReloadData={setReloadData}
          toastRef={toastRef}
        />
      )}
      {renderCenter && (
        <CenterForm
          setRenderCenter={setRenderCenter}
          setReloadData={setReloadData}
          toastRef={toastRef}
        />
      )}
      {settingMenu.map((elm, idx) => (
        <TouchableOpacity key={idx} onPress={elm.onPress}>
          <Card containerStyle={{ marginHorizontal: 0 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  type={elm.iconType}
                  name={elm.iconNameLeft}
                  color={elm.iconColor}
                />
                <Text style={{ marginLeft: 20 }}>{elm.title}</Text>
              </View>
              <Icon
                type={elm.iconType}
                name={elm.iconNameRight}
                color={elm.iconColor}
              />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      <Button
        title="LOGOUT"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnStyle}
        onPress={() => firebase.auth().signOut()}
      />
    </ScrollView>
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

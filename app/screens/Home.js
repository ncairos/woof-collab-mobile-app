import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-easy-toast";
import { withNavigation } from "react-navigation";
import Loading from "../components/Loading";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

import Account from "../components/Account/Account";
import ProfileCard from "../components/ProfileCard";
import Settings from "../components/Settings";
import MyInfo from "../components/MyInfo";

function Home(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const [loginUser, setLoginUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [centerInfo, setCenterInfo] = useState({});

  const [reloadData, setReloadData] = useState(false);

  const [infoMenu, setInfoMenu] = useState(true);
  const [settingMenu, setSettingMenu] = useState();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setLoginUser(true) : setLoginUser(false);
  });

  useEffect(() => {
    (async () => {
      firebase.auth().onAuthStateChanged((user) => {
        !user ? setLoginUser(false) : setLoginUser(true);
        fetchUser();
        fetchCenter();
      });
    })();
    setReloadData(false);
  }, [reloadData]);

  const fetchUser = () => {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      setUserInfo(user.providerData[0]);
    }
  };

  const fetchCenter = async () => {
    const user = await firebase.auth().currentUser;
    if (user !== null) {
      db.collection("centers")
        .doc(`${user.uid}`)
        .get()
        .then((doc) => {
          setCenterInfo(doc.data());
        });
    }
  };

  if (loginUser === null) {
    return <Loading isVisible={true} text="Loading User" />;
  }
  return loginUser ? (
    <>
      <ProfileCard
        userInfo={userInfo}
        centerInfo={centerInfo}
        infoMenu={infoMenu}
        setInfoMenu={setInfoMenu}
        settingMenu={settingMenu}
        setSettingMenu={setSettingMenu}
      />
      <View style={styles.viewMain}>
        {settingMenu && (
          <Settings
            userInfo={userInfo}
            setReloadData={setReloadData}
            toastRef={toastRef}
          />
        )}
        {infoMenu && <MyInfo toastRef={toastRef} navigation={navigation} />}
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </>
  ) : (
    <View style={styles.viewMain}>
      <Account />
    </View>
  );
}

export default withNavigation(Home);

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    marginHorizontal: 20,
  },
});

import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import CenterBanner from "./CenterBanner";
import CenterInfo from "./CenterInfo";
import CenterCatalog from "./CenterCatalog";

export default function CenterProfile(props) {
  const { navigation } = props;
  const { centerInfo } = navigation.state.params;

  const [infoCenter, setInfoCenter] = useState(true);
  const [dogCatalog, setDogCatalog] = useState();

  return (
    <ScrollView>
      <CenterBanner
        centerInfo={centerInfo}
        infoCenter={infoCenter}
        setInfoCenter={setInfoCenter}
        dogCatalog={dogCatalog}
        setDogCatalog={setDogCatalog}
      />
      <View style={styles.viewMain}>
        {infoCenter && (
          <CenterInfo centerInfo={centerInfo} navigation={navigation} />
        )}
        {dogCatalog && (
          <CenterCatalog centerInfo={centerInfo} navigation={navigation} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    marginHorizontal: 20,
  },
});

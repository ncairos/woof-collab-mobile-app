import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyA-Zkz-we_7xgJt-pu50lEWVvBoEIyG25E",
  authDomain: "woof-app-92fde.firebaseapp.com",
  databaseURL: "https://woof-app-92fde.firebaseio.com",
  projectId: "woof-app-92fde",
  storageBucket: "woof-app-92fde.appspot.com",
  messagingSenderId: "782618769148",
  appId: "1:782618769148:web:f5440aaa2ae5f013570979",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

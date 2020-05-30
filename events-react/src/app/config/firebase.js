import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

var firebaseConfig = 
{
    apiKey: "AIzaSyC_qPDCrnfHzxnnKBrLEIfeEH1aYOQQfSg",
    authDomain: "events-react-859e4.firebaseapp.com",
    databaseURL: "https://events-react-859e4.firebaseio.com",
    projectId: "events-react-859e4",
    storageBucket: "events-react-859e4.appspot.com",
    messagingSenderId: "237794302553",
    appId: "1:237794302553:web:0efb6ebcb16b2cf4b92f48",
    measurementId: "G-Y2Y773VP56"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.firestore();

export default firebase;
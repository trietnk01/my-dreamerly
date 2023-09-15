const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
const firebaseConfig = {
	apiKey: "AIzaSyD23jDPsV9oOT5ZgML3rNtQEdY1FoFj5BQ",
	authDomain: "mydreamerly.firebaseapp.com",
	projectId: "mydreamerly",
	storageBucket: "mydreamerly.appspot.com",
	messagingSenderId: "284040068470",
	appId: "1:284040068470:web:06189f77084dcda8c98e57",
	measurementId: "G-2B2DL60PMK"
};
firebase.initializeApp(firebaseConfig);
module.exports = firebase.auth();

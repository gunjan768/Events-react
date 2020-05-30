import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import App from './app/layout/App';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/util/ScrollToTop';
import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { ReactReduxFirebaseProvider, isLoaded } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from './app/config/firebase';
import { useSelector } from 'react-redux'
import LoadingComponent from './app/layout/LoadingComponent';

const initialState = window && window.__INITIAL_STATE__ // set initial state here
const store = configureStore(initialState);

// Profile object is used to store data associated with a user. Using profile is in no way required, and will only be enabled if the 
// userProfile config option is provided. It is common to store the list of user profiles under a collection called "users" or
// "profiles". In this we will use 'users'. Include the userProfile parameter in config passed to react-redux-firebase. To use
// Firestore for storing profile data instead of Real Time Database. Whatever value (or name) you will give to userProfile, the
// same name will be given to collection name in firestore (if useFirestoreForProfile is set to true). And document id will be as
// same as user auth UID.
const rrfConfig = 
{
    userProfile: 'users',
	attachAuthIsReady: true,
    useFirestoreForProfile: true,
    updateProfileOnLogin: false
};

const rrfProps = 
{
	firebase,
	config: rrfConfig,
	dispatch: store.dispatch,
	createFirestoreInstance // <- needed if using firestore
}

const AuthIsLoaded = ({ children }) => 
{
	const auth = useSelector(state => state.firebase.auth);

	// if(!auth.isLoaded) 
	// return <LoadingComponent />;

	// Use above if condition or below one to check that user is loaded successfully or not. In above we used a 'isLoaded' property which is
	// inside the 'state.firebase.auth'. If user loaded successfully then 'isLoaded' becomes true else false. In below if condition we used
	// isLoaded() function from 'react-redux-firebase'.

	if(!isLoaded(auth)) 
	return <LoadingComponent />;

	return children;
}
  
const Main = () => 
{
	return (
		<Provider store = { store }>
			<BrowserRouter>
				<ScrollToTop>
					<ReduxToastr 
						position="bottom-right"
						transitionIn="fadeIn"
						transitionOut="fadeOut"
					/>
					<ReactReduxFirebaseProvider { ...rrfProps }>
						<AuthIsLoaded>
							<App />
						</AuthIsLoaded>
					</ReactReduxFirebaseProvider>
				</ScrollToTop>
			</BrowserRouter>
		</Provider>
	);
}
  
export default Main;
import { SubmissionError, reset } from 'redux-form';
import { toastr } from 'react-redux-toastr'
import { closeModal } from '../modals/modalActions';
import { SIGN_OUT_USER, LOGIN_USER } from './authConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';

export const login = creds => 
{
    // console.log("loginAction outside");

    // We have no use of getState but to get the third argument we need to mention the second argument first.
    return async (dispatch, getState, { getFirebase }) => 
    {
        const firebase = getFirebase();
        
        // console.log("loginAction inside 1");
        
        try 
        {
            dispatch(asyncActionStart());

            const user = await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);

            if(!user)
            throw user.error

            dispatch({ type: LOGIN_USER, payload: creds });
            dispatch(closeModal());
            dispatch(asyncActionFinish());
            // console.log("loginAction inside 2");

            // Promise will be resolved with a toastr.success which is true.
            return toastr.success('Success!', `It's nice to see you again ${creds.email}`);
        }
        catch(error) 
        {
            dispatch(asyncActionError());

            // console.log(error);

            // You have to mentioned error property by the name '_error'. It will throw an error which you can catch in LoginForm.
            throw new SubmissionError(
            {
                _error: error.message
            });
        }
    };
}

export const registerUser = user => 
{
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();
        
        try 
        {
            dispatch(asyncActionStart());

            // create the user in firebase auth
            const createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            
            // console.log(createdUser);
          
            // update the auth profile
            await createdUser.user.updateProfile(
            {
                displayName: user.displayName
            })

            // create a new profile in firestore
            const newUser = 
            {
                displayName: user.displayName,
                createdAt: firestore.FieldValue.serverTimestamp()
            };

            await firestore.set(`users/${createdUser.user.uid}`, { ...newUser });

            dispatch(asyncActionFinish());
            dispatch(closeModal());
        } 
        catch(error)
        {
            dispatch(asyncActionError());

            // console.log(error);

            throw new SubmissionError(
            {
                _error: error.message
            });
        }
    }
}

export const socialLogin = selectedProvider => 
{
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();
        
        try 
        {
            dispatch(asyncActionStart());
            
            const user = await firebase.login(
            {
                provider: selectedProvider,
                type: 'popup'
            });
            
            // When above process of login completes then in firesotre 'users' collection will be created if not created before
            // and document id will be equal to the user auth UID. Inside this document ID some fields will get automatically
            // saved like 'displayName', 'avatarUrl' and 'email' if logged in for the first time. If you want to save these
            // with different names as we did here then you can set it by using firestore.set() function. It will erase all the
            // fields (like displayName) and will create the new fields (like createAt) which you will mention.
            if(user.additionalUserInfo.isNewUser) 
            {
                await firestore.set(`users/${user.user.uid}`, 
                {
                    displayName: user.profile.displayName,
                    photoURL: user.profile.avatarUrl,
                    createdAt: firestore.FieldValue.serverTimestamp()
                })
            }

            dispatch(asyncActionFinish());
            dispatch(closeModal());
        } 
        catch(error) 
        {
            dispatch(asyncActionError());

            console.log(error);
        }
    }
}

export const updatePassword = creds => async (dispatch, getState, {getFirebase}) => 
{
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;

    try 
    {
        await user.updatePassword(creds.newPassword);

        // reset is a built-in function which is used to clear all the form fields. 
        await dispatch(reset('account'));
        
        toastr.success('Success!', 'Your password has been updated');
    } 
    catch(error) 
    {
        throw new SubmissionError(
        {
            _error: error.message
        })
    }
}

export const signOutUser = () =>
{
    return {
        type: SIGN_OUT_USER
    };
}
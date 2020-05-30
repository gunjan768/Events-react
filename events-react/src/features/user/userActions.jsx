// import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import cuid from 'cuid';
import firebase from '../../app/config/firebase';
import { FETCH_USER_EVENTS } from '../event/eventConstants';

// user consists of all the form data inforamtions. It consists of key-value pairs where key is the name attribute and value is the 
// value of the form input. In the same structure it will get saved to the firestore as we directly passed the user object.
export const updateProfile = user => 
{
    return async (dispatch, getState, { getFirebase }) => 
    {
        const firebase = getFirebase();

        // Whenever you update your profile both 'isLoaded and isEmpty' come as an inbuilt hence we don't want to store it in our 
        // firestore so we separated them with other user form values.
        const { isLoaded, isEmpty, ...updatedUser } = user;
        
        // console.log("user (userActions.jsx) : ",user);

        if(updatedUser.dateOfBirth) 
        {
            // console.log("Before (userActions.jsx) : ",updatedUser.dateOfBirth);

            if(Object.prototype.toString.call(updatedUser.dateOfBirth) === '[object String]')
		    updatedUser.dateOfBirth = new Date(updatedUser.dateOfBirth);

            // console.log("After (userActions.jsx) : ",updatedUser.dateOfBirth);
        }

        try 
        {
            await firebase.updateProfile(updatedUser);
            
            toastr.success('Success!', 'Profile updated');
        } 
        catch(error) 
        {
            console.log(error);
        }
    }
}

export const uploadProfileImage = (file, fileName) => 
{
    // console.log("uploadProfile outisde");
    
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();

        // console.log("firebase : ",firebase);
        // console.log("firestore : ",firestore);

        const imageName = cuid();

        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;

        const options = 
        {
            name: imageName
        };
     
        try 
        {
            dispatch(asyncActionStart());
            
            // upload the file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);

            // console.log("uploadFile : ",uploadedFile);

            // get url of the image
            let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();

            // console.log("downloadURL : ",downloadURL);

            //get userdoc 
            let userDoc = await firestore.get(`users/${user.uid}`);

            // console.log("userDoc : ",userDoc);
            // console.log("userDoc : ",userDoc.data());

            // check if user has photo, if not update profile with new image
            if(!userDoc.data().photoURL) 
            {
                // console.log("inside 1");

                await firebase.updateProfile(
                {
                    photoURL: downloadURL
                });
                
                // updating the profile in auth part. Authentication has two additional props which are 'photoURL' and 'displayName'. You 
                // can't go and see on auth section as still I don't where both these properties are get stored.
                await user.updateProfile(
                {
                    photoURL: downloadURL
                })
            }

            // Add photos to the subcollection named 'photos' inside collection 'users'. Since using add() function so it will create the
            // document id randomly. If used set() function then we have to specify the the document id.
            await firestore.add(
            {
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, 
            {
                name: imageName,
                url: downloadURL
            })

            dispatch(asyncActionFinish());

            // console.log("Last");
            
            toastr.success('Success!', 'Photo has been uploaded');
        } 
        catch(error) 
        {
            // console.log(error);

            dispatch(asyncActionError());

            throw new Error('Problem uploading photo');
        }
    }
}

export const deletePhoto = photo => 
{    
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();

        const user = firebase.auth().currentUser;

        try 
        {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);

            await firestore.delete(
            {
                collection: 'users',
                doc: user.uid,
                subcollections: [{ collection: 'photos', doc: photo.id }]
            })

            toastr.warning('Sorry to say but you just removed one of your photos');
        } 
        catch(error) 
        {
            console.log(error);

            throw new Error('Problem deleting the photo');
        }
    }
}

export const setMainPhoto = photo =>
{ 
    // console.log("outside (setMainPhoto) : ",photo);

    return async (dispatch, getState, { getFirebase }) => 
    {
        dispatch(asyncActionStart());

        const firestore = firebase.firestore();
        const user = firebase.auth().currentUser;
        const today = new Date(Date.now());

        const userDocRef = firestore.collection('users').doc(user.uid);
        const eventAttendeeRef = firestore.collection('event_attendee');

        try 
        {
            const batch = firestore.batch();
            
            // Till this point nothing will hapen untill we will commit the changes.
            batch.update(userDocRef, 
            {
                photoURL: photo.url
            });
        
            const eventQuery = await eventAttendeeRef.where('userUid', '==', user.uid).where('eventDate', '>=', today);
        
            const eventQuerySnap = await eventQuery.get();
        
            for(let i = 0; i < eventQuerySnap.docs.length; i++) 
            {
                const eventDocRef = await firestore.collection('events').doc(eventQuerySnap.docs[i].data().eventId);
                const event = await eventDocRef.get();
        
                if(event.data().hostUid === user.uid) 
                {
                    batch.update(eventDocRef, 
                    {
                        hostPhotoURL: photo.url,
                        [`attendees.${user.uid}.photoURL`]: photo.url
                    })
                } 
                else 
                {
                    batch.update(eventDocRef, 
                    {
                        [`attendees.${user.uid}.photoURL`]: photo.url
                    })
                }
            }

            console.log(batch);

            await batch.commit();

            dispatch(asyncActionFinish())
        } 
        catch(error) 
        {
            console.log(error);

            dispatch(asyncActionError());
            
            throw new Error('Problem setting main photo');
        }
    }
}

export const goingToEvent = event => 
{
    return async (dispatch, getState) => 
    {
        dispatch(asyncActionStart());

        const firestore = firebase.firestore();
        const user = firebase.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
         
        const attendee = 
        {
            going: true,
            joinDate: Date.now(),
            photoURL: photoURL || '/assets/user.png',
            displayName: user.displayName,
            host: false
        };

        try 
        {
            const eventDocRef = firestore.collection('events').doc(event.id);
            const eventAttendeeDocRef = firestore.collection('event_attendee').doc(`${event.id}_${user.uid}`);

            // runTransaction() excutes the given updateFunction and then attemps to commit the changes applied within the transaction. If
            // document read within the transaction has changed, the updateFunction will be retired. If it fails to commit after 5 attempts
            // the transaction will fail. If it fails then it will completely roll back i.e user will not be able to join this event.  
            await firestore.runTransaction(async transaction => 
            {
                await transaction.get(eventDocRef);

                await transaction.update(eventDocRef, 
                {
                    // `attendees.${user.uid}` means user.id inside the attendees prop which is an object ( see 'createNewEvent' in helper.js 
                    // page ).
                    [`attendees.${user.uid}`]: attendee
                })

                await transaction.set(eventAttendeeDocRef, 
                {
                    eventId: event.id,
                    userUid: user.uid,
                    eventDate: event.date,
                    host: false
                })
            })

            toastr.success('Success', 'You have signed up to the event');
            
            dispatch(asyncActionFinish());
        } 
        catch(error) 
        {
            console.log(error);
            
            dispatch(asyncActionError());
            
            toastr.error('Oops', 'Problem signing up to event');
        }
    }
}

export const cancelGoingToEvent = event =>
{
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();
        
        const user = firebase.auth().currentUser;
        
        try
        {
            await firestore.update(`events/${event.id}`, 
            {
                [`attendees.${user.uid}`]: firestore.FieldValue.delete()
            })

            await firestore.delete(`event_attendee/${event.id}_${user.uid}`);

            toastr.success('Success', 'You have removed yourself from the event');
        } 
        catch(error) 
        {
            // console.log(error);

            toastr.error('Oops', 'Something went wrong');
        }
    }
}

export const getUserEvents = (userUid, activeTab) => 
{ 
    return async (dispatch, getState) => 
    {
        dispatch(asyncActionStart());

        const firestore = firebase.firestore();
        const today = new Date(Date.now());

        const eventsRef = firestore.collection('event_attendee');
        let query;
    
        switch(activeTab) 
        {
            case 1: 
                // past events
                query = eventsRef.where('userUid', '==', userUid).where('eventDate', '<=', today).orderBy('eventDate', 'desc');
                break;

            case 2: 
                // future events
                query = eventsRef.where('userUid', '==', userUid).where('eventDate', '>=', today).orderBy('eventDate');
                break;

            case 3: 
                // hosted events
                query = eventsRef.where('userUid', '==', userUid).where('host', '==', true).orderBy('eventDate', 'desc');
                break;

            default:
                query = eventsRef.where('userUid', '==', userUid).orderBy('eventDate', 'desc');
        }
        try 
        {
            const querySnap = await query.get();
            let events = [];
        
            for(let i=0; i < querySnap.docs.length; i++) 
            {
                const event = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();

                events.push({ ...event.data(), id: event.id });
            }
        
            dispatch({ type: FETCH_USER_EVENTS, payload: { events } });
        
            dispatch(asyncActionFinish());
        } 
        catch(error) 
        {
            console.log(error);

            dispatch(asyncActionError());
        }
    }
} 

export const followUser = userToFollow => 
{
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        
        const following = 
        {
            photoURL: userToFollow.photoURL || '/assets/user.png',
            city: userToFollow.city || 'Unknown city',
            displayName: userToFollow.displayName
        };

        try 
        {
            await firestore.set(
            {
                collection: 'users',
                doc: user.uid,
                subcollections: [{ collection: 'following', doc: userToFollow.id }]

            }, following);
        } 
        catch(error) 
        {
            console.log(error);
        }
    }
}
  
export const unfollowUser = userToUnfollow => 
{
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;

        try 
        {
            await firestore.delete(
            {
                collection: 'users',
                doc: user.uid,
                subcollections: [{ collection: 'following', doc: userToUnfollow.id }]
            });
        } 
        catch(error) 
        {
            console.log(error);
        }
    }
}
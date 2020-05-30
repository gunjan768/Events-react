const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => 
{
    return {
        type: type,
        eventDate: event.date,
        hostedBy: event.hostedBy,
        title: event.title,
        photoURL: event.hostPhotoURL,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        hostUid: event.hostUid,
        eventId: id
    };
}

// All these functions will be automatically called whenever there is any change in firestore. Like whenever there is any creation
// of document inside events collection then the event object will be received here as an argument to onCreate() function. Similarly
// whenever there is any update inside events collection then updated event object will be received as an argument to onUpate() function.
// Similarly for other ( onDelete() .. etc ).

exports.createActivity = functions.firestore.document('events/{eventId}').onCreate(async event => 
{
    const newEvent = event.data();

    // console.log({newEvent});

    const activity = newActivity('newEvent', newEvent, event.id);

    // console.log({activity});

    try 
    {
        const docRef = await admin.firestore().collection('activity').add(activity);

        return console.log('Activity created with ID: ', docRef.id);
    }
    catch(error) 
    {
        return console.log('Error adding activity', err);
    }
})

exports.cancelActivity = functions.firestore.document('events/{eventId}').onUpdate(async (event, context) => 
{
    let updatedEvent = event.after.data();
    let previousEventData = event.before.data();

    // console.log({ event });
    // console.log({ context });
    // console.log({ updatedEvent });
    // console.log({ previousEventData });

    if(!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled)
    return false;

    const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId);

    // console.log({ activity });

    try
    {
        const docRef =  admin.firestore().collection('activity').add(activity);
      
        return console.log('Activity created with ID : ', docRef.id);
    }
    catch(error)
    {
        return console.log('Error adding activity', err);
    }
});

// followerUid means the user which is currently logged in and follows. followingUid means whom followerUid follows.
exports.userFollowing = functions.firestore.document('users/{followerUid}/following/{followingUid}')
.onCreate(async (event, context) => 
{
    const followerUid = context.params.followerUid;
    const followingUid = context.params.followingUid;

    const followerDoc = admin.firestore().collection('users').doc(followerUid);

    // console.log(followerDoc);

    const doc = await followerDoc.get();
    const userData = doc.data();

    // console.log({ userData });

    const follower = 
    {
        displayName: userData.displayName,
        photoURL: userData.photoURL || '/assets/user.png',
        city: userData.city || 'unknown city'
    };

    return admin.firestore().collection('users').doc(followingUid).collection('followers').doc(followerUid).set(follower);
});

exports.unfollowUser = functions.firestore.document('users/{followerUid}/following/{followingUid}')
.onDelete(async (event, context) => 
{
    try 
    {
        await admin.firestore().collection('users').doc(context.params.followingUid).collection('followers')
            .doc(context.params.followerUid).delete();

        return console.log('doc deleted');
    }
    catch(error) 
    {
        return console.log(err);
    }
})
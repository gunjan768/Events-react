import { toastr } from 'react-redux-toastr';
import { DELETE_EVENT, FETCH_EVENTS } from './eventConstants';
import { asyncActionError, asyncActionFinish, asyncActionStart } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import firebase from '../../app/config/firebase';
import compareAsc from 'date-fns/compareAsc';
import { parseISO } from 'date-fns';
// import moment from 'moment';
// import { fetchSampleData } from '../../app/data/mockApi';

// export const fetchEvents = events =>
// {
//     return {
//         type: FETCH_EVENTS,
//         payload: events
//     }
// }

export const createEvent = event => 
{
    return async (dispatch, getState, { getFirebase, getFirestore }) => 
    {
        const firebase = getFirebase();
        const firestore = getFirestore();

        const user = firebase.auth().currentUser;
        
        const photoURL = getState().firebase.profile.photoURL;
        const newEvent = createNewEvent(user, photoURL, event);
        
        try 
        {
            dispatch(asyncActionStart());

            const createdEvent = await firestore.add(`events`, newEvent);
            
            await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, 
            {
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true
            });

            toastr.success('Success..!', 'Event has been created');

            dispatch(asyncActionFinish());

            return createdEvent.id;
        } 
        catch(error) 
        {
            toastr.error('Oops', 'Something went wrong');
            dispatch(asyncActionError());
            
            throw Error("Submission Problem");
        }
    }
}
  
export const updateEvent = event => 
{
    return async (dispatch, getState) => 
    {
        const firestore = firebase.firestore();
  
        try 
        {
            dispatch(asyncActionStart());

            const eventDocRef = firestore.collection('events').doc(event.id);
            const dateEqual = compareAsc(parseISO(getState().firestore.ordered.events[0].date), parseISO(event.date));

            // const dateEqual = getState().firestore.ordered.events[0].date.isEqual(event.date);

            if(dateEqual !== 0) 
            {
                const batch = firestore.batch();
                await batch.update(eventDocRef, event);
        
                const eventAttendeeRef = firestore.collection('event_attendee');
                const eventAttendeeQuery = await eventAttendeeRef.where('eventId', '==', event.id);
                const eventAttendeeQuerySnap = await eventAttendeeQuery.get();
        
                for(let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) 
                {
                    const eventAttendeeDocRef = await eventAttendeeRef.doc(eventAttendeeQuerySnap.docs[i].id);
                
                    await batch.update(eventAttendeeDocRef, { eventDate: event.date });
                }

                await batch.commit();
            } 
            else 
            {
                await eventDocRef.update(event);
            }

            dispatch(asyncActionFinish());

            toastr.success('Success!', 'Event has been updated');
        } 
        catch(error) 
        {
            dispatch(asyncActionError());
            
            toastr.error('Oops', 'Something went wrong');
        }
    }
}

export const deleteEvent = eventId => 
{
    // console.log("Delete (eventActions.jsx)");
    
    return {
        type: DELETE_EVENT,
        payload: 
        {
            eventId
        }
    };
}

// loadEvents is called from Main.js page.
// export const loadEvents = () => 
// {
//     return async dispatch => 
//     {
//         try 
//         {
//             dispatch(asyncActionStart());

//             let events = await fetchSampleData();

//             dispatch(fetchEvents(events));
//             dispatch(asyncActionFinish());
//         } 
//         catch(error) 
//         {
//             console.log(error);

//             dispatch(asyncActionError());
//         }
//     }
// }

export const cancelToggle = (cancelled, eventId) => 
{
    return async (dispatch, getState, { getFirestore }) => 
    {
        const firestore = getFirestore();
        const message = cancelled ? 'Are you sure you want to cancel the event ?' : 'This will reactivate the event - are you sure ? ';
        
        try 
        {
            toastr.confirm(message, 
            {
                onOk : () => firestore.update(`events/${eventId}`, { cancelled })
            });
        } 
        catch(error) 
        {
            console.log(error);
        }
    }
} 

export const getEventsForDashboard = lastEvent => 
{
    return async (dispatch, getState) => 
    {
        const today = new Date(Date.now());
        const firestore = firebase.firestore();
        const eventsRef = firestore.collection('events');

        try 
        {
            dispatch(asyncActionStart());

            const startAfter = lastEvent && await eventsRef.doc(lastEvent.id).get();
        
            const query = lastEvent ? 
                    eventsRef.where('date', '>=', today).orderBy('date').startAfter(startAfter).limit(2)
                : 
                    eventsRef.where('date', '>=', today).orderBy('date').limit(2);
        
            const querySnap = await query.get();
            
            // console.log("Get Events : ",querySnap);
            
            if(querySnap.docs.length === 0) 
            {
                dispatch(asyncActionFinish());

                return querySnap;
            }
        
            let events = [];
        
            for(let i = 0; i < querySnap.docs.length; i++) 
            {
                const event = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };

                events.push(event);
            }
        
            dispatch({ type: FETCH_EVENTS, payload: { events } });
            dispatch(asyncActionFinish());

            return querySnap;
        } 
        catch(error) 
        {
            console.log(error);
            
            dispatch(asyncActionError());
        }
    }
}
  
export const addEventComment = (eventId, values, parentId) => 
{
    return async (dispatch, getState, { getFirebase }) => 
    {
        const firebase = getFirebase();
        const profile = getState().firebase.profile;
        const user = firebase.auth().currentUser;
        
        const newComment = 
        {
            parentId: parentId,
            displayName: profile.displayName,
            photoURL: profile.photoURL,
            uid: user.uid,
            text: values.comment,
            date: Date.now()
        }

        try 
        {
            await firebase.push(`event_chat/${eventId}`, newComment)
        } 
        catch(error) 
        {
            console.log(error);

            toastr.error('Oops', 'Problem adding comment');
        }
    }
}
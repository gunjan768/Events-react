import { createReducer } from '../../app/common/util/reducerUtil'
import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT, FETCH_EVENTS, FETCH_USER_EVENTS } from './eventConstants';

const initialState =
{
    events: [],
    userEvents: []
}

export const createEvent = (state, payload) => {
    return [...state, Object.assign({}, payload.event)];
}

export const updateEvent = (state, payload) => 
{
    return [
        ...state.filter(event => event.id !== payload.event.id),
        Object.assign({}, payload.event)
    ];
}

export const deleteEvent = (state, payload) => 
{

    // console.log("deleteReducer (eventReducer.jsx) : ", payload);
    
    return [...state.filter(event => event.id !== payload.eventId)];
}

export const fetchEvents = (state, payload) => 
{
    // console.log("fetchEvents : ",payload.events);

    return {
        ...state,
        events: payload.events
    }
}

export const fetchUserEvents = (state, payload) => 
{
    return {
        ...state,
        userEvents: payload.events
    }
}


export default createReducer(initialState, 
{
    [CREATE_EVENT]: createEvent,
    [UPDATE_EVENT]: updateEvent,
    [DELETE_EVENT]: deleteEvent,
    [FETCH_EVENTS]: fetchEvents,
    [FETCH_USER_EVENTS]: fetchUserEvents
})
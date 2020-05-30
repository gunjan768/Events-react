import { SIGN_OUT_USER, LOGIN_USER } from './authConstants';
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = 
{
    currentUser: {}
}

export const loginUser = (state, payload) => 
{
    // console.log("loginReducer : ",payload);

    return {
        ...state,
        authenticated: true,

        // acessing the input by it's name property ( see in the LoginForm.jsx page ).
        currentUser: payload.email
    };
}

export const signOutUser = (state, payload) => 
{
    // console.log("signOutReducer");

    return {
        ...state, 
        authenticated: false,
        currentUser: {}
    }
}

export default createReducer(initialState, 
{
    [LOGIN_USER]: loginUser,
    [SIGN_OUT_USER]: signOutUser
})
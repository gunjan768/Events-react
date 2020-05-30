import { INCREMENT_COUNTER, DECREMENT_COUNTER } from './testConstants';
// import { asyncActionStart, asyncActionFinish } from '../async/asyncActions';
import { ASYNC_ACTION_START, ASYNC_ACTION_FINISH } from '../async/asyncConstants';

// export const incrementCounter = () => {
//     return {
//         type: INCREMENT_COUNTER
//     }
// }

// export const decrementCounter = () => {
//     return {
//         type: DECREMENT_COUNTER
//     }
// }

// export const startCounterAction = () => {
//     return {
//         type: COUNTER_ACTION_STARTED
//     }
// }

// export const finishCounterAction = () => {
//     return {
//         type: COUNTER_ACTION_FINISHED
//     }
// }

const delay = ms => 
{
    return new Promise(resolve => setTimeout(resolve, ms))
} 

export const incrementAsync = name => 
{
    return async dispatch => 
    {
        // dispatch(startCounterAction());
        // dispatch(asyncActionStart());
        dispatch({type: ASYNC_ACTION_START, payload: name});
        
        await delay(400);

        dispatch({type: INCREMENT_COUNTER});
        // dispatch(finishCounterAction());

        // dispatch(asyncActionFinish()); 
        
        dispatch({type: ASYNC_ACTION_FINISH, payload: name});
    }
}

export const decrementAsync = name => 
{
    return async dispatch => 
    {
        // dispatch(startCounterAction());
        // dispatch(asyncActionStart());
        dispatch({type: ASYNC_ACTION_START, payload: name});

        await delay(400);
        
        dispatch({type: DECREMENT_COUNTER});
        // dispatch(finishCounterAction());

        // dispatch(asyncActionFinish());

        dispatch({type: ASYNC_ACTION_FINISH, payload: name});
    }
}
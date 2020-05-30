import { ASYNC_ACTION_ERROR, ASYNC_ACTION_START, ASYNC_ACTION_FINISH } from './asyncConstants';

export const asyncActionStart = () => 
{
    // console.log("asyncActionStart");

    return {
        type: ASYNC_ACTION_START
    };
}

export const asyncActionFinish = () => 
{
    // console.log("asyncActionFinish");

    return {
        type: ASYNC_ACTION_FINISH
    };
}

export const asyncActionError = () => 
{
    // console.log("asyncActionError");

    return {
        type: ASYNC_ACTION_ERROR
    };
}
/* eslint-disable prettier/prettier */
export const ADD_FEEDLIST_DATA = 'ADD_FEEDLIST_DATA';
export const CLEAR_FEEDLIST_DATA = 'CLEAR_FEEDLIST_DATA';
export const CLEAR_FEEDLIST_DETAILS = 'CLEAR_FEEDLIST_DETAILS';
export const UPDATE_FEEDLIST_DATA = 'UPDATE_FEEDLIST_DATA';

//action creators
export function addfeedlistdata(data) {
    return {
        type: ADD_FEEDLIST_DATA,
        data,
    };
};
export function updatefeedlistdata(data) {
    return {
        type: UPDATE_FEEDLIST_DATA,
        data,
    };
};
export function clearfeedlistdata() {
    return {
        type: CLEAR_FEEDLIST_DATA,
    };
};
export function clearfeedlistdetails() {
    return {
        type: CLEAR_FEEDLIST_DETAILS,
    };
};

// Intial State 
let empty = [];
let feedslist = [];

export default function FeedlistReducer(state = feedslist, action) {
    switch (action.type) {
        case ADD_FEEDLIST_DATA:
            return action.data;
        case UPDATE_FEEDLIST_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_FEEDLIST_DATA:
            return empty;
        default:
            return state;
    }
};
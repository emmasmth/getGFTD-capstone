/* eslint-disable prettier/prettier */
export const ADD_NOTIFICATIONS_DATA = 'ADD_NOTIFICATIONS_DATA';
export const CLEAR_NOTIFICATIONS_DATA = 'CLEAR_NOTIFICATIONS_DATA';
export const CLEAR_NOTIFICATIONS_DETAILS = 'CLEAR_NOTIFICATIONS_DETAILS';
export const UPDATE_NOTIFICATIONS_DATA = 'UPDATE_NOTIFICATIONS_DATA';

//action creators
export function addnotificationsdata(data) {
    return {
        type: ADD_NOTIFICATIONS_DATA,
        data,
    };
};
export function updatenotificationsdata(data) {
    return {
        type: UPDATE_NOTIFICATIONS_DATA,
        data,
    };
};
export function clearnotificationsdata() {
    return {
        type: CLEAR_NOTIFICATIONS_DATA,
    };
};
export function clearnotificationsdetails() {
    return {
        type: CLEAR_NOTIFICATIONS_DETAILS,
    };
};

// Intial State 
let empty = [];
let notifications = [];

export default function NotificationsReducer(state = notifications, action) {
    switch (action.type) {
        case ADD_NOTIFICATIONS_DATA:
            return action.data;
        case UPDATE_NOTIFICATIONS_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_NOTIFICATIONS_DATA:
            return empty;
        default:
            return state;
    }
};
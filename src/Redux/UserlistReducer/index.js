import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable prettier/prettier */
export const ADD_USERLIST_DATA = 'ADD_USERLIST_DATA';
export const CLEAR_USERLIST_DATA = 'CLEAR_USERLIST_DATA';
export const CLEAR_USERLIST_DETAILS = 'CLEAR_USERLIST_DETAILS';
export const UPDATE_USERLIST_DATA = 'UPDATE_USERLIST_DATA';
//action creators
export function adduserlistdata(data) {
    return {
        type: ADD_USERLIST_DATA,
        data,
    };
};
export function updateuserlistdata(data) {
    return {
        type: UPDATE_USERLIST_DATA,
        data,
    };
};
export function clearuserlistdata() {
    return {
        type: CLEAR_USERLIST_DATA,
    };
};
export function clearuserlistdetails() {
    return {
        type: CLEAR_USERLIST_DETAILS,
    };
};

let empty = [];
let userlist = [];
export default function UserlistReducer(state = userlist, action) {
    switch (action.type) {
        case ADD_USERLIST_DATA:
            return action.data;
        case UPDATE_USERLIST_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_USERLIST_DETAILS:
            return empty;
        default:
            return state;
    }
};
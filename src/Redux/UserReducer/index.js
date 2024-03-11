import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable prettier/prettier */
export const ADD_USER_DATA = 'ADD_USER_DATA';
export const ADD_DONER_DATA = 'ADD_DONER_DATA';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const CLEAR_USER_DETAILS = 'CLEAR_USER_DETAILS';
export const UPDATE_DATA = 'UPDATE_DATA';
//action creators
export function adduserdata(data) {
    return {
        type: ADD_USER_DATA,
        data,
    };
}

export function adddonerprofiledata(data) {
    return {
        type: ADD_USER_DATA,
        data,
    };
}
export function updatedata(data) {
    return {
        type: UPDATE_DATA,
        data,
    };
}
export function clearuserdata() {
    return {
        type: CLEAR_USER_DATA,
    };
}
export function clearuserdetails() {
    return {
        type: CLEAR_USER_DETAILS,
    };
}

//global State
// Intial State 
let empty = {};
let user = {};
const initialState={
    user : {},
    donerProfile:{}
}

AsyncStorage.getItem('@user').then(result => {
    if (result) {
        Object.assign(user, JSON.parse(result))
    }
})
export default function UserReducer(state = user, action) {
    switch (action.type) {
        case ADD_USER_DATA:
            // console.log('User Reducer===>',action)
            return action.data;
        case UPDATE_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_USER_DETAILS:
            return empty;
        default:
            return state;
    }
}
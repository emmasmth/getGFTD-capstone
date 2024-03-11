import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable prettier/prettier */
export const ADD_MYFRIENDLIST_DATA = 'ADD_MYFRIENDLIST_DATA';
export const CLEAR_MYFRIENDLIST_DATA = 'CLEAR_MYFRIENDLIST_DATA';
export const CLEAR_MYFRIENDLIST_DETAILS = 'CLEAR_MYFRIENDLIST_DETAILS';
export const UPDATE_MYFRIENDLIST_DATA = 'UPDATE_MYFRIENDLIST_DATA';
//action creators
export function addmyfriendlistdata(data) {
    return {
        type: ADD_MYFRIENDLIST_DATA,
        data,
    };
};
export function updatemyfriendlistdata(data) {
    return {
        type: UPDATE_MYFRIENDLIST_DATA,
        data,
    };
};
export function clearmyfriendlistdata() {
    return {
        type: CLEAR_MYFRIENDLIST_DATA,
    };
};
export function clearmyfriendlistdetails() {
    return {
        type: CLEAR_MYFRIENDLIST_DETAILS,
    };
};

// Intial State 
let empty = []
let myfriendlist = []
// AsyncStorage.getItem('@user').then(result => {
//     if (result) {
//         // console.log(result)
//         Object.assign(user, JSON.parse(result))
//     }
// })
export default function MyFriendlistReducer(state = myfriendlist, action) {
    switch (action.type) {
        case ADD_MYFRIENDLIST_DATA:
            return action.data;
        case UPDATE_MYFRIENDLIST_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_MYFRIENDLIST_DATA:
            return empty;
        default:
            return state;
    };
}
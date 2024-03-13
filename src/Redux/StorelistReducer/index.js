import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable prettier/prettier */
export const ADD_STORELIST_DATA = 'ADD_STORELIST_DATA';
export const CLEAR_STORELIST_DATA = 'CLEAR_STORELIST_DATA';
export const CLEAR_STORELIST_DETAILS = 'CLEAR_STORELIST_DETAILS';
export const UPDATE_STORELIST_DATA = 'UPDATE_STORELIST_DATA';
//action creators
export function addstorelistdata(data) {
    return {
        type: ADD_STORELIST_DATA,
        data,
    };
};
export function updatestorelistdata(data) {
    return {
        type: UPDATE_STORELIST_DATA,
        data,
    };
};
export function clearstorelistdata() {
    return {
        type: CLEAR_STORELIST_DATA,
    };
};
export function clearstorelistdetails() {
    return {
        type: CLEAR_STORELIST_DETAILS,
    };
};

// Intial State 
let empty = []
let storelist = []
// AsyncStorage.getItem('@user').then(result => {
//     if (result) {
//         // console.log(result)
//         Object.assign(user, JSON.parse(result))
//     }
// })
export default function StorelistReducer(state = storelist, action) {
    switch (action.type) {
        case ADD_STORELIST_DATA:
            return action.data;
        case UPDATE_STORELIST_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_STORELIST_DATA:
            return empty;
        default:
            return state;
    }
};
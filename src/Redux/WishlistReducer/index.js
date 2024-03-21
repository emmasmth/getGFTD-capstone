import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable prettier/prettier */
export const ADD_WISHLIST_DATA = 'ADD_WISHLIST_DATA';
export const CLEAR_WISHLIST_DATA = 'CLEAR_WISHLIST_DATA';
export const CLEAR_WISHLIST_DETAILS = 'CLEAR_WISHLIST_DETAILS';
export const UPDATE_WISHLIST_DATA = 'UPDATE_WISHLIST_DATA';
//action creators
export function addwishlistdata(data) {
    return {
        type: ADD_WISHLIST_DATA,
        data,
    };
};
export function updatewishlistdata(data) {
    return {
        type: UPDATE_WISHLIST_DATA,
        data,
    };
};
export function clearwishlistdata() {
    return {
        type: CLEAR_WISHLIST_DATA,
    };
};
export function clearwishlistdetails() {
    return {
        type: CLEAR_WISHLIST_DETAILS,
    };
};

// Intial State 
let empty = []
let wishlist = []
// AsyncStorage.getItem('@user').then(result => {
//     if (result) {
//         // console.log(result)
//         Object.assign(user, JSON.parse(result))
//     }
// })
export default function WishlistReducer(state = wishlist, action) {
    switch (action.type) {
        case ADD_WISHLIST_DATA:
            return action.data;
        case UPDATE_WISHLIST_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_WISHLIST_DATA:
            return empty;
        default:
            return state;
    }
};
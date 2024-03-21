import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable prettier/prettier */
export const ADD_TRENDING_DATA = 'ADD_TRENDING_DATA';
export const CLEAR_TRENDING_DATA = 'CLEAR_TRENDING_DATA';
export const CLEAR_TRENDING_DETAILS = 'CLEAR_TRENDING_DETAILS';
export const UPDATE_TRENDING_DATA = 'UPDATE_TRENDING_DATA';
//action creators
export function addtrendingdata(data) {
    // console.log('addtrendingdata', data)
    return {
        type: ADD_TRENDING_DATA,
        data,
    };
};
export function updatetrendingdata(data) {
    return {
        type: UPDATE_TRENDING_DATA,
        data,
    };
};
export function cleartrendingdata() {
    return {
        type: CLEAR_TRENDING_DATA,
    };
};
export function cleartrendingdetails() {
    return {
        type: CLEAR_TRENDING_DETAILS,
    };
};

// Intial State 
let empty = []
let trending = []
// AsyncStorage.getItem('@user').then(result => {
//     if (result) {
//         // console.log(result)
//         Object.assign(user, JSON.parse(result))
//     }
// })
export default function TrendingReducer(state = trending, action) {
    switch (action.type) {
        case ADD_TRENDING_DATA:
            return action.data;
        case UPDATE_TRENDING_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_TRENDING_DATA:
            return empty;
        default:
            return state;
    }
};
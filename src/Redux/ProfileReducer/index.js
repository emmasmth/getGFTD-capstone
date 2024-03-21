/* eslint-disable prettier/prettier */
export const ADD_PROFILE_IMAGE = 'ADD_PROFILE_IMAGE';
export const CLEAR_PROFILE_IMAGE = 'CLEAR_PROFILE_IMAGE';
export const UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE';
//action creators
export function addprofileimage(data) {
    return {
        type: ADD_PROFILE_IMAGE,
        data,
    };
}
export function updateprofileimage(data) {
    return {
        type: UPDATE_PROFILE_IMAGE,
        data,
    };
}

export function clearprofileimage() {
    return {
        type: CLEAR_PROFILE_IMAGE,
    };
}

//global State
// Intial State 
let empty = '';
let image = '';

export default function ProfileReducer(state = image, action) {
    switch (action.type) {
        case ADD_PROFILE_IMAGE:
            return action.data;
        case UPDATE_PROFILE_IMAGE:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_PROFILE_IMAGE:
            return empty;
        default:
            return state;
    }
}
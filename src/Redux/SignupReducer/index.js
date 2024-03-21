/* eslint-disable prettier/prettier */
//actions
export const ADD_SIGNUP_DATA = 'ADD_SIGNUP_DATA';
export const UPDATE_SIGNUP_DATA = 'UPDATE_SIGNUP_DATA';
export const CLEAR_SIGNUP_DATA = 'CLEAR_SIGNUP_DATA';
export const CLEAR_SIGNUP_DETAILS = 'CLEAR_SIGNUP_DETAILS';
//action creators
export function addsignupdata(data) {
    return {
        type: ADD_SIGNUP_DATA,
        data,
    };
};
export function updatesignupdata(data) {
    return {
        type: UPDATE_SIGNUP_DATA,
        data,
    };
};
export function clearsignupdata() {
    return {
        type: CLEAR_SIGNUP_DATA,
    };
};
export function clearsignupdetails() {
    return {
        type: CLEAR_SIGNUP_DETAILS,
    };
};

//global state
let data = {};
let empty = {};

//reducer
export default function SignupReducer(state = data, action) {
    switch (action.type) {
        case ADD_SIGNUP_DATA:
            return action.data;
        case UPDATE_SIGNUP_DATA:
            // console.log('UPDATE_SIGNUP_DATA====>', Object.keys(action.data),'Action data value===>', Object.values(action.data));
            return {
                ...state,
                ...action.data
            };
        case CLEAR_SIGNUP_DETAILS:
            return empty;

        case CLEAR_SIGNUP_DATA:
            return empty;
        default:
            return state;
    }
};

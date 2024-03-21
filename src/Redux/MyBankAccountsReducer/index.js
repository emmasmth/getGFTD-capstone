/* eslint-disable prettier/prettier */
export const ADD_BANK_ACCOUNTS = 'ADD_BANK_ACCOUNTS';
export const CLEAR_BANK_ACCOUNTS = 'CLEAR_BANK_ACCOUNTS';
export const CLEAR_BANK_ACCOUNTS_DETAILS = 'CLEAR_BANK_ACCOUNTS_DETAILS';
export const UPDATE_BANK_ACCOUNTS = 'UPDATE_BANK_ACCOUNTS';

//action creators
export function addbankaccounts(data) {
    return {
        type: ADD_BANK_ACCOUNTS,
        data,
    };
};
export function updatebankaccounts(data) {
    return {
        type: UPDATE_BANK_ACCOUNTS,
        data,
    };
};
export function clearbankaccounts() {
    return {
        type: CLEAR_BANK_ACCOUNTS,
    };
};
export function clearbankaccountsdetails() {
    return {
        type: CLEAR_BANK_ACCOUNTS_DETAILS,
    };
};

// Intial State 
let empty = [];
let bankAccounts = [];

export default function MyBankAccountsReducer(state = bankAccounts, action) {
    switch (action.type) {
        case ADD_BANK_ACCOUNTS:
            return action.data;
        case UPDATE_BANK_ACCOUNTS:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case CLEAR_BANK_ACCOUNTS:
            return empty;
        default:
            return state;
    };
};
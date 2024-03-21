export const UPDATE_SIGNUP_STATUS = 'UPDATE_SIGNUP_STATUS';

//action creators
export function update_signup_status(data) {
  return {
    type: UPDATE_SIGNUP_STATUS,
    payload: data,
  };
}

const initialState = {
  isSignup: false,
};
export default SignupStatusReducer = (state = initialState, action) => {
  // console.log('SignupStatusReducer===>', action.payload)

  switch (action.type) {
    case UPDATE_SIGNUP_STATUS:
      return {
        ...state,
        isSignup: action.payload,
      };
    default:
      return state;
  }
}
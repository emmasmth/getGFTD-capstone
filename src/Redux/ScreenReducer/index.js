/* eslint-disable prettier/prettier */
//actions
export const IS_SETTINGS_TAP = 'IS_SETTINGS_TAP';
export const openMenu = 'OpenMenu';
export const setProfile = 'SetProfile';
export const setShortList = 'SetShortList';
export const userSportName = 'UserSportName';
//action creators
export function issettingstap(state) {
  return {
    type: IS_SETTINGS_TAP,
    isSettingsTap: state,
  };
}


const initialState = {
  isSettingsTap: false,

};
export default ScreenRedux = (state = initialState, action) => {
  const {type, isSettingsTap} = action;

  switch (type) {
    case IS_SETTINGS_TAP:
      return Object.assign({}, state, {
        isSettingsTap: isSettingsTap,
      });
    default:
      return state;
  }
};
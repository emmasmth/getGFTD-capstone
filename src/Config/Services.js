/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
import React from 'react';
import { APIS, Headers } from './api';
import { Alert, Linking } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { err } from 'react-native-svg';
// import auth from '@react-native-firebase/auth';

export const Service = {

  login: async (
    state,
    setloading,
    adduserData,
    navigation,
    setUserToken,
    setSignupData,

    // updateSigninStatus
  ) => {
    setloading(true);
    await Axios.post(APIS.Login, state, Headers)
      .then(async (res) => {
        console.log(res.data);
        // if (res.data.data.account_status === "pending" && res.data.data.account_group !== "social_signup") {
        //   setSignupData(res.data.data)
        //   navigation.navigate('SignupInfo');
        // }
        // else {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${res.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });

        await Axios.get(APIS.ProfileInfo, {
          headers: {
            'Accept': 'application/json',
            'X-Access-Token': `${res.data.data.api_token}`,
            'platform': Platform.OS,
            'app-version': deviceInfoModule.getVersion()
          },
        })
          .then(async (response) => {
            // console.warn("token here ==>", response.data.data.api_token)
            setUserToken(response.data.data.api_token);
            adduserData(response.data.data);
            // updateSigninStatus(true)
            await AsyncStorage.setItem('@accessToken', response.data.data.api_token);
            await AsyncStorage.setItem('@apiToken', response.data.data.api_token);
            await AsyncStorage.setItem('@user', JSON.stringify(response.data.data));
            await AsyncStorage.setItem('@thanksnotification', 'thanksIsOn');
            await AsyncStorage.setItem('@giftnotification', 'giftIsOn');
            setloading(false);
          })
          .catch(err => {
            setloading(false);
          })
        // }
      })
      .catch((err) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message} `,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
      })
      .finally(() => {
        setloading(false)
      })
  },

  CheckPhone: async (state, setloading) => {
    const isUnregistered = await Axios.post(APIS.CheckPhone, state, Headers).then((response) => {
      if (!!response) {
        console.log("response of check otp", response);
        return true
      }
    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => { setloading(false); }
      });
      return false;
    })
    return isUnregistered
  },

  signup: async (state, confirmation, navigation,) => {
    await Axios.post(APIS.Register, state, Headers)
      .then((res) => {
        if (!!res) {
          navigation.navigate('OTP', { confirm: confirmation });
          // navigation.navigate('SignupInfo');
        }
      })
      .catch((err) => {
        console.log("error: " + err);

        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Login')
        });
      });
  },




  CompleteSignup: async (state, setLoading, adduserData) => {
    Axios.post(APIS.Signup, state, Headers).then((res) => {
      console.log('Complete Register =>', res.data)
      let _state = {
        email: res.data.data.email,
        password: state.password,
        device_token: res.data.data.device_token,
      };

      let _params = JSON.stringify(_state);
      console.log('social to login param', _params)

    })

  },
  OTP: async (state, navigation, setloading, updateSignupData,
  ) => {
    setloading(true);
    await Axios.post(APIS.OTP, state, Headers)
      .then((res) => {
        navigation.navigate('SignupInfo')
        updateSignupData(res.data.data);
        setloading(false);
      })
      .catch((err) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        // console.log('Service => OTP => error =>', err);
        setloading(false);
      });
  },
  SocialSignup: async (state,
    setloading,
    adduserData,
    setAccessToken,
  ) => {
    setloading(true);
    await Axios.post(APIS.SocialSignup, state, Headers)
      .then(async (res) => {
        console.log('SocialSignup Register =>', res.data)

        let _state = {
          email: res.data.data.email,
          password: state.password,
          device_token: res.data.data.device_token,
        };

        let _params = JSON.stringify(_state);
        console.log('social to login param', _params)
        await Axios.post(APIS.Login, _params, Headers)
          .then((res) => {
            console.log('Login with Social Sign Up =>', res.data.data)
            // setTimeout(async () => {
            //   await Service.GetStripStatus(apiToken, updateSigninStatus);
            // }, 10000);
            // updateSigninStatus(true);
            setAccessToken(res.data.token);
            adduserData(res.data.data);
            // global.token = res.data.token;
            AsyncStorage.setItem('@accessToken', res.data.token);
            // setIsSSNVisible(false)
            // setloading(false);
          })
          .catch((err) => {
            Toast.show({
              type: 'tomatoToast',
              text1: "Attention",
              text2: `${err.response.data.message}`,
              autoHide: true,
              position: 'top',
              visibilityTime: 2000,
            });
            console.log('Error on Login With Social Signup =>', `${err.response.data.message}`)
          })
          .finally(() => {
            setloading(false)
          })
      })

  },

  NewSignup: async (data, setLoading, adduserData, setAccessToken) => {
    await Axios.post(APIS.NewSignup, data, Headers).then((res) => {
      if (!!res) {
        console.log(" New Signup ", res.data.data);
        setAccessToken(res.data.data.api_token);
        adduserData(res.data.data);
        // global.token = res.data.token;
        AsyncStorage.setItem('@accessToken', res.data.data.api_token);
      }
    }).catch((err) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${err.response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
      });
    }).finally(() => {
      setLoading(false)
    })
  },
  CompleteProfile: async (state, device_token, apiToken, navigation, setloading, adduserData, setIsSSNVisible, setUserToken, updateSigninStatus) => {
    // console.log('Complete Prfoile Params ===>', device_token)
    const params = JSON.stringify(state)
    setloading(true);
    await Axios.post(APIS.completeProfile, params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        if (res) {
          // console.log('CompleteProfile====>', res.data.data);
          await analytics().logSignUp({ method: "email" })

          const obj = {
            wishlist_title: 'General',
            privacy: 1,
          }

          const data = JSON.stringify(obj)
          await Axios.post(APIS.CreateWishlists, data, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'text/plain',
              'X-Access-Token': `${apiToken}`,
            },
          })
            .then((response) => {
              // console.log('Success Default Wishlist Created', response.data)
            })
            .catch(err => console.log('Error', err.response.data.message))
          Toast.show({
            type: 'tomatoToast',
            text1: "Success",
            text2: `${res.data.message}`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
          });
        }
        try {
          let _state = {
            email: state.email,
            password: state.password,
            device_token: device_token,
          };

          let _params = JSON.stringify(_state);
          // console.log('checking authorized', _params);
          await Axios.post(APIS.Login, _params, Headers)
            .then((res) => {
              setTimeout(async () => {
                await Service.GetStripStatus(apiToken, updateSigninStatus);
              }, 10000);
              updateSigninStatus(true);
              setUserToken(res.data.token);
              adduserData(res.data.data);
              // global.token = res.data.token;
              AsyncStorage.setItem('@accessToken', res.data.token);
              // setIsSSNVisible(false)
              // setloading(false);
            })
            .catch((err) => {
              Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: `${err.response.data.message}`,
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
              });
            })
            .finally(() => {
              setloading(false)
            })
        }
        catch (err) {
          console.log('complete profile error', err);
        }
      })
      .catch((err) => {
        console.log('Error in complete profile', err)
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        console.log('Service => Complete Profile => error =>', err);
      })
      .finally(() => {
        setloading(false);
        // setIsSSNVisible(false);
      })
  },
  UpdateProfile: async (state, apiToken, navigation, adduserData, setloading, getProfileImage, callAfterTenSeconds, updateSigninStatus) => {
    const params = JSON.stringify(state)
    setloading(true);
    await Axios.post(APIS.completeProfile, params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        callAfterTenSeconds()
        getProfileImage();
        updateSigninStatus(true);
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${res.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation !== null ? navigation.goBack() : () => { },
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 3000,
        });
      })
      .finally(() => {
        setloading(false);
      })
  },
  GetMyReferrals: async (apiToken, setReferralURL, setRewardsPoints, setMyReferrals, setLoading) => {
    setLoading(true)
    await Axios.get(APIS.GetMyReferrals, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        setReferralURL(res.data.referral_url);
        setRewardsPoints(res.data.totalpoints)
        setMyReferrals(res.data.data);
      })
      .catch((err) => {
        console.log('failed get my referrals ===>', err.response);
      })
      .finally(() => {
        setLoading(false)
      })
  },
  RedeemReferralRewards: async (apiToken, data, setLoading, fetchReferralData) => {
    setLoading(true);
    await Axios.post(APIS.RedeemReferralRewards, data, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${res.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => fetchReferralData(),
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .finally(() => {
        setLoading(false)
      })
  },
  CheckToken: async (signout) => {
    const token = await AsyncStorage.getItem("@accessToken")
    await Axios.get(APIS.CheckToken, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${token}`,
      },
    })
      .then(async (res) => {
        if (res.data.message == 'authorized_user') {
          return true;
        }
        else if (res.data.message == 'unauthorized_user') {
          Alert.alert(
            "Session Expired",
            "Please log in again",
            [
              { text: "Ok", onPress: () => signout() }
            ]
          );
        }
      })
      .catch((err) => {
        console.log('failed', err.response);
      });
  },
  CheckAppVersions: async (currentVersion) => {
    await Axios.get(APIS.CheckAppVersions, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        // 'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        // console.log('Response ==>', res.data.app_version[0]);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  },
  updateMainProfile: async (state, apiToken, adduserData, setloading, getProfileImage) => {
    const params = JSON.stringify(state)
    setloading(true);
    await Axios.post(APIS.completeProfile, params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        adduserData(res.data.data);
        getProfileImage();
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${res.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
      })
      .catch((err) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          // onHide: () => navigation !== null ? navigation.goBack() : () => { },
        });
        // console.log('Service => Complete Profile => error =>', err);
        setloading(false);
      });
  },
  ForgotPassword: async (state, setloading) => {
    setloading(true);
    await Axios.post(APIS.ForgotPassword, state, Headers)
      .then(async (res) => {

        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `'Please check your email'`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
      })
      .catch((err) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        console.log('Service => OTP => error =>', err);
        setloading(false);
      });
  },
  DeleteAccount: async (apiToken,) => {
    await Axios.delete(APIS.DeleteAccount, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        console.log('Delete account', response);
      })
      .catch(err => {
        // setloading(false)
        console.log('Delete acc error', err)
        Alert.alert(err.message)
      })

  },
  AddToWishlist: async (state, apiToken, setMessage, fetchList) => {
    await Axios.post(APIS.addToWishlist, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        fetchList('0');
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })

  },
  GetUserList: async (apiToken, setUsersList, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetLists}/1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setloading(false);
        setUsersList(response.data.data)
      })
      .catch(err => {
        setloading(false);
        console.log('Error on userlist fetch', err);
      })
  },
  GetStoreList: async (apiToken, setStoreList, setFilteredData, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetLists}/2`, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': apiToken,
      },
    })
      .then((response) => {
        setStoreList(response.data.data);
        setFilteredData(response.data.data);
      })
      .catch(err => {
        console.log('Error on GetStoreList', err.response);
      })
      .finally(() => {
        setloading(false);
      })
  },
  GetMyWishList: async (apiToken, setWishList, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetLists}/3`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setWishList(response.data.data);
      })
      .catch(err => {
        console.log('Error on wishlist fetching', err.response);
      })
      .finally(() => {
        setloading(false);
      })
  },
  CreateWishlists: async (data, apiToken, setloading, setIsVisible, clearState) => {
    setloading(true)
    await Axios.post(APIS.CreateWishlists, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });

      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .finally(() => {
        clearState();
        setIsVisible(false);
        setloading(false);
      })
  },
  EditWishlists: async (data, apiToken, setloading, setIsVisible, showWishlists) => {
    setloading(true)
    await Axios.post(APIS.EditWishlists, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });

      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .finally(() => {
        setIsVisible(false);
        showWishlists();
        setloading(false);
      })
  },
  DeleteWishlists: async (data, apiToken, setloading, ShowWishlists) => {
    setloading(true)
    await Axios.post(APIS.DeleteWishlists, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });

      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        // console.log('Error on wishlist fetching', err);
      })
      .finally(() => {
        ShowWishlists();
        setloading(false);
      })
  },
  ShowWishlists: async (apiToken, setWishList, setloading,) => {
    setloading(true)
    await Axios.get(APIS.ShowWishlists, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setWishList(response.data.data);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on wishlist fetching', err);
      })
  },
  ContactUs: async (state, apiToken, setloading, navigation) => {
    setloading(true)
    await Axios.post(`${APIS.ContactUs}`, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {

        Toast.show({
          type: 'success',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Home', { screen: 'SendGFTD' }),
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          // onHide: () => navigation.navigate('Home', { screen: 'SendGFTD' }),
        });
        setloading(false);
        console.log('ContactUs error', err);
      })
  },
  PostFeeds: async (state, apiToken, setloading, navigation) => {
    setloading(true)
    await Axios.post(`${APIS.PostFeeds}`, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `Feed posted successfully`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Feeds')
        });
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Post feed error', err);
      })
  },
  RemoveFeed: async (state, apiToken, fetchData) => {
    // setloading(true)
    await Axios.post(`${APIS.RemoveFeed}`, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `Feed deleted successfully`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => fetchData(),
        });
        // setloading(false);
      })
      .catch(err => {
        // setloading(false);
        console.log('RemoveFeed error', err);
      })
  },
  GetFeeds: async (setData, addFeedData, apiToken, setloading,) => {
    setloading(true);
    await Axios.get(`${APIS.GetFeeds}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        await setData(response.data.data);
        await addFeedData(response.data.data);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error===>', err);
      })
  },
  AddItems: async (state, apiToken, setloading, navigation, unmount, getWishlist) => {
    setloading(true)
    await Axios.post(APIS.AddItems, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        unmount();
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            if (getWishlist.length > 1) navigation.navigate('Wishlist');
          },
        });
      })
      .catch((err) => {
        if (err.response.status == 400) {
          Toast.show({
            type: 'tomatoToast',
            text1: "Attention",
            text2: `${err.response.data.message}`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
            onHide: () => navigation.navigate('Home', { screen: 'SendGFTD' }),
          });
        }
        if (err.response.status === 500) {
          Toast.show({
            type: 'tomatoToast',
            text1: "Something went wrong!",
            text2: `Please try again later`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
            onHide: () => navigation.navigate('Home', { screen: 'SendGFTD' }),
          });
        }
      })
      .finally(() => setloading(false))
  },
  UpdateItems: async (state, apiToken, setloading, navigation) => {
    setloading(true)
    await Axios.post(APIS.UpdateItems, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.goBack(),
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.goBack(),
        });
        console.log('Update item error', err);
        setloading(false);
      })
  },
  SentGift: async (id, apiToken, setSentGifts, setReceivedGifts, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.SentGift + id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        setSentGifts(response.data.data.filter(i => i.gift_send_type == 1));
        setReceivedGifts(response.data.data.filter(i => i.gift_send_type == 2));
      })
      .catch(err => {
        console.log('Error on SendGFT', err.response);
      })
      .finally(() => {
        setloading(false);
      })
  },
  SendGift: async (data, apiToken, setloading, setIsVisible, navigation, willUmount, setDisabled) => {
    setloading(true)
    setDisabled(true);
    await Axios.post(APIS.SendGift, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        if (response.data.status === true) {
          Alert.alert('Success',
            response.data.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsVisible(false);
                  setTimeout(() => {
                    willUmount();
                    navigation.navigate('App');
                  }, 200)
                }
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch(err => {
        setDisabled(false);
        Alert.alert('Error', err.response.data.message,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            },
          ],
          { cancelable: false }
        );
        console.log('SendGift error', err.response);
      })
      .finally(() => {
        setloading(false);
      })
  },
  GetFriendlist: async (apiToken, setMyFriendlist, setFullData, setloading) => {
    setloading(true)
    await Axios.get(APIS.GetFriendlist, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setMyFriendlist(response.data.data.filter(i => i.user_info != null));
        setFullData(response.data.data.filter(i => i.user_info != null));
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on GetFriendlist', err);
      })
  },
  GetAllGftdUsers: async (apiToken, setAllGftdUsers, setFullData, setloading,) => {
    setloading(true)
    await Axios.get(APIS.GetAllGftdUsers, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setAllGftdUsers(response.data.users);
        setFullData(response.data.users)
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on  GetAllGftdUsers', err);
      })
  },
  ChangeNumber: async (state, apiToken, setloading, navigation, signOut) => {
    setloading(true)
    await Axios.post(`${APIS.ChangeNumber}`, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => signOut(),
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Home', { screen: 'SendGFTD' }),
        });
        setloading(false);
        console.log('change number error', err);
      })
  },
  CheckBankAccount: async (apiToken, setloading,) => {
    setloading(true)
    await Axios.get(APIS.CheckBankAccount, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('CheckBankAccount error', err);
      })
  },
  AddBankAccount: async (state, apiToken, setloading, navigation) => {
    setloading(true)
    await Axios.post(APIS.AddBankAccount, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Home'),
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Home'),
        });
        setloading(false);
        console.log('add bank acc error', err);
      })
  },
  BankDetails: async (state, apiToken, setloading, navigation) => {
    setloading(true)
    await Axios.post(APIS.BankDetails, state, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Home'),
        });
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => navigation.navigate('Home'),
        });
      })
      .finally(() => {
        setloading(false);
      })
  },
  DeleteBankDetails: async (apiToken, id, GetBankAccounts) => {
    await Axios.delete(`${APIS.DeleteBankDetails}${id}`, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        GetBankAccounts()
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        console.log('delete bank detials error', err)
      })
  },
  LikeNotification: async (apiToken, id) => {
    await Axios.post(`${APIS.LikeNotification}`, id, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        // GetBankAccounts()
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })

  },
  ShowbankDetails: async (apiToken, setBankAccounts, setloading) => {
    setloading(true)
    await Axios.get(APIS.ShowBankDetails, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setBankAccounts(response.data.data);
      })
      .catch(err => {
        console.log('ShowbankDetails error', err);
      })
      .finally(() => {
        setloading(false);
      })
  },
  GetWallet: async (apiToken, setWallet, setloading,) => {
    setloading(true)
    await Axios.get(APIS.GetWallet, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        // console.log('Get Wallet Api res ===>', response.data)
        await setWallet(response.data);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on getting wallet fetch', err);
      });
  },
  AdminMargin: async (setMargin, setloading,) => {
    setloading(true)
    await Axios.get(APIS.AdminMargin)
      .then(async (response) => {
        // console.log('Get margin Api res ===>', typeof Number(response.data.adminmargin))
        await setMargin(Number(response.data.adminmargin));
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on admin margin fetch', err);
      });
  },
  RedeemSila: async (data, apiToken, setloading, setIsVisible, navigation, showAlert, setShowAlert) => {
    setloading(true)
    await Axios.post(`${APIS.RedeemSila}`, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            setIsVisible(false);
            setShowAlert(!showAlert);
          },
        });
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            setIsVisible(false);
            navigation.navigate('Home', { screen: 'SendGFTD' })
          },
        });
        console.log('Error on redeem wallet', err);
      });
  },
  GetUsersStorelist: async (userId, apiToken, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetUsersStorelist}userId`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('GetUsersStorelist errror', err);
      })
  },
  GetUsersWishlist: async (userId, apiToken, setWishlistData, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetUsersWishlist + userId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setWishlistData(response.data.data);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log("Error on user's wishlist fetching", err);
      })
  },
  GetWishlistsByUserId: async (userId, apiToken, setWishlistData, setloading, setListId, fetchList) => {
    setloading(true)
    await Axios.get(`${APIS.GetWishlistsByUserId + userId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setWishlistData(response.data.data);
        const replceId = response.data.data.map(x => (x.title === 'General' ? { ...x, id: '0' } : x));
        const generalList = replceId.filter(wishlist => wishlist.title == 'General');
        // console.log('generalList,replceId', generalList);
        generalList.map((item, index) => { setListId(item.id), fetchList(item.id) });
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log("Error on user's wishlist fetching", err);
      })
  },
  GetWishlistsByUserIdWishId: async (userId, wishlistId, apiToken, setWishlistData, setloading, setRefresh) => {
    setloading(true);
    setRefresh(true);
    await Axios.get(`${APIS.GetWishlistsByUserIdWishId + userId + '/' + wishlistId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setWishlistData(response.data.data);
        setloading(false);
        setRefresh(false);
      })
      .catch(err => {
        setloading(false);
        setRefresh(false);
        console.log("Error on user's wishlist fetching", err);
      });
  },
  GetBalance: async (apiToken, setloading, setStatus, setActionItem, setAccessToken) => {
    setloading(true);
    await Axios.get(APIS.GetBalance, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        setStatus(err.response.data.status)
        setActionItem(err.response.data.action_required)
        setAccessToken(err.response.data.access_token)
        console.log("Error on fetching get balance", err);
      })
  },
  GetUsersFriendlist: async (userId, apiToken, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetUsersFriendlist}userId`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('GetUsersFriendlist error', err);
      })
  },
  GetUsersItems: async (userId, apiToken, setloading,) => {
    setloading(true)
    await Axios.get(`${APIS.GetUsersItems}userId`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('GetUsersItems error', err);
      })
  },
  AddFriend: async (userId, apiToken, setloading, GetAllGftdUsers, fetchMyFriends, setPressed,) => {
    setloading(true)
    await Axios.post(APIS.AddFriend, userId, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setPressed(false);
        GetAllGftdUsers()
        fetchMyFriends();
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setPressed(false);
        setloading(false);
      })
  },
  RemoveFriend: async (userId, apiToken, setloading, GetMtFriends, setPressed) => {
    setloading(true)
    await Axios.post(APIS.RemoveFriend, userId, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setPressed(false);
        GetMtFriends();
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setPressed(false);
        setloading(false);
        console.log('RemoveFriend error', err.response.data.message);
      })
  },
  Sorting: async (data, apiToken, setStoreList, setFilterDataTo, setloading,) => {
    setloading(true)
    await Axios.post(APIS.Sorting, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        console.log(response.data.data);
        setStoreList(response.data.data);
        setFilterDataTo(response.data.data);

        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
        console.log('Sorting error', err.response.data);
      })
  },
  GetAllNotifications: async (apiToken, setNotifications, setloading,) => {
    setloading(true)
    await Axios.get(APIS.GetAllNotifications, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        setNotifications(response.data.data);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on notificationlist fetching', err);
      })
  },
  GetProfileImage: async (apiToken, setFilePath, updateProfileImage, setloading) => {
    setloading(true)
    await Axios.get(APIS.GetProfileImage, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        setFilePath(response.data.profile_image);
        updateProfileImage(response.data.profile_image)
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on profile image fetching', err);
      })
  },
  ProfileInfo: async (apiToken, setloading, setUserData) => {
    setloading(true)
    await Axios.get(APIS.ProfileInfo, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
        'platform': Platform.OS,
        'app-version': deviceInfoModule.getVersion(),
      },
    })
      .then(async (response) => {
        console.log('Profile data', response.data.data)
        setUserData(response.data.data);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log('Error on profile info fetching', err);
      })
  },
  NotificationReply: async (data, apiToken, setloading, navigation, setModalVisible, modalVisible) => {
    setloading(true)
    await Axios.post(APIS.NotificationReply, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            navigation.navigate('Home');
            setModalVisible(!modalVisible);
          },
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            navigation.navigate('Home');
            setModalVisible(!modalVisible);
          },
        });
        setloading(false);
        console.log('NotificationReply error', err);
      })
  },
  UserSetting: async (data, apiToken, setloading) => {
    setloading(true)
    await Axios.post(APIS.UserSetting, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then((response) => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
        console.log('UserSetting error', err);
      })
  },
  GetEmojis: async (data, setEmojis, setFilteredData, setloading) => {
    setloading(true)
    await Axios.post(APIS.GetEmojis, data, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => {

        let test = response.data.data.sort((a, b) => a.name.localeCompare(b.name))
        // console.log("response.test ==>", test);
        setEmojis(test);
        setFilteredData(test);
        setloading(false);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        setloading(false);
        console.log('GetEmojis error', err);
      })
  },
  GetEmojisWithCategory: async (setEmojisByCategory, setEmojisByEmojis, setFullData, setloading) => {
    setloading(true)
    await Axios.get(APIS.GetEmojisWithCategory)
      .then(async (response) => {
        console.log("response.data.emoji_category", response.data.emoji_category);
        setEmojisByCategory(await response.data.emoji_category.reverse());
        setEmojisByEmojis(await response.data.emojis);
        setFullData(await response.data.emojis);
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
        console.log('GetEmojisWithCategory error', err);
      })
      .finally(() => {
        setloading(false);
      })
  },
  TrackUser: async (apiToken, data) => {
    await Axios.post(APIS.TrackUser, data, {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        return true;
      })
      .catch(err => {
        console.log('TrackUser error', err);
      })
  },
  TrackItems: async (apiToken, data) => {
    await Axios.post(APIS.TrackItems, data, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        return true
      })
      .catch(err => {
        console.log('TrackItems error', err);
      })
  },
  GetEvents: async (apiToken, setEvents, setloading) => {
    setloading(true)
    await Axios.get(APIS.GetEvents, {
      headers: {
        'Accept': 'application/json',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        if (response) setEvents(response.data.data)
      })
      .catch(err => {
        // console.log('GetEvents error', err);
      })
      .finally(() => {
        setloading(false);
      })
  },

  DefaultBank: async (apiToken, id, GetBankAccounts) => {
    await Axios.post(APIS.DefaultBank, id, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        GetBankAccounts();
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        });
      })
  },

  GetClientSecretStripe: async (apiToken, setSecretClient) => {
    await Axios.get(`${APIS.GetClientSecretStripe}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        console.log('success getclientsecret', response.data.data);
        setSecretClient(response.data.data.client_secret)
      })
      .catch(err => {
        console.log('GetClientSecretStripe error', err);
      })

  },
  GetClientSecretStripeBank: async (apiToken, setSecretClientBank) => {
    console.log("I called")
    await Axios.get(`${APIS.GetClientSecretStripeBank}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        setSecretClientBank(response.data.data.client_secret)

      })
      .catch(err => {
        console.log('GetClientSecretStripeBank error', err);
      })

  },

  PostClientSecret: async (apiToken, objSecret, GetBankAccounts) => {
    await Axios.post(APIS.PostClientSecret, objSecret, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        if (!!response.data) {
          Toast.show({
            type: 'tomatoToast',
            text1: "Success",
            text2: `${response.data.message}`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
            onHide: () => {
              GetBankAccounts();
            }
          });
        }
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        })
        console.log("Errorr post client secret", err)
      })

  },
  AddStripeBankAccount: async (apiToken, obj, GetBankAccounts) => {
    await Axios.post(APIS.AddStripeBankAccount, obj, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        if (!!response.data) {
          Toast.show({
            type: 'tomatoToast',
            text1: "Success",
            text2: `${response.data.message}`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
            onHide: () => {
              GetBankAccounts();
            }
          });
        }
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        })
        console.log("Errorr post client secret", err)
      })

  },
  PostClientSecretBank: async (apiToken, obj, GetRecieveBankAccounts) => {
    await Axios.post(APIS.PostClientSecretBank, obj, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        if (!!response.data) {
          Toast.show({
            type: 'tomatoToast',
            text1: "Success",
            text2: `${response.data.message}`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
            onHide: () => {
              GetRecieveBankAccounts();
            }
          });

        }
      })
      .catch(err => {
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `PostClientSecretBank ${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
        })
        console.log("Errorr post client secret bank", err)
      })

  },

  BalancePayout: async (apiToken, obj, setLoading, setbalanceCheckModal) => {
    setLoading(true)
    await Axios.post(APIS.BalancePayout, obj, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        if (!!response) {
          setLoading(false)
          Toast.show({
            type: 'tomatoToast',
            text1: "Success",
            text2: `${response.data.message}`,
            autoHide: true,
            position: 'top',
            visibilityTime: 2000,
            onHide: () => {
              setbalanceCheckModal(false);
            }
          });
        }
      })
      .catch(err => {
        setLoading(false)
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            setbalanceCheckModal(false);
          }
        });
        console.log("Errorr Balance Payout", err)
      })

  },
  CheckProfileDetail: async (apiToken, setAccStat, setAccMsg, setCheckDetailsRes) => {
    await Axios.get(`${APIS.CheckProfileDetail}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        setCheckDetailsRes(response.data);

        setAccStat(response.data.account_status)
        setAccMsg(response.data.message)
      })
      .catch(err => {
        console.log('CheckProfileDetail error', err);
      })

  },
  CheckUserVerification: async (apiToken, navigation, GetClientSecretStripe, setSSNVisible) => {
    await Axios.get(`${APIS.CheckProfileDetail}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        console.log('success CheckUserVerification===>', response.data);
        if (response.data.account_status == 'in_complete' || response.data.account_status == 'pending') {
          Alert.alert('Your Profile is pending verification', ' Please complete your profile ',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Profile', {
                  screen: 'EditProfile',
                }),
              },
            ],
            { cancelable: false }
          );
        }
        if (response.data.account_status == "unverified") {
          setSSNVisible(true)
        }
        if (response.data.account_status == "verified") {
          GetClientSecretStripe()
        }
      })
      .catch(err => {
        console.log('GetCHeckuserprofule error', err);
      })

  },

  GetVerificationSession: async (setVSecret, setVid) => {
    await Axios.get(`${APIS.GetVerificationSession}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
    })
      .then(async (response) => {
        setVSecret(response.data.ephemeral_key_secret)
        setVid(response.data.verfication_session_id)
      })
      .catch(err => {
        console.log('GETPROFILEVERIFICATION error', err);
      })

  },
  GetStripStatus: async (apiToken, updateSigninStatus) => {
    await Axios.get(`${APIS.GetStripStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        console.log("Success GetStripStatus==", response);
        if (!!updateSigninStatus) {
          updateSigninStatus(false)
        }
      })
      .catch(err => {
        console.log('GetStripStatus error', err);
        updateSigninStatus(false);
      })

  },
  GetAppVersion: async (data, setForceUpdate) => {
    await Axios.post(APIS.GetAppVersion, data)
      .then(async (response) => {
        setForceUpdate(response.data.data[0].force_update)
        if (Platform.OS == 'ios' && response.data.data[0].force_update === "true") {
          Alert.alert(
            "Update Available!",
            "A new version of getGFTD is available now. Please update to continue using the app.",
            [
              {
                text: "UPDATE", onPress: () => {
                  Linking.openURL('https://apps.apple.com/us/app/getgftd/id1536789198')
                }
              }
            ]
          );
        }
        if (Platform.OS == 'android' && response.data.data[0].force_update === "true") {
          Alert.alert(
            "Update Available",
            "Please update to new version.",
            [
              {
                text: "Update", onPress: () => {
                  Linking.openURL('https://play.google.com/store/apps/details?id=com.gftd')
                }
              }
            ]
          );
        }
      })
      .catch(err => {
        //setloading(false);
        console.log('GetAppVersion== error', err.response);
      })
  },
  ErrorHandler: async (obj) => {
    await Axios.post(APIS.ErrorHandler, obj, {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'text/plain',
        // 'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        console.log("Error handler success==", response.data)
      })
      .catch(err => {
        console.log("Errorr handler error", err.message)
      })

  },
  UpdateSSN: async (apiToken, obj, setSSNLaoding, setSSNVisible, updateSignupStatus) => {
    // console.log("post secret bank i called", obj)
    setSSNLaoding(true)
    await Axios.post(APIS.UpdateSSN, JSON.stringify(obj), {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        setTimeout(async () => {
          await Service.GetStripStatus(apiToken, updateSignupStatus)
        }, 10000);
        Toast.show({
          type: 'tomatoToast',
          text1: "Success",
          text2: `${response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            updateSignupStatus(true);
            setSSNLaoding(false);
            setSSNVisible(false);
          }
        });
        // }
        console.log(" UpdateSSN success==", response.data)
      })
      .catch(err => {
        // setSSNLaoding(false)
        Toast.show({
          type: 'tomatoToast',
          text1: "Attention",
          text2: `${err.response.data.message}`,
          autoHide: true,
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            setSSNLaoding(false)
            setSSNVisible(false)
          }
        });
        console.log("Errorr UpdateSSN", err.message)
      })

  },
  UpdateDoc: async (apiToken, obj, setImageLoading, setisUploadSuccessfull) => {
    setImageLoading(true)
    await Axios.post(APIS.UpdateDoc, JSON.stringify(obj), {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (response) => {
        // if (!!response) {
        setImageLoading(false)
        setisUploadSuccessfull(true);
        console.log("UpdateDoc success==", JSON.stringify(response.data))
      })
      .catch(err => {
        setImageLoading(false)
        setisUploadSuccessfull(false)
        console.log("Error UpdateDoc", err.response)
      })

  },
  GetBanners: async (setBanners) => {
    await Axios.get(`${APIS.GetBanners}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        setBanners(response.data.banners)
        const filterActiveBanner = response.data.banners.filter((banner) => banner.status === 'active').map((item) => ({ uri: item.banner_img }));
        if (filterActiveBanner.length > 0) {
          setBanners(filterActiveBanner)
        }
        else {
          setBanners(Array(3).fill({ uri: "https://getgftd.io/storage/app_banners/defaultbanner.jpg" }))
        }
      })
      .catch(err => {
        console.log('GETPROFILEVERIFICATION error', err);
      })
      .finally(() => {

      })

  },

  CreateDonationProfile: async (data, setLoading, callBack) => {
    setLoading(true);
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.post(APIS.CreateDonationProfile, data,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
          'X-Access-Token': `${apiToken}`,
        }
      }
    ).then((response) => {
      console.log("response===========>", response.data.message);
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => {
          setLoading(false);
          callBack();
        }
      });
    }).catch((err) => {
      console.log(err.response.data.message);
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${err.response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false)
      });
    })
  },

  UpdateDonationProfile: async (data, setLoading, callBack) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    setLoading(true);
    console.log("raw data :", data);
    Axios.post(APIS.UpdateDonationProfile, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${res.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => callBack()
      });

    }).catch((error) => {
      console.log("error", error.response.data.message);
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
      });

    }).finally(() => { setLoading(false); })
  },
  GetDonationProfile: async (setData) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.get(APIS.GetDonationProfile, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      console.log("DONATION GET STATUS: " + res.data.data);
      setData(res.data.data);

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
      });

    })
  },
  CreateDonationWishlist: async (data, navigation, setLoading) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    console.log("apiToken", apiToken);
    setLoading(true);
    Axios.post(APIS.CreateDonationWishlist, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${res.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => navigation.goBack(),
      });

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false),
      });

    })
  },
  GetDonationWishlist: async (setData, setLoading) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.get(APIS.GetDonationWishlist, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      console.log("DONATION WISH GET STATUS: ", res.data.data);
      setData(res.data.data);
      setLoading ? setLoading(false) : null

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false)
      });

    })
  },
  DeleteDonationWishlist: async (id) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.get(APIS.DeleteDonationWishlist + id, {
      headers: {
        'X-Access-Token': `${apiToken}`,
      }
    }).then((response) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,

      });

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,

      });

    });
  },
  UpdateDonationWishlist: async (data, id, navigation, setLoading) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    console.log("apiToken", apiToken);
    setLoading(true);
    Axios.post(APIS.UpdateDonationWishlist + id, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${res.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => navigation.goBack(),
      });

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false),
      });

    })
  },
  AddDonationItems: async (data, navigation, setLoading) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    console.log("apiToken", apiToken);
    setLoading(true);
    Axios.post(APIS.AddDonationItem, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${res.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => navigation.goBack(),
      });

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false),
      });

    })
  },

  GetDonationItems: async (setLoading, setData, id) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.get(APIS.GetDonationItems + id, {
      headers: {
        'X-Access-Token': `${apiToken}`,
      }
    }).then((response) => {
      setData(response.data.data);
      setLoading(false);

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false),
      });

    });
  },


  DeleteDonationItem: async (id) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.get(APIS.DeleteDonationitem + id, {
      headers: {
        'X-Access-Token': `${apiToken}`,
      }
    }).then((response) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${response.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,

      });

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,

      });

    });
  },
  UpdateDonationItem: async (data, id, navigation, setLoading) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    console.log("apiToken", apiToken);
    setLoading(true);
    Axios.post(APIS.UpdateDonationItem + id, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((res) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Success",
        text2: `${res.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => navigation.goBack(),
      });

    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false),
      });

    })
  },

  getDonationTransection: async (setData, setLoading) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    Axios.get(APIS.getDonationTransections, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    }).then((response) => {
      setData(response.data.data)
      setLoading(false);
    }).catch((error) => {
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        onHide: () => setLoading(false),
      });
    })
  },
  getDonationRoles: async (setData) => {
    Axios.get(APIS.getDonationRoles, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
    }).then((response) => {
      console.log("getDonationRoles", response.data.data);
      setData(response.data.data)
      // setLoading(false);
    }).catch((error) => {
      console.log("getDonationRoles", error);
      Toast.show({
        type: 'tomatoToast',
        text1: "Attention",
        text2: `${error.data.message}`,
        autoHide: true,
        position: 'top',
        visibilityTime: 2000,
        // onHide: () => setLoading(false),
      });
    })
  },
  MyShareReferralLink: async (setRefLink) => {
    const apiToken = await AsyncStorage.getItem('@accessToken');
    await Axios.get(APIS.GetMyReferrals, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'X-Access-Token': `${apiToken}`,
      },
    })
      .then(async (res) => {
        setRefLink(res.data.referral_url);
      })
      .catch((err) => {
        console.log('failed get my referrals ===>', err.response);
      })

  },
};

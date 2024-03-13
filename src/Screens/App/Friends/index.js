import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, FlatList, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback, ActivityIndicator, } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import Share from 'react-native-share';
import ImageView from 'react-native-image-view';
import { Icon } from 'react-native-elements';
import analytics from '@react-native-firebase/analytics';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import moment from 'moment';
import filter from 'lodash.filter';
import Modal from "react-native-modal";


// Constants----------------------------------------------------------------
import ProfileBar from '../../../Constants/ProfileBar';
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Icons, Images } from '../../../Assets';
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import LinearGradient from 'react-native-linear-gradient';
import { RefreshControl } from 'react-native';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';
import { Adjust, AdjustEvent } from 'react-native-adjust';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyFriends({ userDetails, setFocuse }) {
    const isFocused = useIsFocused();
    const apiToken = userDetails?.api_token;
    const myFriendlistList = useSelector(state => state.MyFriendlistReducer);
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([]);
    const [myFriends, setMyFriends] = useState([]);
    const [loading, setloading] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [removeId, setRemoveId] = useState('');
    const [userItems, setUserItems] = useState({});
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [fullData, setFullData] = useState([]);
    const [found, setFound] = useState('');

    const fetchMyFriends = async () => {
        await Service.GetFriendlist(userDetails?.api_token, setMyFriends, setFullData, setloading);
    };

    const handleRemove = async (item) => {
        const data = {
            id: item?.id
        };

        await analytics().logEvent('remove_friend', {
            friend_id: item.id,
            friend_name: item.user_info !== null ? item.user_info.name : item.user_info !== null && item.user_info.username,
            friend_mobile: item.user_info.mobile,
            friend_of: userDetails.name,
            message: `${userDetails.name} removed ${item.user_info.name} from friendlist.`
        });

        await Service.RemoveFriend(data, apiToken, setloading, fetchMyFriends, setPressed);
        if (query != '') {
            setQuery('')
        }
        if (pressed == false) SheetManager.hide('view_sheet');
    };

    const handleAddFriendSheet = (item) => {
        setUserItems(item)
        if (!!item) SheetManager.show('view_sheet')
    };

    useEffect(() => {
        fetchMyFriends();
    }, [isFocused]);


    // const listing = filteredData && filteredData.length > 0 ? filteredData : myFriends;

    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();
        const filteredData = filter(fullData, user => {
            return contains(user.user_info, formattedQuery);
        });
        setMyFriends(filteredData);
        setQuery(text);
        setFound(!!filteredData && `Not found ${text}`)
    };

    const contains = (user_info, query) => {
        const { name, username } = user_info;
        if (name.toLowerCase().includes(query) || username.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };

    return (
        <>
            <View style={{ flex: 1, padding: 0, backgroundColor: Colors.White, }}>
                <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
                    <View style={styles.searchBarContainer}>
                        <View style={styles.searchBarItems}>
                            <TextInput onFocus={() => setFocuse(true)} onEndEditing={() => setFocuse(false)} style={styles.searchBar} value={query} placeholder='Search...' onChangeText={text => handleSearch(text)} placeholderTextColor={Colors.Grey} />
                        </View>
                    </View>
                </View >
                {myFriends.length > 0
                    ? <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={() => fetchMyFriends()}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        data={myFriends.sort((a, b) => a.user_info.name.localeCompare(b.user_info.name))}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1, padding: 5, marginHorizontal: 5, backgroundColor: Colors.White, flexDirection: 'row', alignItems: 'center', }}>
                                    <TouchableOpacity style={{ flex: 1, padding: 5, flexDirection: 'row' }} onPress={() => handleAddFriendSheet(item)}>
                                        <View style={{ width: 50, height: 50, borderRadius: 100 / 2, borderWidth: 1, borderColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={item.user_info !== null && item.user_info.image !== '' ? { uri: item?.user_info.image } : Images.userProfile} style={{ width: 45, height: 45, resizeMode: 'cover', borderRadius: 100 / 2 }} />
                                        </View>
                                        <View style={{ flex: 1, marginStart: 10, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                            <Text numberOfLines={1} style={{ color: Colors.Blue, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', }}>{item.user_info !== null ? item.user_info.name : item.user_info !== null ? item.user_info.username : ''}</Text>
                                            <Text style={{ fontSize: hp(1.5), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>{item.user_info != null ? item.user_info.username : ''}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={pressed || loading} onPress={() => { handleRemove(item), setRemoveId(item.id) }} style={{ padding: 5, width: 70, height: hp(4), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: 'lightgrey', }}>
                                        {loading == true && item.id == removeId
                                            ?
                                            <ActivityIndicator size="small" color={Colors.White} />
                                            :
                                            <Text style={{ color: Colors.White, fontSize: hp(1.4), fontFamily: 'Poppins-Regular', }}>{'Remove'}</Text>}
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                        keyExtractor={(key, index) => index}
                    />
                    :
                    <Text style={{ textAlign: 'center', color: Colors.Grey, fontSize: hp(2), fontFamily: 'Poppins-Regular', }}>{found != '' ? found : 'No Friends Yet'}.</Text>
                }
            </View>
            <ActionSheet id="view_sheet">
                <View style={{ height: hp(60), backgroundColor: Colors.White, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <LinearGradient colors={[Colors.LightestBlue, Colors.Blue,]} style={{ flexDirection: 'row', padding: 10, flex: 1, backgroundColor: Colors.LightBlue, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: Colors.Blue, borderRadius: 100 / 2, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }} onPress={() => SheetManager.hide('view_sheet')} >
                            <Icon name="close" size={hp(3.5)} color={Colors.White} />
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={{ flex: 3, backgroundColor: Colors.White, padding: 10 }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: hp(18), alignItems: 'center', top: -55, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>{
                                <Image source={userItems?.user_info !== undefined && userItems?.user_info?.image !== '' ? { uri: userItems?.user_info.image } : Images.userProfile} style={{ width: 95, height: 95, resizeMode: 'cover', borderRadius: 100 / 2, shadowRadius: 10, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowColor: Colors.Grey, elevation: 10, }} />
                            }</TouchableOpacity>
                            <ImageView
                                images={[
                                    {
                                        source: userItems?.user_info !== undefined && userItems?.user_info?.image !== '' ? { uri: userItems?.user_info.image } : Images.userProfile,
                                        title: `${userItems?.user_info?.name}`,
                                        width: 806,
                                        height: 806,
                                    },
                                ]}
                                imageIndex={0}
                                isVisible={isImageViewVisible}
                                onClose={() => setIsImageViewVisible(false)}
                            />
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: hp(5) }}>
                                <Text numberOfLines={1} style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Poppins-Regular', }}>{userItems.user_info !== undefined ? userItems.user_info.name : ''}</Text>
                                <Text numberOfLines={1} style={{ color: Colors.Grey, fontSize: hp(1.5), fontFamily: 'Poppins-Regular', }}>{userItems.user_info !== undefined ? 'getgftd/' + userItems.user_info.username : ''}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: hp(20), top: -20, paddingHorizontal: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: hp(4) }}>
                                    <Text numberOfLines={1} style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold', }}>{userItems.user_info !== undefined ? moment(userItems.user_info.created_at).format('LL') : ''}</Text>
                                    <Text numberOfLines={1} style={{ color: Colors.Grey, fontSize: hp(1.7), fontFamily: 'Poppins-Regular', }}>{'Joined'}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: hp(4) }}>
                                    <Text numberOfLines={1} style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold', }}>{userItems.user_info !== undefined ? moment(userItems.user_info.dob).format('LL') : ''}</Text>
                                    <Text numberOfLines={1} style={{ color: Colors.Grey, fontSize: hp(1.7), fontFamily: 'Poppins-Regular', }}>{'Birthdate'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: hp(20), top: -60, paddingHorizontal: 15 }}>
                            <TouchableOpacity
                                disabled={pressed || loading}
                                onPress={() => { handleRemove(userItems), setRemoveId(userItems.id) }}
                                style={{ padding: 5, width: wp(50), height: hp(5.5), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: 'lightgrey', shadowColor: Colors.Grey, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 }}
                            >
                                {loading == true && userItems.id == removeId
                                    ?
                                    <ActivityIndicator size="small" color={Colors.White} />
                                    :
                                    <Text style={{ color: Colors.White, fontSize: hp(2), fontFamily: 'Poppins-Regular', }}>{'Remove'}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ActionSheet>
        </>
    );
};

function AddFriends({ userDetails, navigation, setFocuse }) {
    const isFocused = useIsFocused();
    const userList = useSelector(state => state.UserlistReducer);
    const apiToken = userDetails?.api_token;
    const [loading, setloading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [allGftdUsers, setAllGftdUsers] = useState([]);
    const [ffVisible, setFFVisible] = useState(false);
    const [myFFullData, setMYFFullData] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [myFriends, setMyFriends] = useState([]);
    const [pressed, setPressed] = useState(false);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [fullData, setFullData] = useState([]);
    const [found, setFound] = useState('');

    const GetAllGftdUsers = async function () {
        await Service.GetAllGftdUsers(apiToken, setAllGftdUsers, setFullData, setloading)
    };
    const GetBankAccounts = async () => {
        if (!!apiToken) await Service.ShowbankDetails(apiToken, setBankAccounts, setloading);
    };
    const fetchMyFriends = async () => {
        await Service.GetFriendlist(userDetails?.api_token, setMyFriends, setMYFFullData, setloading);
    };
    const adjustEvent = new AdjustEvent('o2p1dy')

    const handleAdd = async (item) => {
        const data = {
            FriendID: item?.contact_id
        };

        await analytics().logEvent('add_friend', {
            friend_id: item?.contact_id,
            friend_name: item.contact_name,
            friend_mobile: item.contact_number,
            friend_of: userDetails.name,
            message: `${item.contact_name} added ${userDetails.name} to friendlist.`
        });
        Adjust.trackEvent(adjustEvent);

        await Service.AddFriend(data, apiToken, setBtnLoading, GetAllGftdUsers, fetchMyFriends, setPressed,);
        if (myFriends.length > 0) {
            setFFVisible(false);
        }
        else {
            setFFVisible(true);
        }

        if (pressed == false) SheetManager.hide('add_sheet');
        if (query != '') {
            setQuery('')
        };
    };

    // console.warn(bankAccounts)

    const handleAddFriendSheet = (item) => {
        setUserItems(item)
        if (!!item) SheetManager.show('add_sheet')
    }
    const [addId, setAddId] = useState('');
    const [userItems, setUserItems] = useState({});

    useEffect(() => {
        GetAllGftdUsers();
        GetBankAccounts();
        fetchMyFriends();
    }, [isFocused,]);


    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();
        const filteredData = filter(fullData, user => {
            return contains(user, formattedQuery);
        });
        setAllGftdUsers(filteredData);
        setQuery(text);
        setFound(!!filteredData && `Not found ${text}`)
    };

    const contains = (user, query) => {
        const { contact_name } = user;
        if (contact_name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };

    const handleTap = () => {
        AsyncStorage.setItem('@first_time_user', 'filled');
        AsyncStorage.setItem('@new_user_loading', 'filled');
        setFFVisible(false);
        navigation.navigate('MyAccounts')
    }

    return (
        <>
            <View style={{ flex: 1, padding: 0, backgroundColor: Colors.White, }}>
                <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
                    <View style={styles.searchBarContainer}>
                        <View style={styles.searchBarItems}>
                            <TextInput onFocus={() => setFocuse(true)} onEndEditing={() => setFocuse(false)} style={styles.searchBar} value={query} placeholder='Search...' onChangeText={text => handleSearch(text)} placeholderTextColor={Colors.Grey} />
                        </View>
                    </View>
                </View >
                {
                    allGftdUsers.length > 0
                        ?
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={() => GetAllGftdUsers()}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            data={allGftdUsers.sort((a, b) => a.contact_name.localeCompare(b.contact_name))}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1, padding: 5, marginHorizontal: 5, backgroundColor: Colors.White, flexDirection: 'row', alignItems: 'center', }}>
                                        <TouchableOpacity style={{ flex: 1, padding: 5, flexDirection: 'row' }} onPress={() => handleAddFriendSheet(item)} >
                                            <View style={{ width: 50, height: 50, borderRadius: 100 / 2, borderWidth: 1, borderColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image source={item?.contact_imagebase64 != '' ? { uri: `${item.contact_imagebase64}` } : Images.userProfile} style={{ width: 45, height: 45, resizeMode: 'cover', borderRadius: 100 / 2 }} />
                                            </View>
                                            <View style={{ flex: 1, marginStart: 5, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                <Text numberOfLines={1} style={{ color: Colors.Blue, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', }}>{item.contact_name != ('' || null) ? item.contact_name : ''}</Text>
                                                <Text style={{ fontSize: hp(1.5), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>{item.contact_email != ('' || null) ? item.contact_email : ''}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { handleAdd(item), setPressed(true), setAddId(item.contact_id) }} disabled={pressed || loading} style={{ padding: 5, width: 70, height: hp(4), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: Colors.LightestBlue, }}>
                                            {btnLoading == true && item.contact_id == addId
                                                ?
                                                <ActivityIndicator size="small" color={Colors.White} />
                                                :
                                                <Text style={{ color: Colors.White, fontSize: hp(1.5), fontFamily: 'Poppins-Regular', }}>{'Add'}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                            keyExtractor={(key, index) => index.toString()}
                        />
                        :
                        <Text style={{ textAlign: 'center', color: Colors.Grey, fontSize: hp(2), fontFamily: 'Poppins-Regular', }}>{found != '' ? found : 'No Users Yet.'}</Text>
                }
            </View>
            <Modal
                animationIn={'zoomIn'}
                animationOut={"zoomOut"}
                backdropColor='rgba(0,0,0,0.3)'
                isVisible={ffVisible}
                onRequestClose={() => {
                    setVerifiedVisible(!setFFVisible);
                }}>
                <View style={{
                    top: -40,
                    justifyContent: 'space-between',
                    padding: wp(5),
                    borderRadius: 20,
                    width: wp('85%'),
                    height: hp(50),
                    alignSelf: 'center',
                    backgroundColor: Colors.White,
                    elevation: 10,
                    shadowOffset: { width: 0, height: 8 },
                    shadowColor: Colors.Grey,
                    shadowRadius: 10,
                    shadowOpacity: 0.3,
                }}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                        <Image source={Images.verified} style={{ height: 150, width: 150, resizeMode: "stretch", borderRadius: 8, }} />
                        {bankAccounts.length > 0 ?
                            <>
                                <View>
                                    <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-SemiBold', fontSize: hp(3.5), textAlign: "center", }}>
                                        Hooray!
                                    </Text>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2.5), textAlign: "center", }}>
                                        YOU JUST ADDED YOUR 1st FRIEND
                                    </Text>
                                </View>
                                <View style={{ flex: .8, justifyContent: "space-evenly", }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setFFVisible(false);
                                        }}
                                        style={{ backgroundColor: Colors.LightestBlue, width: wp(70), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.White }}>Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <>
                                <View>
                                    <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-SemiBold', fontSize: hp(3.5), textAlign: "center", }}>
                                        Hooray!
                                    </Text>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2.5), textAlign: "center", }}>
                                        YOU JUST ADDED YOUR 1st FRIEND
                                    </Text>
                                </View>
                                <View style={{ flex: .8, justifyContent: "space-evenly", }}>
                                    <TouchableOpacity
                                        onPress={handleTap}
                                        style={{ backgroundColor: Colors.LightestBlue, width: wp(70), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.White }}>Connect A Bank Account</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                    </View>
                </View>
            </Modal>
            <ActionSheet id="add_sheet">
                <View style={{ height: hp(60), backgroundColor: Colors.White, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <LinearGradient colors={[Colors.LightestBlue, Colors.Blue,]} style={{ flexDirection: 'row', padding: 10, flex: 1, backgroundColor: Colors.LightBlue, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: Colors.Blue, borderRadius: 100 / 2, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }} onPress={() => SheetManager.hide('add_sheet')} >
                            <Icon name="close" size={hp(3.5)} color={Colors.White} />
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={{ flex: 3, backgroundColor: Colors.White, padding: 10 }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: hp(18), alignItems: 'center', top: -55, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>

                                <Image source={userItems?.contact_imagebase64 != '' ? { uri: `${userItems.contact_imagebase64}` } : Images.userProfile} style={{ width: 95, height: 95, resizeMode: 'cover', borderRadius: 100 / 2, shadowRadius: 10, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowColor: Colors.Grey, elevation: 10, }} />
                            </TouchableOpacity>
                            <ImageView
                                images={[
                                    {
                                        source: userItems?.contact_imagebase64 != '' ? { uri: `${userItems.contact_imagebase64}` } : Images.userProfile,
                                        title: `${userItems?.contact_name}`,
                                        width: 806,
                                        height: 806,
                                    },
                                ]}
                                imageIndex={0}
                                isVisible={isImageViewVisible}
                                onClose={() => setIsImageViewVisible(false)}
                            // renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
                            />
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: hp(5) }}>
                                <Text numberOfLines={1} style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Poppins-Regular', }}>{userItems !== undefined ? userItems?.contact_name : ''}</Text>
                                <Text numberOfLines={1} style={{ color: Colors.Grey, fontSize: hp(1.5), fontFamily: 'Poppins-Regular', }}>{userItems !== undefined ? userItems.contact_email : ''}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: hp(20), top: -20, paddingHorizontal: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: hp(4) }}>
                                    <Text numberOfLines={1} style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold', }}>{userItems !== undefined ? moment(userItems?.created_at).format('LL') : ''}</Text>
                                    <Text numberOfLines={1} style={{ color: Colors.Grey, fontSize: hp(1.7), fontFamily: 'Poppins-Regular', }}>{'Joined'}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: hp(4) }}>
                                    <Text numberOfLines={1} style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold', }}>{userItems !== undefined ? moment(userItems.contact_dob).format('LL') : ''}</Text>
                                    <Text numberOfLines={1} style={{ color: Colors.Grey, fontSize: hp(1.7), fontFamily: 'Poppins-Regular', }}>{'Birthdate'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: hp(20), top: -60, paddingHorizontal: 15 }}>
                            <TouchableOpacity
                                disabled={pressed || loading}
                                onPress={() => { handleAdd(userItems), setAddId(userItems.contact_id) }}
                                style={{ padding: 5, width: wp(50), height: hp(5.5), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: Colors.LightestBlue, shadowColor: Colors.Grey, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 }}
                            >
                                {loading == true && userItems.contact_id == addId
                                    ?
                                    <ActivityIndicator size="small" color={Colors.White} />
                                    :
                                    <Text style={{ color: Colors.White, fontSize: hp(2), fontFamily: 'Lato-Regular', }}>{'Add Friend'}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ActionSheet>
        </>
    );
};
const onShare = async (userDetails) => {
    const sharedOption = {
        title: 'Share with your friends',
        message: `I just joined GFTD! 🎁 Download so we can get GFTing - anytime, anywhere 🎁  \n\nUser my Referral while signing up: ${userDetails.referral_code}  \n\nDownload Now:`,
        url: Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.gftd' : 'https://apps.apple.com/us/app/getgftd/id1536789198'
    };
    try {
        const result = await Share.open(sharedOption);
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                return;
            } else {
                return;
            }
        } else if (result.action === Share.dismissedAction) {
            return;
        }
    } catch (error) {
        console.log('onShare error', error);
    }
};

function MyContacts({ userDetails, contacts, setFocuse }) {
    const isFocused = useIsFocused();
    const [filteredData, setFilteredData] = useState([]);
    const [query, setQuery] = useState('');
    const [fullData, setFullData] = useState([]);
    const [found, setFound] = useState('');
    useEffect(() => {
        setFilteredData(contacts)
        setFullData(contacts)
    }, [isFocused]);

    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();
        const filteredData = filter(contacts, user => {
            return contains(user, formattedQuery);
        });
        setFilteredData(filteredData);
        setQuery(text);
        setFound(!!filteredData && `Not found ${text}`)
    };

    const contains = (user, query) => {
        const { givenName, username, familyName } = user;
        if (givenName.toLowerCase().includes(query) || familyName.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: Colors.White, }}>
            <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
                <View style={styles.searchBarContainer}>
                    <View style={styles.searchBarItems}>
                        <TextInput onFocus={() => setFocuse(true)} onEndEditing={() => setFocuse(false)} style={styles.searchBar} value={query} placeholder='Search...' onChangeText={text => handleSearch(text)} placeholderTextColor={Colors.Grey} />
                    </View>
                </View>
            </View>
            {filteredData.length > 0 ? <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData.sort((a, b) => a.givenName.localeCompare(b.givenName))}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ flex: 1, padding: 5, backgroundColor: Colors.White, flexDirection: 'row', alignItems: 'center', }}>
                            <View style={{ flex: 1, padding: 5, flexDirection: 'row' }}>
                                <View style={{ width: 50, height: 50, borderRadius: 100 / 2, borderWidth: 1, borderColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={item && item?.image != null ? { uri: item?.image } : Images.userProfile} style={{ width: 45, height: 45, resizeMode: 'cover', borderRadius: 100 / 2 }} />
                                </View>
                                <View style={{ flex: 1, marginStart: 5, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <Text numberOfLines={1} style={{ color: Colors.Blue, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', }}>{item.givenName !== '' && item.familyName !== '' ? item.givenName + ' ' + item.familyName : item.username !== '' && item.familyName}</Text>
                                    <Text style={{ color: Colors.Grey, fontSize: hp(1.5), fontFamily: 'Poppins-Regular', }}>{item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number.split(' ').join('') : ''}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                onShare(userDetails)
                            }} style={{ padding: 5, width: 70, height: hp(4), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: Colors.ParrotGreen }}>
                                <Text style={{ color: Colors.White, fontSize: hp(1.5), fontFamily: 'Poppins-Regular', }}>Invite</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                keyExtractor={(key, index) => index}
            />
                : <Text style={{ textAlign: 'center', color: Colors.Grey, fontSize: hp(2), fontFamily: 'Poppins-Regular', }}>{found != - '' ? found : 'No Contacts Yet.'}</Text>
            }
        </View >
    );
};

const Tab = createMaterialTopTabNavigator();
function MyTabs({ navigation, userDetails, contacts, setFocuse, routeTo }) {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: hp(1.3), fontFamily: 'Poppins-SemiBold' },
            tabBarStyle: { backgroundColor: Colors.White, borderColor: Colors.Red, height: 45, },
            tabBarIndicatorStyle: { backgroundColor: Colors.LightestBlue },
            tabBarActiveTintColor: Colors.Blue,
            tabBarInactiveTintColor: Colors.Grey
        }}
            initialRouteName={routeTo !== '' ? 'ADD FRIENDS' : 'MY FRIENDS'}>
            <Tab.Screen name="MY FRIENDS"  >
                {props => <MyFriends {...props} userDetails={userDetails} setFocuse={setFocuse} />}
            </Tab.Screen>
            <Tab.Screen name="ADD FRIENDS" >
                {props => <AddFriends {...props} navigation={navigation} userDetails={userDetails} setFocuse={setFocuse} />}
            </Tab.Screen>
            <Tab.Screen name="MY CONTACTS" >
                {props => <MyContacts {...props} userDetails={userDetails} contacts={contacts} setFocuse={setFocuse} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default function Friends({ navigation, route }) {
    const isFocused = useIsFocused();
    // const apiToken = userDetails.apiToken;
    const [contacts, setContacts] = useState([]);
    const [focuse, setFocuse] = useState(false);
    const { trackData } = useContext(AuthContext);
    const userDetails = useSelector(state => state.UserReducer);
    console.log("userDetails ==============>",userDetails);
    const apiToken = userDetails.api_token;

    useEffect(() => {
        getContact();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Friends');

    }, [isFocused]);

    const getContact = async () => {
        try {
            if (Platform.OS == 'android') {
                const permissions = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
                );
                if (permissions === 'granted') {
                    const contacts = await Contacts.getAll();
                    setContacts(contacts);
                }
            }
            else {
                const contacts = await Contacts.getAll();
                setContacts(contacts);
            };
        }
        catch (err) {
            console.error(err)
        };
    };


    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                {/* <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="FRIENDS" /> */}
                {focuse != true
                    ?
                    <ProfileBar
                        name={userDetails ? userDetails?.name : ''}
                        username={userDetails ? userDetails?.username : ''}
                        profileImage={userDetails?.image}
                        Image={Images.userProfile} gfts={userDetails != null ? userDetails?.gift_count : 0}
                        handleViewFriends={() => navigation.goBack()}
                        friends={userDetails != null ? userDetails?.friend_count : 0}
                        navigation={navigation}
                    />
                    : null}
                <MyTabs navigation={navigation} setFocuse={setFocuse} userDetails={userDetails} contacts={contacts} routeTo={!!route.params?.route_to ? route.params?.route_to : ''} />
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    searchBarContainer: {
        width: wp("100%"),
        height: hp(8),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchBarItems: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    searchBar: {
        width: oreintation == "LANDSCAPE" ? wp('95%') : wp('90%'),
        height: 45,
        paddingHorizontal: 15,
        fontFamily: 'Poppins-Regular',
        color: Colors.Grey,
    },
    searchFilterContainer: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    productContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.White,
    },
})
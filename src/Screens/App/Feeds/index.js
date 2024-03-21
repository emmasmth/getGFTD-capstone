import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, FlatList, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import moment from "moment";

// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Icons, Images } from '../../../Assets';
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';

// Stats----------------------------------------------------------------
import { addfeedlistdata } from '../../../Redux/FeedsReducer';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';


function You({ navigation, loading, RemoveFeed }) {
    const myFeeds = useSelector(state => state.FeedlistReducer);
    return (
        <View style={{ flex: 1, backgroundColor: '#f7f8f9', padding: 10, }}>
            {!loading ? myFeeds.length > 0 ?
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={myFeeds}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flex: 1, backgroundColor: Colors.White, margin: 5, borderRadius: 12, borderWidth: 1, borderColor: Colors.LightGrey }}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 1, flexDirection: 'row', padding: 5, margin: 5, backgroundColor: Colors.White, justifyContent: "space-between", }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('ViewFeeds', { item: item })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ width: 48, height: 48, borderRadius: 100 / 2, borderWidth: 1, borderColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image source={item?.image != null ? { uri: item.image } : Images.profile} style={{ width: 45, height: 45, resizeMode: "cover", borderRadius: 100 / 2, }} />
                                            </View>
                                            <View style={{ alignItems: "flex-start", marginStart: 10, }}>
                                                <Text multiLine={true} numberOfLines={4} style={{ flex: 1, color: Colors.LightBlue, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold' }}>{item.sender_name != "" ? item.sender_name : item.sender_name}</Text>
                                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                                    <Icon name={item.privacy == 2 ? "lock-closed" : "earth"} type="ionicon" size={hp(1.5)} color={Colors.ThemeColor} />
                                                    <Text style={{ flex: 1, color: Colors.ThemeColor, fontSize: hp(1.4), fontFamily: 'Poppins-Regular' }}>{item.privacy == 2 ? "Private" : "Public"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                                <Icon name="notifications" type="ionicon" size={20} color={Colors.Blue} onPress={() => navigation.navigate('Notifications')} />
                                                <Icon name="delete" color={Colors.Blue} size={20} onPress={() => RemoveFeed(item.id, item.feed_flag)} />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <Text multiLine={true} numberOfLines={4} style={{ flex: 1, padding: 10, color: Colors.LightBlue, fontSize: hp(1.6), fontFamily: 'Poppins-Regular' }}>{item.product_name != "" ? item.product_name : item.title}</Text>
                                    <View style={{ alignItems: "center", backgroundColor: "#46464b" }}>
                                        <Image source={item?.image != null ? { uri: item.image } : Images.profile} style={{ width: 300, height: 250, resizeMode: "contain", }} />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-around', marginVertical: 10, marginEnd: 10, }}>
                                        <Text style={{ fontSize: hp(1.4), color: Colors.Blue, fontFamily: 'Poppins-Regular' }}>{moment(item?.created_at.split(' ')[0]).format('ll')}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    keyExtractor={(key, index) => index}
                />
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ fontSize: hp(2), fontFamily: 'Poppins-Regular', color: Colors.Grey }}>No Feeds Yet</Text>
                </View>
                : <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color={Colors.LightestBlue} />
                </View>
            }
        </View >
    );
};

function Public({ navigation, loading, RemoveFeed }) {
    const myPublic = useSelector(state => state.FeedlistReducer);
    const filteredList = myPublic.filter(list => list.privacy == 1);
    return (
        <View style={{ flex: 1, backgroundColor: '#f7f8f9', padding: 10, }}>
            {!loading ? filteredList.length > 0 ?
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredList}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flex: 1, backgroundColor: Colors.White, margin: 5, borderRadius: 12, borderWidth: 1, borderColor: Colors.LightGrey }}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 1, flexDirection: 'row', padding: 5, margin: 5, backgroundColor: Colors.White, justifyContent: "space-between", }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('ViewFeeds', { item: item })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ width: 48, height: 48, borderRadius: 100 / 2, borderWidth: 1, borderColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image source={item?.image != null ? { uri: item.image } : Images.profile} style={{ width: 45, height: 45, resizeMode: "cover", borderRadius: 100 / 2, }} />
                                            </View>
                                            <View style={{ alignItems: "flex-start", marginStart: 10, }}>
                                                <Text multiLine={true} numberOfLines={4} style={{ flex: 1, color: Colors.LightBlue, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold' }}>{item.sender_name != "" ? item.sender_name : item.sender_name}</Text>
                                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                                    <Icon name={item.privacy == 2 ? "lock-closed" : "earth"} type="ionicon" size={hp(1.5)} color={Colors.ThemeColor} />
                                                    <Text style={{ flex: 1, color: Colors.ThemeColor, fontSize: hp(1.4), fontFamily: 'Poppins-Regular' }}>{item.privacy == 2 ? "Private" : "Public"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                                <Icon name="notifications" type="ionicon" size={20} color={Colors.Blue} onPress={() => navigation.navigate('Notifications')} />
                                                <Icon name="delete" color={Colors.Blue} size={20} onPress={() => RemoveFeed(item.id, item.feed_flag)} />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <Text multiLine={true} numberOfLines={4} style={{ flex: 1, padding: 10, color: Colors.LightBlue, fontSize: hp(1.6), fontFamily: 'Poppins-Regular' }}>{item.product_name != "" ? item.product_name : item.title}</Text>
                                    <View style={{ alignItems: "center", backgroundColor: "#46464b" }}>
                                        <Image source={item?.image != null ? { uri: item.image } : Images.profile} style={{ width: 300, height: 250, resizeMode: "contain", }} />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-around', marginVertical: 10, marginEnd: 10, }}>
                                        <Text style={{ fontSize: hp(1.4), color: Colors.Blue, fontFamily: 'Poppins-Regular' }}>{moment(item?.created_at.split(' ')[0]).format('ll')}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    keyExtractor={(key, index) => index}
                /> :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ fontSize: hp(2), fontFamily: 'Poppins-Regular', color: Colors.Grey }}>No Public Feeds Yet</Text>
                </View>
                : <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color={Colors.LightestBlue} />
                </View>
            }
        </View >
    );
};

function Private({ navigation, loading, RemoveFeed }) {
    const myPrivate = useSelector(state => state.FeedlistReducer);
    const filteredList = myPrivate.filter(list => list.privacy == 2);
    return (
        <View style={{ flex: 1, backgroundColor: '#f7f8f9', padding: 10, }}>

            {!loading ? filteredList.length > 0 ?
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredList}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flex: 1, backgroundColor: Colors.White, margin: 5, borderRadius: 12, borderWidth: 1, borderColor: Colors.LightGrey }}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 1, flexDirection: 'row', padding: 5, margin: 5, backgroundColor: Colors.White, justifyContent: "space-between", }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('ViewFeeds', { item: item })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ width: 48, height: 48, borderRadius: 100 / 2, borderWidth: 1, borderColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image source={item?.image != null ? { uri: item.image } : Images.profile} style={{ width: 45, height: 45, resizeMode: "cover", borderRadius: 100 / 2, }} />
                                            </View>
                                            <View style={{ alignItems: "flex-start", marginStart: 10, }}>
                                                <Text multiLine={true} numberOfLines={4} style={{ flex: 1, color: Colors.LightBlue, fontSize: hp(1.8), fontFamily: 'Poppins-SemiBold' }}>{item.sender_name != "" ? item.sender_name : item.sender_name}</Text>
                                                <View style={{ alignItems: "center", flexDirection: "row" }}>
                                                    <Icon name={item.privacy == 2 ? "lock-closed" : "earth"} type="ionicon" size={hp(1.5)} color={Colors.ThemeColor} />
                                                    <Text style={{ flex: 1, color: Colors.ThemeColor, fontSize: hp(1.4), fontFamily: 'Poppins-Regular' }}>{item.privacy == 2 ? "Private" : "Public"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                                <Icon name="notifications" type="ionicon" size={20} color={Colors.Blue} onPress={() => navigation.navigate('Notifications')} />
                                                <Icon name="delete" color={Colors.Blue} size={20} onPress={() => RemoveFeed(item.id, item.feed_flag)} />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <Text multiLine={true} numberOfLines={4} style={{ flex: 1, padding: 10, color: Colors.LightBlue, fontSize: hp(1.6), fontFamily: 'Poppins-Regular' }}>{item.product_name != "" ? item.product_name : item.title}</Text>
                                    <View style={{ alignItems: "center", backgroundColor: "#46464b" }}>
                                        <Image source={item?.image != null ? { uri: item.image } : Images.profile} style={{ width: 300, height: 250, resizeMode: "contain", }} />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-around', marginVertical: 10, marginEnd: 10, }}>
                                        <Text style={{ fontSize: hp(1.4), color: Colors.Blue, fontFamily: 'Poppins-Regular' }}>{moment(item?.created_at.split(' ')[0]).format('ll')}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    keyExtractor={(key, index) => index}
                />
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ fontSize: hp(2), fontFamily: 'Poppins-Regular', color: Colors.Grey }}>No Private Feeds Yet</Text>
                </View>
                : <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color={Colors.LightestBlue} />
                </View>
            }
        </View >
    );
};

const Tab = createMaterialTopTabNavigator();
function MyTabs({ loading, RemoveFeed }) {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: hp(1.5), fontFamily: 'Poppins-SemiBold' },
            tabBarStyle: { backgroundColor: Colors.White, height: 50, },
            // tabBarIndicatorStyle: { backgroundColor: Colors.LightBlue },
            tabBarActiveTintColor: Colors.LightBlue,
            tabBarInactiveTintColor: Colors.LightestBlue
        }}>
            <Tab.Screen name="You" >
                {props => <You {...props} loading={loading} RemoveFeed={RemoveFeed} />}
            </Tab.Screen>
            <Tab.Screen name="Public" >
                {props => <Public {...props} loading={loading} RemoveFeed={RemoveFeed} />}
            </Tab.Screen>
            <Tab.Screen name="Private" >
                {props => <Private {...props} loading={loading} RemoveFeed={RemoveFeed} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};
export default function Feeds(props) {
    const isFocus = useIsFocused();
    const dispatch = useDispatch();
    const addFeedFData = (data) => dispatch(addfeedlistdata(data));
    const userDetails = useSelector(state => state.UserReducer);
    const [loading, setloading] = useState(false);
    const [data, setData] = useState([]);
    const apiToken = userDetails?.api_token;
    const { trackData } = useContext(AuthContext);

    const fetchData = async () => {
        await Service.GetFeeds(setData, addFeedFData, apiToken, setloading);
    };

    const RemoveFeed = async (id, flag) => {
        const data = {
            id: id,
            feed_flag: flag
        }
        const jsondata = JSON.stringify(data)
        await Service.RemoveFeed(jsondata, apiToken, fetchData);
    }

    useEffect(() => {
        fetchData();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Feeds');
    }, [isFocus]);

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => props.navigation.openDrawer()} leftIcon={Icons.humburger} text="FEED" />
                <MyTabs loading={loading} RemoveFeed={RemoveFeed} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
});
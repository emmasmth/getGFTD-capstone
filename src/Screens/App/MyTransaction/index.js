import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, FlatList, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import analytics from '@react-native-firebase/analytics';
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
import { scale } from 'react-native-size-matters';


function SentGift({ loading, sentGifts }) {
    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: Colors.White }}>
            {!loading ?
                sentGifts.length > 0
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={sentGifts}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: Colors.LightGrey, marginVertical: 10, padding: 10, }}>
                                    <View style={{ flex: oreintation == "LANDSCAPE" ? .5 : .8, alignItems: 'flex-start', justifyContent: 'center', }}>
                                        {item.product_image != null
                                            ?
                                            <View style={{ width: scale(60), height: scale(60), borderRadius: scale(100 / 2), backgroundColor: Colors.LightGrey, overflow: 'hidden' }}>
                                                <Image source={{ uri: item.product_image }} style={{ resizeMode: 'contain', width: scale(58), height: scale(58), borderRadius: 100 / 2, }} />
                                            </View>
                                            :
                                            <View style={{ width: scale(60), height: scale(60), borderRadius: 100 / 2, backgroundColor: Colors.LightGrey, }}>
                                                <Image source={Images.berry} style={{ width: scale(40), height: scale(40), resizeMode: 'contain' }} />
                                            </View>
                                        }
                                    </View>
                                    <View style={{ flex: oreintation == "LANDSCAPE" ? 5 : 2, alignItems: 'flex-start', justifyContent: 'center', }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: hp(2), color: Colors.Charcol, fontFamily: 'Poppins-SemiBold' }}>{item.product_name ? item.product_name : '--'}</Text>
                                        </View>
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text numberOfLines={1} style={{ fontSize: hp(1.5), color: Colors.DelightBlue, fontFamily: 'Poppins-Regular' }}>{`To ${item.other_user_name ? `${item.other_user_name}` : '--'}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: hp(1.3), color: item.status == 'SENT' ? Colors.Green : item.status == 'REFUNDED' ? Colors.Blue : item.status == 'PENDING' ? Colors.GoldenL : 'red', fontFamily: 'Poppins-SemiBold' }}>{`${item.status}`}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: "space-around", }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Text style={{ fontSize: hp(2.1), color: Colors.Green, fontFamily: 'Poppins-SemiBold' }}>{`$ ${item.price ? item.price : '0'}`}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: hp(1.4), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>{item.date ? item.date : '--'}</Text>
                                        </View>
                                    </View>

                                </View>
                            );
                        }}
                        keyExtractor={(key, index) => index}
                    /> :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: hp(2), color: Colors.DelightBlue, fontFamily: "Poppins-Regular" }}>No GFTs Sent Yet.</Text>
                    </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.LightestBlue} />
                </View>
            }
        </View >
    );
};

function ReceivedGift({ loading, receivedGifts }) {
    console.log('receivedGifts===>', receivedGifts);
    useEffect(() => {
        const Sent = receivedGifts.filter((item, index) => item.status == 'SENT');
        if (Sent.length > 0) {
            Sent.map((item, index) => {
                analytics().logEvent('received_gfts', {
                    gft_id: item.id,
                    gft_name: item.product_name,
                    gft_price: item.price,
                    received_at: item.date,
                });
            });
        }
    }, []);

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: Colors.White }}>
            {!loading ?
                receivedGifts.filter((item, index) => item.status == 'SENT').length > 0
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={receivedGifts.filter((item, index) => item.status == 'SENT')}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: Colors.LightGrey, marginVertical: scale(10), padding: scale(10), }}>
                                    <View style={{ flex: oreintation == "LANDSCAPE" ? .5 : .8, alignItems: 'flex-start', justifyContent: 'center', }}>
                                        {item.product_image != null
                                            ?
                                            <View style={{ width: scale(60), height: scale(60), borderRadius: scale(100 / 2), backgroundColor: Colors.LightGrey, }}>
                                                <Image source={{ uri: item.product_image }} style={{ resizeMode: 'contain', width:scale(58), height: scale(58), borderRadius: scale(100 / 2), }} />
                                            </View>
                                            :
                                            <View style={{ width: scale(60), height: scale(60), borderRadius: scale(100 / 2), backgroundColor: Colors.LightGrey, }}>
                                                <Image source={Images.berry} style={{ width: scale(40), height: scale(40), resizeMode: 'contain' }} />
                                            </View>
                                        }
                                    </View>
                                    <View style={{ flex: oreintation == "LANDSCAPE" ? 5 : 2, alignItems: 'flex-start', justifyContent: 'center', }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: hp(2), color: Colors.Charcol, fontFamily: 'Poppins-SemiBold' }}>{item.product_name ? item.product_name : '--'}</Text>
                                        </View>
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: hp(1.5), color: Colors.LightBlue, fontFamily: 'Poppins-Regular' }}>{`From ${item.other_user_name ? item.other_user_name : '--'}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: hp(1.3), color: item.status == 'SENT' ? Colors.Green : 'red', fontFamily: 'Poppins-SemiBold' }}>{item.status == 'SENT' ? 'RECEIVED' : `${item.status}`}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: "space-around", }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                            <Text style={{ fontSize: hp(2.1), color: Colors.Green, fontFamily: 'Poppins-SemiBold' }}>{`$ ${item.price ? item.price : '0'}`}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: hp(1.4), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>{item.date ? item.date : '--'}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={(key, index) => index}
                    />
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: hp(2), color: Colors.DelightBlue, fontFamily: "Poppins-Medium" }}>No GFTs Received Yet.</Text>
                    </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.LightestBlue} />
                </View>
            }
        </View >
    );
};

const Tab = createMaterialTopTabNavigator();
function MyTabs({ loading, sentGifts, receivedGifts }) {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: hp(1.5), fontFamily: 'Poppins-SemiBold' },
            tabBarStyle: { backgroundColor: Colors.White, borderColor: Colors.Red, height: 50, },
            tabBarIndicatorStyle: { backgroundColor: Colors.LightestBlue },
            tabBarActiveTintColor: Colors.Blue,
            tabBarInactiveTintColor: Colors.Grey
        }}>
            <Tab.Screen name="Sent GFTs">
                {props => <SentGift {...props} loading={loading} sentGifts={sentGifts} />}
            </Tab.Screen>
            <Tab.Screen name="Received GFTs">
                {props => <ReceivedGift {...props} loading={loading} receivedGifts={receivedGifts} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default function MyTransactions(props) {
    const isFocus = useIsFocused();
    const userDetails = useSelector(state => state.UserReducer);

    const { trackData } = useContext(AuthContext);
    const apiToken = userDetails.api_token;

    const [loading, setloading] = useState([]);

    const [sentGifts, setSentGifts] = useState([]);
    const [receivedGifts, setReceivedGifts] = useState([]);

    const GetTransactions = async () => {
        await Service.SentGift(userDetails.id, userDetails.api_token, setSentGifts, setReceivedGifts, setloading);
    }

    useEffect(() => {
        GetTransactions()
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'My Transactions');

    }, [isFocus])

    const handleLeft = () => {
        props.navigation.goBack()
    };

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={handleLeft} leftIcon={Icons.backarrow} text="getGFTD TRANSACTIONS" />
                <MyTabs loading={loading} sentGifts={sentGifts} receivedGifts={receivedGifts} />
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
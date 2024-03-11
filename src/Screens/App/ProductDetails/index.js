import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, Platform, ScrollView, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'react-native-elements';
import Stars from 'react-native-stars';
import Hyperlink from 'react-native-hyperlink'
// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services'
import { Icons } from '../../../Assets';
import { Colors } from '../../../Utils';

// Stats----------------------------------------------------------------
import LoadingModal from '../../../Constants/Modals/LoadingModal';
import AppButton from '../../../Constants/Button';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../Context';
import moment from 'moment';
import { SvgUri } from 'react-native-svg';

export default function ProductDetails({ navigation, route }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [loading, setloading,] = useState(false);
    const [detail, setDetail,] = useState(false);
    const [review, setReview,] = useState(false);
    const [message, setMessage,] = useState("");
    const { trackData } = useContext(AuthContext);

    const handleFavourite = async (id) => {
        const data = {
            product_id: await id,
        };
        const apiToken = await userDetails?.api_token;
        const parmas = JSON.stringify(data);
        await Service.AddToWishlist(parmas, apiToken, setloading, setMessage, fetchList);
        setTimeout(() => {
            navigation.navigate('Trending');
        }, 1000)
    };

    const fetchList = async () => {
        route.params?.fetchList && route.params?.fetchList();
        if (route.params?.to === 'goBack') {
            navigation.goBack();
        }
        if (route.params?.to === 'wishlist') {
            navigation.navigate('Wishlist');
        }
        if (route.params?.to != 'wishlist') {
            navigation.navigate('Trending');
        }
    };

    let totalValue = Number(route.params?.item.product_price) + (Number(route.params?.item.product_tax) / 100 * Number(route.params?.item.product_price)) + (Number(route.params?.item.product_tip) / 100 * Number(route.params?.item.product_price));

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={route.params?.to === 'goBack' ? () => navigation.goBack() : () => navigation.navigate(route.params?.to && route.params?.to == 'wishlist' ? 'Wishlist' : 'Trending')} leftIcon={Icons.backarrow} text={route.params ? route.params?.item.product_name.toUpperCase() : ''} />
                <ScrollView>
                    <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, marginHorizontal: 10, flexDirection: 'column', justifyContent: 'space-between', }}>
                        <View style={{ marginTop: 10 }}>
                            {route.params.item.product_image.includes("svg") ?
                                <SvgUri
                                    width={wp('70%')}
                                    height={hp(25)}
                                    uri={`${route.params.item.product_image}`}
                                    style={{alignSelf:"center"}}
                                />
                                :

                                <Image source={route.params.item ? { uri: route.params.item.product_image } : ''} style={{ width: wp('70%'), height: hp(25), resizeMode: 'contain', alignSelf: 'center' }} />
                            }
                        </View>
                        <View style={{ padding: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: "center" }}>
                            <Text numberOfLines={2} style={{ fontSize: hp(2.2), color: Colors.LightestBlue, flex: 1, fontFamily: 'Poppins-SemiBold', }}>{route.params.item.product_name !== '' ? route.params?.item.product_name : ''}</Text>
                            {route.params?.item.store_name != null ? <Text style={{ fontSize: hp(1.6), color: Colors.LightestBlue, fontFamily: 'Poppins-Medium' }}>{route.params?.item.store_name != null ? `Store Name: ${route.params?.item.store_name}` : ''}</Text> : null}

                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, }}>
                            <Text style={{ fontSize: hp(2.5), color: Colors.Charcol, fontFamily: 'Poppins-Bold', marginBottom: 10 }}>Detail:</Text>
                            <View style={{ flexDirection: "row", flex: 1, marginBottom: 15 }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', }}>Price: </Text>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', }}>${route.params?.item.product_price ? totalValue.toFixed(2) : '--'}</Text>
                            </View>
                            {route.params?.item.shoutout != undefined ?
                                <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
                                    <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginBottom: 5 }}>Store Shout-out: </Text>
                                    <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginBottom: 5 }}>{route.params?.item.shoutout}</Text>
                                </View>
                                : null}
                            {
                                route.params.item?.user_events != undefined
                                    ?
                                    <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
                                        <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginBottom: 5 }}>Event Name: </Text>
                                        <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginBottom: 5 }}>{route.params.item?.user_events?.event_title}</Text>
                                    </View>
                                    : null
                            }
                            {
                                route.params?.item.user_events != undefined
                                    ?
                                    <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
                                        <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginBottom: 5 }}>Event Date: </Text>
                                        <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginBottom: 5 }}>{moment(route.params.item?.user_events?.event_date).format('DD/MM/YYYY')}</Text>
                                    </View>
                                    : null
                            }
                            <View style={{ flexDirection: "row", flex: 1, marginBottom: 15 }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', }}>Description: </Text>
                                <Hyperlink onPress={(url, text) => { Linking.openURL(url) }} linkStyle={{ color: '#2980b9', fontSize: hp(1.8) }}>
                                    <Text numberOfLines={10} style={{ width: 250, fontSize: hp(2), color: Colors.Grey, fontFamily: 'Poppins-Regular', }}>{route.params.item.product_description ? route.params?.item.product_description : '--'}</Text>
                                </Hyperlink>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {route.params?.to !== 'goBack' ?
                    <View style={{ alignItems: 'center', position: "absolute", bottom: 40, alignSelf: "center" }}>
                        <AppButton isSelected={route.params.item && route.params?.item.is_like == 'false' ? false : true} text={route.params?.item.is_like == 'false' ? "ADD TO MY WISHLIST" : "REMOVE FROM MY WISHLIST"} onPressed={() => handleFavourite(route.params ? route.params?.item.id : null)} />
                    </View> : null}
            </View>
            <LoadingModal loading={loading} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    myStarStyle: {
        color: 'orange',
        backgroundColor: 'transparent',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 0,
    },
    myEmptyStarStyle: {
        color: 'grey',
    },
})
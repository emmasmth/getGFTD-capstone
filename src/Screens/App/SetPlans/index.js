import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, Platform, TouchableOpacity, Modal, ActivityIndicator, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import AppButton from '../../../Constants/Button';
import analytics from '@react-native-firebase/analytics';
import ImageColors from 'react-native-image-colors'
import LinearGradient from 'react-native-linear-gradient';
import UserAgent from 'react-native-user-agent';
import { useNetInfo } from '@react-native-community/netinfo';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';

// Contants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';
import { AuthContext } from '../../../Context';
import { oreintation } from '../../../Helper/NotificationService';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Icons, Images } from '../../../Assets';
import { Colors } from '../../../Utils';


function HorizontalPlanCard({ onPressed, select, icon, bgc, heading, title, text, tint, int, }) {
    return (
        <>
            <TouchableOpacity activeOpacity={1} style={[
                styles.horizontalCardStyle, {
                    borderWidth: 2,
                    borderColor: select ? Colors.Blue : Colors.White,
                    backgroundColor: bgc,
                    width: select == true ? wp('95%') : oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
                    height: select == true ? hp(13) : oreintation == 'LANDSCAPE' ? hp(11) : 'auto'
                }
            ]}
                onPress={onPressed}>
                <View style={styles.cardIconStyle}>
                    <Image source={icon} style={{ width: 40, height: 40, resizeMode: 'contain', tintColor: tint }} />
                </View>
                <View style={{ backgroundColor: tint, width: 1, height: hp(8), alignSelf: 'center' }} />
                <View style={styles.cardPlansDetails}>
                    <Text style={[styles.headingStyle, { color: tint }]}>{heading.toUpperCase()}</Text>
                    <View>
                        <Text style={[styles.pricingTextStyle, { color: tint, fontSize: int ? hp(1.6) : hp(2.2) }]}>
                            {text}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};

const FilterButtons = ({ resetFilter, applyFilter, loading, disabled }) => {
    return (
        <View style={styles.section3} >
            <TouchableOpacity activeOpacity={0.7} onPress={applyFilter} disabled={disabled == true ? true : false}>
                <View style={styles.buttonStyle}>
                    {!loading ? <Text style={styles.buttonTextStyle}>
                        {'Send'}
                    </Text>
                        :
                        <ActivityIndicator size="small" color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};

const initialState = {
    colorOne: { value: '', name: '' },
    colorTwo: { value: '', name: '' },
    colorThree: { value: '', name: '' },
    colorFour: { value: '', name: '' },
    rawResult: '',
}

export default function SetPlans({ navigation, route }) {
    const [colors, setColors] = useState(initialState)
    const { trackData } = useContext(AuthContext);
    const userDetails = useSelector(state => state.UserReducer);
    const isFocused = useIsFocused();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [loading, setloading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [select1, setSelect1] = useState(false);
    const [select2, setSelect2] = useState(false);
    const [select3, setSelect3] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [status, setStatus] = useState(false);
    const [actionItem, setActionItem] = useState('');
    const [oldAccessToken, setOldAccessToken] = useState('');
    const [processingType, setProcessingType] = useState('STANDARD_ACH');
    const apiToken = userDetails?.api_token;
    const itemPicture = route.params.itemPicture;
    const itemName = route.params.itemName;
    const netInfo = useNetInfo()

    const GetBalance = async () => {
        await Service.GetBalance(apiToken, setloading, setStatus, setActionItem, setOldAccessToken);
    };
    const fetchColors = async (e) => {
        const result = await ImageColors.getColors(e, {
            fallback: '#000000',
            quality: 'low',
            pixelSpacing: 5,
            cache: true,
            headers: {
                authorization: 'Basic 123',
            },
        });

        switch (result.platform) {
            case 'android':
                setColors({
                    colorOne: { value: result.lightVibrant, name: 'lightVibrant' },
                    colorTwo: { value: result.dominant, name: 'dominant' },
                    colorThree: { value: result.vibrant, name: 'vibrant' },
                    colorFour: { value: result.darkVibrant, name: 'darkVibrant' },
                    rawResult: JSON.stringify(result),
                })
                break
            case 'ios':
                setColors({
                    colorOne: { value: result.background, name: 'background' },
                    colorTwo: { value: result.detail, name: 'detail' },
                    colorThree: { value: result.primary, name: 'primary' },
                    colorFour: { value: result.secondary, name: 'secondary' },
                    rawResult: JSON.stringify(result),
                })
                break
            default:
                throw new Error('Unexpected platform')
        }

        setloading(false);
    };

    useEffect(() => {
        GetBalance();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Ser Plans');
        if (!!itemPicture) fetchColors(itemPicture);
    }, [isFocused]);



    const myFriendName = route.params.myFriends.filter((item, index) => item?.user_info.id == route.params.data.gifted_user_id);
    const accountNickname = route.params.accountNickname;
    const totalTax = route.params.totalTax;
    const totalTip = route.params.totalTip;
    const totalMargin = route.params.totalMargin;
    const totalFee = route.params.totalFee;
    const totalGftdPrice = Number(route.params.totalPrice);
    const service_fees = (totalMargin / 100) * totalGftdPrice;
    const service_tax = (totalTax / 100) * totalGftdPrice
    const service_tip = (totalTip / 100) * totalGftdPrice
    const service_fee = totalFee
    const grand_total = totalGftdPrice + service_fee;



    const handleSubmit = async () => {
        if (!itemPicture) fetchColors(itemPicture);
        setIsVisible(!isVisible);

    };

    const handleContinue = async () => {
        const parsingData = route.params.data;

        const addProp = Object.assign(parsingData, {
            ip: await netInfo.details.ipAddress,
            user_agent: UserAgent.getUserAgent(),
        });

        const data = JSON.stringify(addProp);

        // setDisabled(true);

        await analytics().logSpendVirtualCurrency({
            item_name: `${route.params.data.gft_name}`,
            virtual_currency_name: 'sila_money',
            value: Number(grand_total),
        });
        await analytics().logEvent('Send_gft', {
            gft_user_id: route.params.data.gifted_user_id,
            gft_type: 1,
            gft_wish_id: route.params.data.wish_id,
            gft_price: grand_total,
            gft_tip: totalTip,
            gft_privacy: route.params.data.privacy,
            gft_message: route.params.data.message,
            gft_tax: totalTax,
            gft_product_id: route.params.data.product_id,
            gft_processing_type: processingType,
            gft_sender_to: route.params.myFriends.filter((item, index) => item?.user_info.id == route.params.data.gifted_user_id)[0].user_info.name,
            gft_sender_from: accountNickname,
        });
        await Service.SendGift(data, apiToken, setBtnLoading, setIsVisible, navigation, route.params.willUmount, setDisabled);
    };

    // console.log('colors.colorFour', colors.colorFour)
    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            {<View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />}
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="SEND" />
            <View style={styles.container}>
                <View style={{ flex: 1, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 0 }}>
                        <Image source={Images.Send_Gift} style={{ height: oreintation == 'LANDSCAPE' ? 280 : 200, width: oreintation == 'LANDSCAPE' ? '90%' : '80%', resizeMode: oreintation == 'LANDSCAPE' ? 'contain' : 'cover' }} />
                    </View>
                    <View style={{ alignSelf: 'center', bottom: 40, position: 'absolute' }}>
                        <AppButton onPressed={() => handleSubmit()} loading={buttonLoading} text="SEND" xlarge />
                    </View>
                </View>
            </View >
            <Modal animationType="slide"
                visible={true}
                onRequestClose={() => {
                    setIsVisible(!isVisible);
                }}>
                <View style={{ flex: 1, backgroundColor: Colors.ThemeColor }}>
                    <LinearGradient
                        start={oreintation == "LANDSCAPE" ? { x: 1, y: 0 } : { x: 0.6, y: 0 }} end={oreintation == "LANDSCAPE" ? { x: 1, y: 0.6 } : { x: 1, y: 1 }}
                        locations={[0, 0.5, 0.6]}
                        colors={['#F9DA06', '#F9DA06', '#F9BB06',]}
                        style={{ backgroundColor: 'gold', width: wp('90%'), height: Platform.OS == 'android' ? hp(62.8) : oreintation == 'LANDSCAPE' ? hp(60) : hp(57.8), position: 'absolute', top: Platform.OS == 'android' ? hp(14) : hp(22), alignSelf: 'center', borderRadius: 18, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10, elevation: 10, }} />
                    <View style={{
                        justifyContent: 'space-between',
                        top: Platform.OS == 'android' ? hp(10) : hp(18),
                        paddingVertical: wp(5),
                        width: oreintation == "LANDSCAPE" ? wp('87%') : wp('83%'),
                        height: Platform.OS == 'android' ? hp(70) : oreintation == 'LANDSCAPE' ? hp(67) : hp(65),
                        alignSelf: 'center',
                        backgroundColor: Colors.White,
                        elevation: 10,
                        shadowOffset: { width: 0, height: 8 },
                        shadowColor: Colors.Grey,
                        shadowRadius: 10,
                        shadowOpacity: 0.3,
                        borderRadius: 18,
                    }}>
                        <Image source={Images.confetti1} style={{ width: 200, height: 200, resizeMode: 'contain', top: 0, position: "absolute", zIndex: 2, right: -65, top: -80, }} />
                        <View style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            width: oreintation == 'LANDSCAPE' ? wp('80%') : wp('75%'),
                            ...oreintation == 'LANDSCAPE' ?
                                { marginTop: -40 } : null
                        }}>
                            <Icon type="material" name="close" color={Colors.ThemeColor} onPress={() => { setIsVisible(!isVisible), navigation.goBack() }} style={{ alignSelf: "flex-start" }} />
                            {/* <View /> */}
                        </View>
                        <View style={{
                            backgroundColor: itemName == 'Multiple GFTs' ? 'lightgrey' : colors.colorFour.value,
                            width: 130,
                            height: 130,
                            borderRadius: 500,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{ shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10, elevation: 10, }}>
                                <Image source={itemName == 'Multiple GFTs' ? Icons.multiple_gifts : { uri: itemPicture }} style={{ width: 85, height: 85, resizeMode: 'contain', }} />
                            </View>
                        </View>
                        <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: hp(2.2), color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold' }}>{`${itemName}`}</Text>
                        </View>
                        <View style={{ flex: 1, marginVertical: 20, paddingHorizontal: oreintation == "LANDSCAPE" ? 50 : 30 }}>
                            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8), textAlign: "left", alignSelf: "flex-start" }}>
                                    To:
                                </Text>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8), textAlign: "right" }}>
                                    {`${myFriendName[0].user_info.name}`}
                                </Text>

                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8), textAlign: "left", alignSelf: "flex-start" }}>
                                    GFT Price:
                                </Text>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8) }}>
                                    {totalGftdPrice ? `$ ${totalGftdPrice.toFixed(2)}` : '$ 0'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8), textAlign: "left", alignSelf: "flex-start" }}>
                                    Tax, Tip & Fee:
                                </Text>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8) }}>
                                    {service_fee ? `$ ${service_fee.toFixed(2)}` : '$ 0'}
                                </Text>
                            </View>
                            <View style={{ height: 2, width: oreintation == "LANDSCAPE" ? wp('75%') : wp('65%'), backgroundColor: '#DADADA', alignSelf: 'center', marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-Bold', fontSize: hp(1.9), textAlign: "left", alignSelf: "flex-start" }}>
                                    Grand Total:
                                </Text>
                                <Text style={{ color: Colors.ThemeColor, fontFamily: 'Poppins-Bold', fontSize: hp(1.9) }}>
                                    {grand_total ? `$ ${grand_total.toFixed(2)}` : '$ 0'}
                                </Text>
                            </View>
                            <FilterButtons loading={btnLoading} resetFilter={() => setIsVisible(!isVisible)} applyFilter={handleContinue} disabled={disabled} />
                        </View>
                        <Image source={Images.confetti} style={{ width: 220, height: 220, resizeMode: 'contain', position: "absolute", zIndex: 2, left: oreintation == "LANDSCAPE" ? -80 : -65, bottom: oreintation == "LANDSCAPE" ? hp(-18) : hp(-20), }} />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    horizontalCardStyle: {
        flexDirection: "row",
        // width: oreintation == "LANDSCAPE" ? wp('95%') : wp('90%'),
        height: hp(11),
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        alignSelf: 'center',
        marginVertical: hp(1),
        padding: 10,
        borderRadius: 6,
        elevation: 10,
    },
    cardIconStyle: {
        flex: oreintation == 'LANDSCAPE' ? .5 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    cardPlansDetails: {
        padding: 10,
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: "space-evenly",
    },
    headingStyle: {
        fontSize: hp(2.6),
    },
    pricingTextStyle: {
        fontSize: hp(2.2),
    },
    buttonStyle: {
        backgroundColor: Colors.ThemeColor,
        width: wp(60),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5.5),
        borderRadius: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        elevation: 10,
        zIndex: 1,
    },
    buttonTextStyle: {
        fontSize: hp(2),
        color: Colors.White,
        fontFamily: 'Poppins-SemiBold',
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Poppins-SemiBold',
    },
    section3: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
});
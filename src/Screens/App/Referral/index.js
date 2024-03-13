import { View, Image, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, ImageBackground, Pressable } from "react-native";
//import { BlurView } from "@react-native-community/blur";
import React, { useContext, useEffect, useState } from 'react'
import { Icons, Images } from "../../../Assets";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../../Utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from "react-native-elements";
import Share from 'react-native-share';
import { useIsFocused } from "@react-navigation/native";
import { Service } from "../../../Config/Services";
import { useSelector } from "react-redux";
import Toast from 'react-native-toast-message';
import { AuthContext } from "../../../Context";
import { Modal } from "react-native-paper";

export default function Referral({ navigation }) {
    const isFocus = useIsFocused();
    const [rewardsPoint, setRewardsPoints] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [referralURL, setReferralURL] = useState('');
    const [myReferrals, setMyReferrals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const userDetails = useSelector(state => state.UserReducer);
    const apiToken = userDetails.api_token;
    const { trackData } = useContext(AuthContext);

    const onShare = async () => {
        const sharedOption = {
            title: 'Share with your friends',
            message: `I just joined GFTD! 🎁 Download so we can get GFTing - any time, anywhere 🎁 \nUse my Referral while signing up: ${referralURL}  \n\nDownload Now:`,
            url: 'https://gftdcamp1.enorness.com/device-checker.html'
        };
        // console.log(sharedOption)
        try {
            const result = await Share.open(sharedOption);
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log('onShare error', error);
        }
    };

    const fetchReferralData = async () => {
        await Service.GetMyReferrals(userDetails.api_token, setReferralURL, setRewardsPoints, setMyReferrals, setLoading);
    }
    const handleRedeem = async () => {
        if (rewardsPoint < 1500) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: `To redeem you must have 1500 points.`,
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
        }
        else {
            const data = {
                amount: rewardsPoint
            };
            await Service.RedeemReferralRewards(userDetails.api_token, JSON.stringify(data), setBtnLoading, fetchReferralData);
        }
    }

    // const userDetails = useSelector(state => state.UserReducer);


    useEffect(() => {
        fetchReferralData();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Referrals and Rewards');
    }, [isFocus]);

    const { container, section1, section2, bulletPoint } = styles;
    const handleClose = () => setVisible(false);
    const handleOpen = () => setVisible(true);
    return (
        <>
            <View style={container}>
                <StatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'} />
                <ImageBackground style={section1} source={Images.rr_bg}>
                    <View style={{ flex: .35, flexDirection: 'row', alignItems: "flex-end", justifyContent: "space-between", padding: 5 }}>
                        <View style={{ flex: .6, }}>
                            <Icon name={'arrow-back-ios'} color={Colors.White} onPress={() => navigation.goBack()} />
                        </View>
                        <View style={{ flex: 3, alignItems: "center" }}>
                            <Text style={{ fontSize: hp(3), color: Colors.White, fontFamily: 'SpaceGrotesk-Medium', }}>Referrals & Rewards</Text>
                        </View>
                        <View style={{ flex: .6 }} />
                    </View>
                    <View style={{ flex: .4, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ flexDirection: "row", height: hp(7), width: wp(68), backgroundColor: Colors.White, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                            <View style={{ flexDirection: "row", height: hp(7), width: wp(68), backgroundColor: Colors.White, borderRadius: 50, borderStyle: "dashed", borderColor: Colors.ThemeColor, padding: 4, borderWidth: 2, }}>
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                                    <Image source={Icons.rr_copy} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                                </View>
                                <View style={{ flex: 3, alignItems: "center", justifyContent: "center", }}>
                                    <Text style={{ fontFamily: "SpaceGrotesk-SemiBold", color: Colors.ThemeColor, fontSize: hp(1.5) }}>{`${referralURL ? referralURL :'share URL'}`}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                                    <Icon name="share-a" type="fontisto" size={hp(2)} color={Colors.ThemeColor} onPress={onShare} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1.3, }}>
                        <View style={{ flex: 2, flexDirection: 'column', alignItems: "center", justifyContent: "center", }}>
                            <Pressable style={{ position: 'absolute', top: 0, right: 100 }} onPress={handleOpen}>
                                <Image source={Icons.rr_info} style={{ width: 20, height: 20, resizeMode: 'contain', }} />
                            </Pressable>
                            <Text style={{ fontFamily: "SpaceGrotesk-SemiBold", color: Colors.White, fontSize: hp(9), textShadowColor: Colors.Blue, marginTop: -20 }}>{rewardsPoint}</Text>
                            <Text style={{ fontFamily: "SpaceGrotesk-Medium", color: Colors.White, fontSize: hp(2.8) }}>Rewards Balance</Text>
                        </View>
                        <View style={{ flex: 1.5, alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={handleRedeem}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: 'space-around',
                                    borderRadius: 50,
                                    backgroundColor: '#4E58ED',
                                    width: wp(40),
                                    height: hp(6.5),
                                    marginTop: 10,
                                    shadowColor: Colors.Charcol,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 10
                                }}>
                                {btnLoading ? <ActivityIndicator size={"small"} color={Colors.White} /> : <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.White, fontSize: hp(2) }}>REDEEM</Text>}
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: .8, }}></View>
                    </View>
                </ImageBackground>

                <View style={section2}>
                    {/* <View style={{ alignItems: "center", backgroundColor: Colors.White, width: '100%', height: hp(55), borderRadius: 30, marginTop: -15, }}> */}
                    <Text style={{ fontFamily: "SpaceGrotesk-Medium", color: '#094384', fontSize: hp(2.4), marginTop: 10, marginBottom: 5, }}>My Referrals</Text>
                    <View style={{}}>
                        {
                            loading == true ?
                                <ActivityIndicator color={Colors.LightestBlue} size="small" />
                                :
                                myReferrals.length > 0
                                    ?
                                    <FlatList
                                        data={myReferrals}
                                        keyExtractor={(item, index) => index.toFixed()}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={{ backgroundColor: '#9797972B', width: wp('90%'), height: hp(9), margin: 12, flexDirection: "row", paddingHorizontal: 10, borderRadius: 50 }}>
                                                    <View style={{ flex: .8, alignItems: "center", justifyContent: 'center', }}>
                                                        <Image source={item.image} style={{ resizeMode: 'contain', width: 55, height: 55, }} />
                                                    </View>
                                                    <View style={{ flex: 2, flexDirection: 'column', }}>
                                                        <Text style={{ fontSize: hp(2.1), color: Colors.ThemeColor, fontFamily: "Poppins-Medium", marginStart: 10, marginTop: 10, }}>{item.name}</Text>
                                                        <View style={{ marginStart: 10,width: wp(18), height: hp(3.3), backgroundColor: 'rgba(78, 88, 237, 1)', alignItems: "center", justifyContent: "center", borderRadius: 20 }}>
                                                            <Text style={{ fontSize: hp(1.8), color: Colors.White, fontFamily: "Poppins-Medium",}} >{`${item?.credit_points ? item?.credit_points : '0'}`}</Text>
                                                            </View>
                                                    </View>
                                                    <View style={{ flex: 1.3, flexDirection: 'column', alignItems: "center", justifyContent: "center", }}>
                                                        <TouchableOpacity style={{ width: wp(25), height: hp(3.5), backgroundColor: Colors.ThemeColor, alignItems: "center", justifyContent: "center", borderRadius: 20 }}>
                                                            <Text style={{ fontSize: hp(1.6), color: Colors.White, fontFamily: "Poppins-Regular", }}>{`${item?.status}`}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                    : <View style={{ alignItems: "center", marginTop: 20, }}>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: hp(2.5), color: Colors.LightestBlue }}>No Referrals Yet.</Text>
                                    </View>
                        }
                    </View>
                </View>
            </View>
            <Modal
                visible={visible}
                onDismiss={handleClose}
            >
                <ImageBackground source={Images.rr_bg} resizeMode="cover" borderRadius={20} style={{ width: wp(70), height: hp(30), alignSelf: "center", }} >
                    <View style={{ flex: 1, }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", padding: 5, }}>

                            <View style={{ width: 30 }} />
                            <Text style={{ color: Colors.White, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: hp(2.8) }}>
                                Info
                            </Text>
                            <Icon name="close" onPress={handleClose} color={Colors.White} />
                        </View>
                        <View style={{ flex: 3, alignItems: "center", justifyContent: "center" }}>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={bulletPoint}>• </Text>
                                <Text style={{ color: Colors.White, fontFamily: 'SpaceGrotesk-Medium', fontSize: hp(2.3) }}>
                                    500 points= $5
                                </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={bulletPoint}>• </Text>
                                <Text style={{ color: Colors.White, fontFamily: 'SpaceGrotesk-Medium', fontSize: hp(2.3) }}>
                                    1000 points= $12
                                </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={bulletPoint}>• </Text>
                                <Text style={{ color: Colors.White, fontFamily: 'SpaceGrotesk-Medium', fontSize: hp(2.3) }}>
                                    1500 points= $20
                                </Text>
                            </View>

                        </View>
                        <View style={{ flex: 1, }}>

                        </View>
                    </View>
                </ImageBackground>
            </Modal>
        </>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    section1: {
        flex: 1,
    },
    section2: {
        flex: 1,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        alignItems: "center"
    },
    absolute: {
        position: "absolute",
        resizeMode: 'contain',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: 420,
    },
    bulletPoint: {
        fontSize: hp(3),
        color: Colors.White
    },
});
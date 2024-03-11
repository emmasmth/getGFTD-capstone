import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, ScrollView, Image, Platform, TouchableOpacity, Modal, ActivityIndicator, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import AppButton from '../../../Constants/Button';
import Toast from 'react-native-toast-message';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';

// Contants----------------------------------------------------------------
import LoadingModal from '../../../Constants/Modals/LoadingModal';
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Icons, Images } from '../../../Assets';
import { Colors } from '../../../Utils';
import ConfirmationModal from '../../../Constants/Modals/ConfirmationModal';
import { AuthContext } from '../../../Context';


function HorizontalPlanCard({ onPressed, select, icon, bgc, heading, title, text, tint, int, }) {
    return (
        <>
            <TouchableOpacity activeOpacity={1} style={[styles.horizontalCardStyle, { borderWidth: 2, borderColor: select == true ? Colors.Blue : 'transparent', backgroundColor: bgc, width: select == true ? wp('95%') : wp('90%'), height: select == true ? hp(13) : hp(10) }]} onPress={onPressed}>
                <View style={styles.cardIconStyle}>
                    <Image source={icon} style={{ width: 40, height: 40, resizeMode: 'contain', tintColor: tint }} />
                </View>
                <View style={{ backgroundColor: tint, width: 1, height: hp(8), alignSelf: 'center' }} />
                <View style={styles.cardPlansDetails}>
                    <Text style={[styles.headingStyle, { color: tint }]}>{heading.toUpperCase()}</Text>
                    <View>
                        <Text style={[styles.pricingTextStyle, { color: tint, fontSize: int ? hp(1.5) : hp(2.1) }]}>
                            {text}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};


export default function Transfer({ navigation, route }) {
    const isFocused = useIsFocused();
    const userDetails = useSelector(state => state.UserReducer);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [loading, setloading] = useState(false);
    const [select1, setSelect1] = useState(false);
    const [select2, setSelect2] = useState(false);
    const [select3, setSelect3] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [processingType, setProcessingType] = useState('STANDARD_ACH');
    const apiToken = userDetails?.api_token;
    const { trackData } = useContext(AuthContext);
    const [recBankData, setRecBankData] = useState("")


    const handleSubmit = async () => {
        setIsVisible(true);
        if (bankAccounts == [] || bankAccounts.length == 0) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please Connect Your Bank',
                autoHide: true,
                position: 'top',
                visibilityTime: 3000,
                onHide: () => navigation.navigate('MyAccounts', { initialRouteName: 'Recieve Account' }),
            });

            return false;
        };
    };

    const GetBankAccounts = async () => {
        await Service.ShowbankDetails(apiToken, setBankAccounts, setloading,);
    };

    useEffect(() => {
        GetBankAccounts();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Transfer');
    }, [isFocused])

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            {<View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />}
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="TRANSFER" />
            <View style={styles.container}>
                <View style={{ flex: 1, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 0 }}>
                        <Image source={Images.transfers} style={{ height: 300, width: '90%', resizeMode: 'cover' }} />
                    </View>
                    <ScrollView contentContainerStyle={{ marginTop: 25 }} >
                        <HorizontalPlanCard onPressed={() => { setSelect1(true), setSelect2(false), setSelect3(false), setProcessingType('STANDARD_ACH') }} select={select1 == true ? true : false} bgc={Colors.White} icon={Icons.kite} heading="2 days" title="2 days" text="Free" tint={Colors.LightestBlue} />
                        <HorizontalPlanCard onPressed={() => { setSelect1(false), setSelect2(true), setSelect3(false), setProcessingType('SAME_DAY_ACH') }} select={select2 == true ? true : false} bgc={Colors.DelightBlue} icon={Icons.paper_plane} heading="Same day" title="2 Days" text="+30 cents" tint={Colors.White} int />
                        {/* <HorizontalPlanCard onPressed={() => { setSelect1(false), setSelect2(false), setSelect3(true), setProcessingType('INSTANT_ACH') }} select={select3 == true ? true : false} bgc={Colors.LightestBlue} icon={Icons.rocket} heading="Instant" title="2 Days" text="+1.5% of total amount" tint={Colors.White} int /> */}
                    </ScrollView>
                    <View style={{ alignSelf: 'center', marginBottom: 40 }}>
                        <AppButton onPressed={() => handleSubmit()} loading={buttonLoading} text="TRANSFER" xlarge />
                    </View>
                </View>
            </View >
            <ConfirmationModal showAlert={showAlert} setShowAlert={setShowAlert} userDetails={userDetails} BankAccounts={bankAccounts} apiToken={apiToken} navigation={navigation} setIsVisible={setIsVisible} isVisible={isVisible} walletAmount={route.params.walletAmount} processingType={processingType} />
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={'SUCCESS'}
                message={'Redeem Transaction has been Processed.'}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                confirmButtonStyle={{
                    width: 60,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                showConfirmButton={true}
                cancelText="No"
                confirmText="Ok"
                confirmButtonColor={Colors.LightestBlue}
                onCancelPressed={() => {
                    setShowAlert(false);
                }}
                onConfirmPressed={() => {
                    setShowAlert(false);
                    setTimeout(() => {
                        navigation.goBack();
                    }, 1500)
                }}
            />
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
        width: wp('90%'),
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
        flex: 1,
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

});
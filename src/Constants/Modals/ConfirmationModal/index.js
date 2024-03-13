import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements';
import { Colors } from '../../../Utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Service } from '../../../Config/Services';
import analytics from '@react-native-firebase/analytics';

const FilterButtons = ({ resetFilter, applyFilter, loading }) => {
    return (
        <View style={styles.section3} >
            <TouchableOpacity onPress={resetFilter}>
                <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
                    <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
                        Cancel
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilter}>
                <View style={styles.buttonStyle}>
                    {!loading ? <Text style={styles.buttonTextStyle}>
                        Continue
                    </Text>
                        :
                        <ActivityIndicator size="small" color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};
export default function ConfirmationModal({ showAlert, setShowAlert, BankAccounts, userDetails, apiToken, navigation, walletAmount, processingType, isVisible, setIsVisible }) {
    const handleContinue = async () => {
        const data = {
            amount: walletAmount,
            processing_type: processingType,
        };

        await analytics().logEvent('redeem_sila',{
            amount: walletAmount,
            processing_type: processingType,
        });

        const pardingToRaw = JSON.stringify(data);
        await Service.RedeemSila(pardingToRaw, apiToken, setloading, setIsVisible, navigation, showAlert, setShowAlert);
    };

    const [loading, setloading] = useState(false);

    return (
        <Modal animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}>
            <View style={{
                justifyContent: 'space-between',
                top: hp(20),
                padding: wp(5),
                width: wp('85%'),
                height: hp(50),
                alignSelf: 'center',
                backgroundColor: 'white',
                elevation: 10,
                shadowOffset: { width: 0, height: 8 },
                shadowColor: Colors.Grey,
                shadowRadius: 10,
                shadowOpacity: 0.3,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }} >
                    <Text style={{
                        fontSize: hp(2.5),
                        color: Colors.Grey,
                        fontFamily: 'Lato-Bold'
                    }}>CONFIRM</Text>
                    <Icon type="material" name="close" color={Colors.Grey} onPress={() => setIsVisible(false)} />
                </View>
                <View style={{ flex: 1, marginVertical: 20 }}>
                    <View style={{ flexDirection: 'row', marginVertical: hp(1) }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Bold', fontSize: hp(1.8) }}>
                            From:
                        </Text>
                        <Text style={{ marginStart: 5, color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.8) }}>
                            GetGFTD Wallet ({userDetails.name})
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: hp(1) }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Bold', fontSize: hp(1.8) }}>
                            To:
                        </Text>
                        <Text style={{ marginStart: 5, color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(2) }}>
                            {BankAccounts.length > 0 ? BankAccounts[0].bank_name : '--'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: hp(1)  }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Bold', fontSize: hp(1.8) }}>
                            Wallet amount:
                        </Text>
                        <Text style={{ marginStart: 5, color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(2) }}>
                            {processingType == 'STANDARD_ACH' ? walletAmount : (walletAmount - 0.30).toFixed(2)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: hp(1)  }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Bold', fontSize: hp(1.8) }}>
                            getGFTD fee:
                        </Text>
                        <Text style={{ marginStart: 5, color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(2) }}>
                            {processingType == 'STANDARD_ACH' ? 'Free' : '0.30'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: hp(1)  }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Bold', fontSize: hp(1.8) }}>
                            Amount:
                        </Text>
                        <Text style={{ marginStart: 5, color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.8) }}>
                            {walletAmount ? `$ ${walletAmount}` : '--'}
                        </Text>
                    </View>
                </View>
                <FilterButtons loading={loading} resetFilter={() => setIsVisible(false)} applyFilter={handleContinue} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Colors.Blue,
        width: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5.5),
        borderRadius: 5,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        zIndex: 1,
    },
    buttonTextStyle: {
        fontSize: hp(2),
        color: Colors.White,
        fontFamily: 'Lato-Bold',
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Lato-Bold',
    },
    section3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});
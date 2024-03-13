import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
// import * as Animatable from 'react-native-animatable';
import { Colors } from '../../../Utils';
import PriceCheckbox from '../../PriceCheckbox';
import SortByCheckbox from '../../SortCheckbox';
import { Service } from '../../../Config/Services';
import { useSelector } from 'react-redux';
import { Icons, Images } from '../../../Assets';
import { Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function SortModal({ type, notificationType, messageBody, id, modalVisible, setData, isLike, setRefresh, setModalVisible, fetchList }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [check, setCheck] = useState(null);
    const apiToken = userDetails?.api_token;

    const handleLike = async () => {
        setModalVisible(!modalVisible);
        const obj = {
            notification_id: id
        };

        const jsondata = JSON.stringify(obj)

        await Service.LikeNotification(apiToken, jsondata)
    }
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                // presentationStyle={'fullScreen'}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style={{ backgroundColor: 'white', alignSelf: 'center', top: 120, height: 400, borderColor: Colors.LightestBlue, borderWidth: 1 }}>
                        <View style={styles.section1} >
                            <Icon type="material" name="close" color={Colors.Black} size={30} onPress={() => setModalVisible(!modalVisible)} />
                        </View>
                        <View style={{ width: wp('90%'), }}>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={notificationType == 1 ? Images.envelop2 : notificationType == 2 ? Images.envelop1 : notificationType == 4 ? Images.envelop3 : notificationType == 3 && Images.envelop3} style={{ width: 250, height: 270 }} />
                                {messageBody != "" ? <Animatable.Text delay={2000} animation="zoomInUp" style={{ fontSize: hp(1.5), fontFamily: 'oswald-regular', color: Colors.Charcol, position: 'absolute', top:100}}>{`${messageBody}`}</Animatable.Text> : null}
                            </View>
                        </View>
                        <View style={styles.section3} >
                            <View style={{ alignItems: 'center' }}>
                                <Icon onPress={handleLike} name="heart" type="foundation" color={isLike == '0' ? 'grey' : Colors.LightestBlue} size={50} style={{ shadowColor: Colors.Grey, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 4, alignSelf: 'center' }} />
                                <Text style={{ textAlign: 'center', fontFamily: 'oswald-Regular', color: Colors.Black }}>{isLike == '1' ? 'Liked' : `Like This TY`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        justifyContent: 'space-between',
        // top: hp(20),
        padding: wp(10),
        // width: wp('85%'),
        height: '100%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
    },
    section1: {
        top: hp(1),
        right: -10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginHorizontal: wp(5)

    },
    section3: {
        // top: hp(1),
        marginHorizontal: wp(7),
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    modalTitleStyle: {
        fontSize: hp(2.5),
        color: Colors.Grey,
        fontFamily: 'Poppins-SemiBold'
    },
    iconStyle: {
        width: 18,
        height: 18,
        tintColor: Colors.Black,
    },
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
        fontFamily: 'Poppins-SemiBold'
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Poppins-SemiBold'
    }
})
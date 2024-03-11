import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, TextInput, ActivityIndicator, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

import { Colors } from '../../../Utils';
import PriceCheckbox from '../../PriceCheckbox';
import SortByCheckbox from '../../SortCheckbox';
import { Service } from '../../../Config/Services';
import { useSelector } from 'react-redux';
import SortModal from '../SortModal';
import { Icons, Images } from '../../../Assets';
import { Image } from 'react-native';
import AppTextArea from '../../TextArea';
import AppTextInput from '../../TextInput';
import { Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';


export default function ThankYouModal({ id, type, modalVisible, navigation, setData, setRefresh, setModalVisible, fetchList }) {

    const userDetails = useSelector(state => state.UserReducer);
    const [check, setCheck] = useState(null);
    const [visible, setVisible] = useState(false);
    const [showFormalMessage, setShowFormalMessage] = useState(false);
    const [showInformalMessage, setShowInformalMessage] = useState(false);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [hideMessage, setHideMessage] = useState(false);
    const [loading, setloading] = useState(false);
    const [customMessage, setCustomMessage] = useState('');

    const [heading, setHeading] = useState('Choose Your TY');
    const handleFormal = async () => {
        setShowFormalMessage(true);
        setHeading('Formal');
    };
    const handleFriendly = async () => {
        setShowInformalMessage(true);
        setHeading('Friendly');
    };
    const handleCustom = async () => {
        setShowCustomMessage(true);
        setHeading('Custom');
    };

    const handleExit = () => {
        showFormalMessage || showCustomMessage || showInformalMessage ? () => { } : setModalVisible(!modalVisible);
        setShowFormalMessage(false);
        setShowInformalMessage(false);
        setShowCustomMessage(false);
        setHeading('Choose Your TY');
    };

    const apiToken = userDetails?.api_token;
    const handleReply = async (type) => {
        const obj = {
            "notification_type": type,
            "notification_id": id,
        };
        type == 3 && Object.assign(obj, { "message_body": customMessage });
        const data = JSON.stringify(obj);
        await Service.NotificationReply(data, apiToken, setloading, navigation, setModalVisible, modalVisible);
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.section1} >
                        <Text style={styles.modalTitleStyle}>{heading}</Text>
                        <Icon type="material" name="close" color={Colors.Grey} onPress={handleExit} />
                    </View>
                    {
                        showFormalMessage ?
                            <>
                                <View style={{ alignItems: 'center', padding: 20 }}>
                                    <Image source={Images.envelop2} style={{ width: 250, height: 250 }} />
                                </View>
                                <View style={styles.section4} >
                                    <TouchableOpacity onPress={() => handleReply(1)} style={[styles.buttonStyle, { shadowColor: Colors.LightestGrey, }]} >
                                        {!loading ?
                                            <Text style={[styles.buttonTextStyle,]}>
                                                SEND
                                            </Text>
                                            : <ActivityIndicator color={Colors.White} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            showInformalMessage ?
                                <>
                                    <View style={{ alignItems: 'center', padding: 20 }}>
                                        <Image source={Images.envelop1} style={{ width: 250, height: 250 }} />
                                        {/* <Text style={{ fontFamily: 'oswald-Regular', fontSize: hp(2), textAlign: 'center', color: Colors.LightBlue }}>Thank You, You just made my day!</Text> */}
                                    </View>
                                    <View style={styles.section4} >
                                        <TouchableOpacity onPress={() => handleReply(2)} style={[styles.buttonStyle, { shadowColor: Colors.LightestGrey, }]} >
                                            {!loading ?
                                                <Text style={[styles.buttonTextStyle,]}>
                                                    SEND
                                                </Text>
                                                : <ActivityIndicator color={Colors.White} />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                showCustomMessage ?
                                    <>
                                        <View style={{ alignItems: 'center', padding: 20 }}>
                                            <Image source={Images.envelop3} style={{ width: 300, height: 250 }} />
                                            <Animatable.View delay={2000} animation="zoomInUp" style={{ position: 'absolute', zIndex: 1, top: 100 }}>
                                                <TextInput
                                                    placeholder={'Type your thank you'}
                                                    onChangeText={setCustomMessage}
                                                    value={customMessage}
                                                    style={styles.textInputStyle}
                                                    placeholderTextColor={Colors.Grey}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    multiline={true}
                                                />
                                            </Animatable.View>
                                        </View>
                                        <View style={styles.section4} >
                                            <TouchableOpacity onPress={() => handleReply(3)} style={[styles.buttonStyle, { shadowColor: Colors.LightestGrey, }]} >
                                                {!loading ?
                                                    <Text style={[styles.buttonTextStyle,]}>
                                                        SEND
                                                    </Text>
                                                    : <ActivityIndicator color={Colors.White} />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                    : heading && <View style={styles.section2} >
                                        <TouchableNativeFeedback onPress={handleFormal}>
                                            <View style={[styles.TYbuttonStyle,]}>
                                                <Text style={[styles.TYbuttonTextStyle,]}>
                                                    {'Formal'}
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                        <TouchableNativeFeedback onPress={handleFriendly}>
                                            <View style={styles.TYbuttonStyle}>
                                                <Text style={styles.TYbuttonTextStyle}>
                                                    {'Friendly'}
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                        <TouchableNativeFeedback onPress={handleCustom}>
                                            <View style={styles.TYbuttonStyle}>
                                                <Text style={styles.TYbuttonTextStyle}>
                                                    {'Custom'}
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                    }
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
        top: hp(20),
        padding: wp(5),
        width: wp('85%'),
        height: hp(58),
        alignSelf: 'center',
        backgroundColor: 'white',
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
    },
    section1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    section2: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    section3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    section4: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    modalTitleStyle: {
        fontSize: hp(2.5),
        color: Colors.LightestBlue,
        fontFamily: 'oswald-Bold'
    },
    iconStyle: {
        width: 18,
        height: 18,
        tintColor: Colors.Grey,
    },
    TYbuttonStyle: {
        backgroundColor: Colors.White,
        borderColor: Colors.LightestBlue,
        borderStyle: 'dashed',
        borderWidth: 2,
        width: wp(70),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(8),
        borderRadius: 5,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        zIndex: 1,
    },
    TYbuttonTextStyle: {
        fontSize: hp(2),
        color: Colors.LightestBlue,
        fontFamily: 'oswald-Bold'
    },
    buttonStyle: {
        backgroundColor: Colors.LightestBlue,
        width: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5),
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
        fontFamily: 'oswald-Bold'
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'oswald-Bold'
    },
    textInputStyle: {
        backgroundColor: Colors.White,
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.6),
        width: wp('50%'),
        paddingHorizontal: 10,
        borderRadius: 8,
        textAlignVertical: 'top'
    },
    placeholderStyle: {
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1),
    },
})
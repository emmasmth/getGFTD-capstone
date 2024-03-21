import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils'

import { Icon } from 'react-native-elements'
import { Icons, Images } from '../../Assets';
import moment from 'moment';
import ThankYouModal from '../Modals/ThankYouModal';
import RecievedThankYouModal from '../Modals/RecievedThankYouModal';
import analytics from '@react-native-firebase/analytics';
import { oreintation } from '../../Helper/NotificationService';

export default function NotificationsCard({ navigation, item }) {

    const { id, message, created_at, reply_status, is_liked, notification_type, profileimage, message_body } = item;
    const [notificationId, setNotificationId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);

    useEffect(() => {
        if (notification_type == 1 || notification_type == 2 || notification_type == 3 || notification_type == 4) {
            analytics().logEvent('received_gfts', {
                id: id,
                message: message,
                reply_status: reply_status,
                notification_type: notification_type,
                message_body: message_body,
            })
        }
    }, [])

    return (
        <View style={styles.cardView}>
            <View style={{ flex: oreintation == "LANDSCAPE" ? .5 : .7, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 0 }, shadowRadius: 4, elevation: 10, borderRadius: 100 / 2, }}>
                    <Image source={profileimage !== null ? { uri: profileimage } : Images.userProfile} style={{ width: 45, height: 45, resizeMode: 'cover', borderRadius: 100 / 2, borderColor: Colors.Blue, borderWidth: 1 }} />
                </View>
            </View>
            <View style={{ flex: oreintation == "LANDSCAPE" ? 5 : 3, alignItems: 'flex-start', justifyContent: 'center', }} multiLine={true}>
                <Text numberOfLines={3} style={{ fontSize: hp(1.5), color: Colors.Grey, fontFamily: 'Poppins-Regular', marginStart: 5, textAlign: 'left' }}>
                    {`${message}`}
                </Text>
            </View>
            <View style={{ flex: oreintation == "LANDSCAPE" ? .5 : 1, alignItems: 'center', justifyContent: "space-between" }}>
                {reply_status == 0 && notification_type == 4
                    ?
                    <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                        <Icon size={hp(3)} name="mail" type="material" color={Colors.LightestBlue} onPress={() => { setModalVisible(!modalVisible) }} />
                        <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-Regular', fontSize: hp(1) }}>SEND TY</Text>
                    </View>
                    :
                    reply_status == 1 && notification_type == 4 ?
                        <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                            <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-Regular', fontSize: hp(1) }}>TY SENT</Text>
                            <Icon size={hp(3)} name="heart" type="foundation" color={Colors.LightestBlue} />
                            <Text style={{ position: 'absolute', right: 5, bottom: 1.5, fontSize: hp(1.1), color: Colors.Grey, fontFamily: 'oswald-Regular', }}>{is_liked ? is_liked : `0`}</Text>
                        </View>
                        : notification_type == 1 ?
                            <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                <Icon size={hp(3)} name="mail" type="material" color={Colors.LightestBlue} onPress={() => setViewModalVisible(!viewModalVisible)} />
                                <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-Regular', fontSize: hp(1) }}>VIEW</Text>
                            </View>
                            : notification_type == 2 ?
                                <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                    <Icon size={hp(3)} name="mail" type="material" color={Colors.LightestBlue} onPress={() => setViewModalVisible(!viewModalVisible)} />
                                    <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-Regular', fontSize: hp(1) }}>VIEW</Text>
                                </View>
                                : notification_type == 4 ?
                                    <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                        <Icon size={hp(3)} name="mail" type="material" color={Colors.LightestBlue} onPress={() => setViewModalVisible(!viewModalVisible)} />
                                        <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-Regular', fontSize: hp(1) }}>VIEW</Text>
                                    </View>
                                    : notification_type == 3 ?
                                        <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                            <Icon size={hp(3)} name="mail" type="material" color={Colors.LightestBlue} onPress={() => setViewModalVisible(!viewModalVisible)} />
                                            <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-Regular', fontSize: hp(1) }}>VIEW</Text>
                                        </View>
                                        : <View style={{ flex: 1 }} />
                }
                <Text style={styles.dateTextStyle}>{moment(created_at).format('ll')}</Text>
            </View>
            <ThankYouModal navigation={navigation} id={id} modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <RecievedThankYouModal id={id} notificationType={notification_type} messageBody={message_body} modalVisible={viewModalVisible} setModalVisible={setViewModalVisible} isLike={is_liked} />
        </View>
    );
};

const styles = StyleSheet.create({
    cardView: {
        backgroundColor: Colors.White,
        width: oreintation == "LANDSCAPE" ? wp('95%') : wp('90%'),
        height: hp(10),
        borderRadius: 8,
        shadowRadius: 10,
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
        margin: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 10
    },

    sec1: {
        flex: .7,
        width: wp('66%'),
        height: hp(7),
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },

    messageView: {
        marginStart: 5
    },

    dateView: {
        // backgroundColor: 'red',
        height: hp(7),
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: 5,
        flex: .2
    },

    dateTextStyle: {
        fontSize: hp(1.2),
        color: Colors.LightBlue,
        fontFamily: 'Poppins-Regular',
    },
});
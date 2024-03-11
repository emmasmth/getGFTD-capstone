import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';

// Constants----------------------------------------------------------------
import AppButton from '../../../Constants/Button';
import AppTextArea from '../../../Constants/TextArea';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import { AuthContext } from '../../../Context';
import { useFocusEffect } from '@react-navigation/native';

export default function NotificationReply(props) {
    const userDetails = useSelector(state => state.UserReducer);
    const [loading, setloading] = useState(false);
    const [customMessage, setCustomMessage] = useState('');
    const [collapse, setCollapse] = useState(false);
    const [reply1, setReply1] = useState(false);
    const [reply2, setReply2] = useState(false);
    const [reply3, setReply3] = useState(false);
    const [type, setType] = useState(1);
    const { navigation } = props;
    const apiToken = userDetails.api_token;

    const handleReply = async () => {
        const apiToken = userDetails?.api_token;
        const obj = {
            "notification_type": type,
            "notification_id": props.route.params.id,
        };
        type == 3 && Object.assign(obj, { "message_body": customMessage });
        const data = JSON.stringify(obj);
        await Service.NotificationReply(data, apiToken, setloading, navigation);
    };

    const { trackData } = useContext(AuthContext);
    useFocusEffect(() => {
       if(!!apiToken) trackData(apiToken, 'Page Viewed', 'Notification Reply');
    })

    const CutomHeader = () => {
        return (
            <View style={{ backgroundColor: Colors.White, width: wp('100%'), height: hp(10), }}>
                <View style={{ flexDirection: 'row', width: wp('100%'), justifyContent: "space-between", padding: 10, top: 15 }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="menu" type="material" size={35} color={Colors.LightestBlue} onPress={() => navigation.openDrawer()} />
                    </View>
                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.LightestBlue, fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: hp(2.2), }}>REPLIES</Text>
                    </View>
                    <View style={{ flex: 1, }} >
                        <Icon name="settings" type="material" size={30} color={Colors.LightestBlue} onPress={() => navigation.navigate('Settings')} />
                    </View>

                </View>
            </View >
        );
    };

    const BaseView = () => {
        return (
            <View style={{ backgroundColor: Colors.White, width: wp('90%'), height: hp(63), alignSelf: "center", position: "absolute", top: 10, borderRadius: wp(5), }} >
                <View style={{ justifyContent: "space-around", flex: 1, }}>
                    <TouchableOpacity style={{ backgroundColor: Colors.White, borderWidth: reply1 && 2, borderColor: Colors.LightestBlue, height: hp(8), alignItems: 'center', justifyContent: "center", borderRadius: 8, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, shadowColor: Colors.Grey, elevation: 10 }}
                        onPress={() => {
                            setReply1(true)
                            setReply2(false)
                            setReply3(false)
                            setType(1);
                        }}
                    >
                        <Text style={{ fontSize: hp(2), color: Colors.LightestBlue }}>Thank You</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.White, borderWidth: reply2 && 2, borderColor: Colors.LightestBlue, height: hp(8), alignItems: 'center', justifyContent: "center", borderRadius: 8, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, shadowColor: Colors.Grey, elevation: 10 }}
                        onPress={() => {
                            setReply1(false)
                            setReply2(true)
                            setReply3(false)
                            setType(2);
                        }}
                    >
                        <Text style={{ fontSize: hp(2), color: Colors.LightestBlue }}>I would do the same for you</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.White, borderWidth: reply3 && 2, borderColor: Colors.LightestBlue, height: hp(8), alignItems: 'center', justifyContent: "center", borderRadius: 8, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, shadowColor: Colors.Grey, elevation: 10 }}
                        onPress={() => {
                            setReply1(false)
                            setReply2(false)
                            setReply3(true)
                            setType(3);
                            setCollapse(!collapse)
                        }}
                    >
                        <Text style={{ fontSize: hp(2), color: Colors.LightestBlue }}>Custom Reply</Text>
                    </TouchableOpacity>

                    {collapse && <AppTextArea value={customMessage} onChangedText={setCustomMessage} placeholder="Enter custom message" />
                    }
                    <AppButton loading={loading} xlarge text="Okay" onPressed={handleReply} />

                </View>
                <View style={{ flex: .2, alignItems: 'center' }}>
                </View>
            </View>
        );
    };

    return (
        <View style={{ backgroundColor: Colors.White, flex: 1, }}>
            <StatusBar translucent barStyle={'dark-content'} backgroundColor={Colors.White} />
            {<View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.White }} />}
            <CutomHeader />
            <ScrollView  >
                <BaseView />
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.White,
    },
    section1: {
        padding: 15,
        backgroundColor: Colors.LightGrey,
        flex: 1.3,
        flexDirection: 'column',
        justifyContent: "space-around"
    },
    section2: {
        flex: 2,
    }
})
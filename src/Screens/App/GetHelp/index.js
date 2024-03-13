
import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Platform, KeyboardAvoidingView, ScrollView, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';


// Constants----------------------------------------------------------------
import AppTextInput from '../../../Constants/TextInput';
import AppTextArea from '../../../Constants/TextArea';
import { Service } from '../../../Config/Services';
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';
import analytics from '@react-native-firebase/analytics';

// Utils----------------------------------------------------------------
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';
import { useFocusEffect } from '@react-navigation/native';

export default function GetHelp({ navigation }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setloading] = useState('');
    const apiToken = userDetails.api_token;

    const handleInquery = async () => {
        if (name == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Name cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (email == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Email cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (phone == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Contact number cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (message == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Message cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        const apiToken = await userDetails?.api_token;

        const obj = {
            name: name,
            email: email.toLowerCase(),
            mobile: phone,
            subject: 'Enquery',
            message: message,
        };

        await analytics().logEvent('contact_us', {
            name: name,
            email: email.toLowerCase(),
            mobile: phone,
            subject: 'Enquery',
            message: message,
        });

        const data = JSON.stringify(obj);
        await Service.ContactUs(data, apiToken, setloading, navigation);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
    };

    const { trackData } = useContext(AuthContext);
    useFocusEffect(() => {
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Get Help');
    })


    return (
        <View style={{ flex: 1, backgroundColor: Colors.White }}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="GET HELP" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView >
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ marginTop: 10, width: oreintation == 'LANDSCAPE' ? '95%' : '90%', justifyContent: 'space-around', height: 70 }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Blue, fontFamily: 'Lato-Regular' }}>{'We are happy to help :)'}</Text>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>{'Get in touch with our support team by filling out the form below!'}</Text>
                            </View>
                            <View style={{ marginVertical: hp(1) }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Name</Text>
                                <AppTextInput value={name} onChangedText={setName} placeholder="Enter your full name" />
                            </View>
                            <View style={{ marginVertical: hp(1) }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Email Address</Text>
                                <AppTextInput value={email} onChangedText={setEmail} placeholder="Enter your email address" />
                            </View>
                            <View style={{ marginVertical: hp(1) }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Contact Number</Text>
                                <AppTextInput maxLength={15} numeric value={phone} onChangedText={setPhone} placeholder="Enter your contact number" />
                            </View>
                            <View style={{ marginVertical: hp(1) }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Message</Text>
                                <AppTextArea value={message} onChangedText={setMessage} placeholder="Enter your message" />
                            </View>
                            <AppButton loading={loading} xlarge onPressed={handleInquery} text="SUMBIT YOUR QUERY" />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
});
import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';


// Constants----------------------------------------------------------------
import AppTextInput from '../../../Constants/TextInput';
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';
import { AuthContext } from '../../../Context';
import { useFocusEffect } from '@react-navigation/native';

export default function ChangeNumber({ navigation }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [phone, setPhone] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [countryCode, setCountryCode] = useState('US');
    const [country, setCountry] = useState(null);
    const [withCallingCode, setWithCallingCode] = useState(true);
    const [dialingCode, setDialingCode] = useState('+1');
    const [loading, setloading] = useState(false);
    const { signOut, trackData } = useContext(AuthContext);
    const apiToken = userDetails.api_token;


    const onSelect = (country) => {
        const plus = '+';
        setCountryCode(country.cca2);
        setCountry(country);
        setDialingCode(plus.concat(country.callingCode));
    };

    const handleChangeNumber = async () => {
        const apiToken = await userDetails?.api_token;
        const CombineNum = dialingCode.concat(phone);
        const obj = {
            mobile: CombineNum,
        };
        const data = JSON.stringify(obj);
        await Service.ChangeNumber(data, apiToken, setloading, navigation,signOut);
    };

    useFocusEffect(()=>{
        if(!!apiToken) trackData(apiToken, 'Page Viewed', 'Change Number');
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader text="CHANGE NUMBER" leftIcon={Icons.backarrow} onPressed={() => navigation.goBack()} />
            <View style={styles.content}  >
                <View style={styles.box1}>
                    <View style={styles.section2}>
                        <Text style={styles.lableText}>Enter Your New Phone Number</Text>
                        <AppTextInput dialingCode={dialingCode} withCallingCode={withCallingCode} countryCode={countryCode} country={country} onSelect={onSelect} left xmedium placeholder="" value={phone} validation onChangedText={setPhone} validationText={validationMessage} />
                    </View>
                    <View style={styles.section3}>
                        <AppButton loading={loading} mmedium text="CONTINUE" onPressed={handleChangeNumber} />
                    </View>
                </View>
            </View>
        </View >
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    content: {
        flex: 1,
    },
    box1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    section2: {
        justifyContent: "space-evenly",
        alignItems: 'center',
        flexDirection: 'column',
    },
    section3: {
        justifyContent: "center",
        alignItems: 'center',
    },
    linkStyle: {
        color: Colors.Blue,
        fontSize: hp(2),
        fontFamily: 'Lato-Regular'
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.5),
        fontFamily: 'Lato-Regular',
    },
    lableText: {
        color: Colors.Grey,
        fontSize: hp(2.2),
        fontFamily: 'Lato-Regular',
    },
})
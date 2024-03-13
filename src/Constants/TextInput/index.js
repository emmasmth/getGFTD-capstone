import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icons } from '../../Assets';
import { Colors } from '../../Utils';
import CountryPicker from 'react-native-country-picker-modal';
import { Icon } from 'react-native-elements';
import { oreintation } from '../../Helper/NotificationService';

export default function AppTextInput(props) {
    const { placeholder, dd, modal, highlighted, setHighlighted, validator, valideEmail, onChangedText, dollar, numeric, editable, maxLength, onEnd, grey, lefimg, dialingCode, num, countryCode, withCallingCode, onSelect, value, left, icon, icon2, icon2Pressed, validation, secureEntry, validationText, xmedium } = props;
    const [hide, setHide] = useState(false);
    const [visible, setVisible] = useState(false);
    const [validationTextMessage, setValidationTextMessage] = useState('');
    const handleHidden = () => {
        setHide(!hide);
        // setValidationTextMessage('Your SSN is encrypted.')
    };
    const handleVisible = () => {
        setVisible(!visible);
    };
    useEffect(() => {
        setHide(secureEntry);
    }, [])
    return (
        <View style={styles(props).container}>
            <View style={styles(props).textInputView}>
                {left && <TouchableOpacity style={[styles(props).textInputIcon, { flexDirection: 'row', paddingLeft: 10, }]} onPress={handleVisible}>
                    <CountryPicker
                        {...{
                            countryCode,
                            withCallingCode,
                            onSelect,
                            subregion: "North America",
                            excludeCountries: ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "ST", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "UM", "VI", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW", "KI", "HK", "AX"]
                        }}
                        visible={false}
                    />
                    <Text style={{ color: Colors.Charcol, fontSize: hp(1.7) }}>{dialingCode}</Text>
                </TouchableOpacity>}
                {lefimg && <View style={[styles(props).textInputIcon, { flexDirection: 'row', paddingLeft: 10, }]}><Icon name="mail" color={Colors.LightestBlue} size={20} /></View>}
                {dd && <View style={[styles(props).textInputIcon, { flexDirection: 'row', paddingLeft: 10, }]}><Icon name="dollar" type="font-awesome" color={Colors.Grey} size={16} /></View>}
                <TextInput
                    maxLength={maxLength && maxLength}
                    placeholder={placeholder}
                    onChangeText={(e) => {
                        onChangedText(e)
                        if (!!setHighlighted) {
                            setHighlighted(false)
                        }
                    }}
                    editable={editable == false || dollar ? false : true}
                    value={value}
                    style={styles(props).textInputStyle}
                    onEndEditing={onEnd ? (e) => {
                        onEnd(true)
                    } : () => { }}
                    placeholderTextColor={Colors.Grey}
                    secureTextEntry={hide == true ? true : false}
                    placeholderStyle={styles(props).placeholderStyle}
                    keyboardType={num ? 'decimal-pad' : numeric ? 'phone-pad' : 'default'}
                />
                {icon ?
                    <TouchableOpacity style={styles(props).textInputIcon} onPress={handleHidden}>
                        <Image source={
                            hide ? placeholder == 'SSN (Last 4 digits of SSN)' ? Icons.lock : Icons.hidden : placeholder == 'SSN (Last 4 digits of SSN)' ? Icons.unlock : Icons.show
                        } style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: "grey" }} />
                    </TouchableOpacity>
                    : validator
                        ? <View style={{ alignSelf: 'center' }}><Icon name={valideEmail == false ? 'close' : 'issue-closed'} type={valideEmail == false ? "fontisto" : 'octicon'} size={18} color={valideEmail == false ? 'red' : 'green'} /></View>
                        : icon2
                        && <View style={{ alignSelf: 'center' }}>
                            <Icon name="date" color={Colors.Grey} type="fontisto" onPress={icon2Pressed} />
                        </View>
                }
            </View>
            {/* {validation && hide && placeholder == 'SSN' ? <Text style={styles(props).textValidationStyle}>{'Your SSN is encrypted.'}</Text> : null} */}
        </View>
    );
};

const styles = (props) => StyleSheet.create({
    container: {
        flexDirection: "column",
        height: props.xmedium ? hp(5.7) : Platform.OS == 'android' ? hp(6.2) : hp(5.5),
        width: props.modal ? wp('75%') : props.xmedium ? wp('88%') : oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
        backgroundColor: props.grey ? Colors.LightGrey : Colors.White,
        justifyContent: 'flex-start',
        borderRadius: 6,
        borderWidth: .5,
        borderColor: props.highlighted ? 'red' : Colors.LightestGrey,
        marginVertical: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    textInputView: {
        flexDirection: 'row',
        width: props.modal ? wp('75%') : props.xmedium ? wp('85%') : wp('90%'),
        height: props.xmedium ? hp(5.5) : Platform.OS == 'android' ? hp(6) : hp(5),
    },
    textInputStyle: {
        backgroundColor: props.grey ? Colors.LightGrey : Colors.White,
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.6),
        width: props.modal ? wp('70%') : props.xmedium ? wp('55%') : oreintation == "LANDSCAPE" ? wp('92%') : wp('80%'),
        height: props.xmedium ? hp(5.5) : Platform.OS == 'android' ? hp(6) : hp(5),
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    placeholderStyle: {
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1),
    },
    textInputIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightImage: {
        height: 15,
        width: 20
    },
    textValidationStyle: {
        color: Colors.Red,
        fontSize: 12,
        paddingVertical: 3,
        paddingHorizontal: 3,
    },
});
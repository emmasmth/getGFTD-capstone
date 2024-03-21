import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icons } from '../../Assets';
import { oreintation } from '../../Helper/NotificationService';
import { Colors } from '../../Utils';

export default function AppTextArea(props) {
    const { placeholder, onChangedText, value, left, setHighlighted, icon, validation, secureEntry, validationText, xmedium, maxLength } = props;
    const [hide, setHide] = useState(secureEntry);
    const handleHidden = () => {
        setHide(!hide);
    };
    return (
        <View style={styles(props).container}>
            <View style={styles(props).textInputView}>
                {left && <TouchableOpacity style={styles(props).textInputIcon} onPress={handleHidden}>
                    <Image source={Icons.otpIcon} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                </TouchableOpacity>}
                <TextInput
                    multiline={true}
                    numberOfLines={8}
                    placeholder={placeholder}
                    onChangeText={(e) => { 
                        onChangedText(e)
                        if(setHighlighted){
                            setHighlighted(false) 
                        }
                    }}
                    value={value}
                    style={styles(props).textInputStyle}
                    secureTextEntry={hide && true}
                    placeholderTextColor={Colors.Grey}
                    placeholderStyle={styles(props).placeholderStyle}
                    maxLength={maxLength && maxLength}
                />
                {icon && <TouchableOpacity style={styles(props).textInputIcon} onPress={handleHidden}>
                    <Image source={hide ? Icons.hidden : Icons.show} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                </TouchableOpacity>}
            </View>
            {validation && <Text style={styles(props).textValidationStyle}>{validationText}</Text>}
        </View>
    );
};

const styles = (props) => StyleSheet.create({
    container: {
        flexDirection: "column",
        height: props.xmedium ? hp(8.5) : hp(12.2),
        width: props.xmedium ? wp('90%') : oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
        backgroundColor: props.grey ? Colors.Grey : Colors.White,
        justifyContent: 'flex-start',
        borderRadius: 6,
        borderWidth: .5, borderColor: props.highlighted ? 'red' : Colors.LightestGrey,
        marginVertical: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    textInputView: {
        flexDirection: 'row',
        width: props.xmedium ? wp('85%') : wp('90%'),
        height: props.xmedium ? hp(8.5) : hp(5),
    },
    textInputStyle: {
        backgroundColor: props.grey ? Colors.LightGrey : Colors.White,
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.6),
        width: props.xmedium ? wp('90%') : wp('80%'),
        height: props.xmedium ? hp(8) : hp(12),
        paddingHorizontal: 10,
        borderRadius: 8,
        textAlignVertical: "top",
    },
    placeholderStyle: {
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1),
        textAlignVertical: 'top',
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
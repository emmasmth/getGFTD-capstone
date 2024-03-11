import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Colors } from '../../Utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const theme = {
    roundness: 2,
    colors: {
        primary: Colors.Blue,
        accent: Colors.Blue,
    },
};

export default function PriceCheckbox({ setCheck, value, text1, text2, text3, hide }) {
    const [checked, setChecked] = useState('');

    return (
        <View style={styles.checkLists}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="first"
                    status={checked === "first" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("first"), setCheck(text1) }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text1}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="second"
                    status={checked === "second" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("second"), setCheck(text2) }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text2}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="third"
                    status={checked === "third" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("third"), setCheck(text3) }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text3}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    checkLists: {
        flexDirection: 'column',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.7),
        fontFamily: 'Lato-Regular',
    },
})
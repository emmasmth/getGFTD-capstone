import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Colors } from '../../Utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';

const theme = {
    roundness: 2,
    colors: {
        primary: Colors.Blue,
        accent: Colors.Blue,
    },
};
export default function SortByCheckbox({myWislist, setCheck, value, text1, text2, text3, text4, text5, text6, text7, hide }) {
    const isFocused = useIsFocused();
    const [checked, setChecked] = useState('');
    useEffect(() => {
        myWislist 
        ?
        AsyncStorage.getItem('saved_wish_sorting')
            .then((value) => {
                setChecked(JSON.parse(value))
            })
        :
        AsyncStorage.getItem('saved_sorting')
            .then((value) => {
                setChecked(JSON.parse(value))
            })
    }, [isFocused])
    const saveSorting = async (e) => {
        myWislist 
        ? await AsyncStorage.setItem('saved_wish_sorting', JSON.stringify(e))
        : await AsyncStorage.setItem('saved_sorting', JSON.stringify(e))
    }

    return (
        <View style={styles.checkLists}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="first"
                    status={checked === "first" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("first"), setCheck('5 and under'), saveSorting('first') }}
                    // size={10}
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
                    onPress={() => { setChecked("second"), setCheck('15 and under'), saveSorting('second') }}
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
                    onPress={() => { setChecked("third"), setCheck('50 and under'), saveSorting('third') }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text3}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="forth"
                    status={checked === "forth" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("forth"), setCheck('100 and under'), saveSorting('forth') }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text4}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="fifth"
                    status={checked === "fifth" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("fifth"), setCheck('over 100'), saveSorting('fifth') }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text5}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="sixth"
                    status={checked === "sixth" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("sixth"), setCheck('low'), saveSorting('sixth') }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text6}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="seventh"
                    status={checked === "seventh" ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked("seventh"), setCheck('high'), saveSorting('seventh') }}
                    style={{ width: 8, height: 8, }}
                />
                <Text style={styles.textStyle}>{text7}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    checkLists: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.5),
        fontFamily: 'Poppins-Regular',
    },
})
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Colors } from '../../Utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const theme = {
    // ...DefaultTheme,
    roundness: 2,
    colors: {
        // ...DefaultTheme.colors,
        primary: Colors.Blue,
        accent: Colors.Blue,
    },
};
export default function Checkbox({ privacy, setCheck, text1, text2, hide }) {
    const [checked, setChecked] = useState();

    return (
        <View style={styles.checkLists}>
            <RadioButton.Android
                theme={theme}
                uncheckedColor={Colors.Grey}
                value="first"
                status={checked === 'first' ? 'checked' : 'unchecked'}
                onPress={() => { setChecked('first'), setCheck(1) }}
                // size={10}
                style={{ width: 8, height: 8, }}
            />
            <Text style={styles.textStyle}>{text1}</Text>
            {!hide &&
                <>
                    <RadioButton.Android
                        theme={theme}
                        uncheckedColor={Colors.Grey}
                        value="first"
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => { setChecked('second'), setCheck(2) }}
                        // size={10}
                        style={{ width: 8, height: 8, }}
                    />
                    <Text style={styles.textStyle}>{text2}</Text>
                </>}
        </View>
    )
}

const styles = StyleSheet.create({
    checkLists: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.7),
        fontFamily: 'Poppins-Regular',
    }

})
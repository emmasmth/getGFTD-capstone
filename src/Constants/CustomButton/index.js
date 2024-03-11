import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Colors } from '../../Utils'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Image } from 'react-native';
import { scale } from 'react-native-size-matters';

const CustomButton = ({ title, backgroundColor, color, onPress, loading, icon, iconType,iconColor }) => {
    // console.log(icon)
    return (
        <TouchableOpacity style={[styles.main, { backgroundColor: backgroundColor, flexDirection: "row" }]} onPress={onPress} disabled={loading} >
            {icon ? <Image source={icon}  style={{ marginEnd: 10, width:22, height:22, resizeMode:"contain"}} /> : null}
            {loading ? <ActivityIndicator size={'small'} color={Colors.White} /> :
                <Text style={[styles.text, { color: color }]}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: hp(5.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: scale(6),
    },
    text: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    }
})
import React from 'react';
import { Platform } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils';


export default function Chips({ text, price, onPress }) {
    const { container } = styles;
    return (
        <View style={container}>
            <Text style={{fontFamily: 'Lato-Regular', height: Platform.OS == 'android' ? hp(3) : hp(2), color: Colors.LightBlue }}>{`${text}: $ ${price}`}</Text>
            <View style={{width:20, height:20, borderRadius:100, backgroundColor:Colors.LightestBlue,alignItems:"center", justifyContent:"center", marginLeft:10}}>
                <Icon name="close" size={18} onPress={onPress} color={Colors.White} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.White,
        // width:wp(40),
        height: Platform.OS == 'android' ? hp(6) : hp(5),
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 15,
        // paddingHorizontal:10,
        borderRadius: 100 / 2,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 10,
        shadowOpacity: 0.3,
        alignItems: "center",
        justifyContent: 'center',
        elevation:10,
    }
})
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { oreintation } from '../../Helper/NotificationService';
import { Colors } from '../../Utils';

export default function AppButton(props) {
    const { left, text, isSelected, onPressed, loading, disabled, large, mmedium, medium, small, icon } = props;
    return (
        <TouchableOpacity style={styles(props).container} onPress={onPressed} disabled={!!disabled ? disabled : loading}>
            <View style={styles(props).content}>
                {loading ? <ActivityIndicator color={isSelected ? Colors.Grey : Colors.White} /> : <Text style={styles(props).textStyle}> {text} </Text>}
            </View>
            {left && <View style={styles(props).icon}>
                <Image source={icon} style={{ width: small ? 31 : 23, height: small ? 31 : 23, resizeMode: 'contain' }} />
            </View>}
        </TouchableOpacity>
    )
};


const styles = (props) => StyleSheet.create({
    container: {
        width: props.xlarge
            ? oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%')
            : props.bioMetricEnabled
                ? wp('75%')
                : props.large
                    ? wp('80%')
                    : props.mlarge
                        ? wp('80%')
                        : props.medium
                            ? wp('90%')
                            : props.mmedium
                                ? wp('85%')
                                : props.small
                                    ? wp('75%')
                                    : wp('80%')

        ,
        height: props.xlarge
            ? hp(5.5)
            : props.bioMetricEnabled
                ? hp(5.5)
                : props.large
                    ? hp(7)
                    : props.mlarge
                        ? hp(6)
                        : props.medium
                            ? hp(4.5)
                            : props.mmedium
                                ? hp(5.5)
                                : props.small
                                    ? hp(5.5)
                                    : hp(6)
        ,
        backgroundColor: props.isSelected ? Colors.LightGrey : Colors.LightestBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: props.large ? 6 : props.xlarge ? 6 : props.mmedium ? 6 : 3,
        marginVertical: 10,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 10,
        shadowOpacity: 0.3,
        elevation: 10,
    },
    icon: {
        position: 'absolute',
        left: 20
    },
    textStyle: {
        color: props.isSelected ? Colors.Grey : '#ffffff',
        fontSize: props.small ? hp(1) : hp(2),
        fontFamily: 'Poppins-Medium',

    },
    content: {
        flexDirection: 'row',
    }
});
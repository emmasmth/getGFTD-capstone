import React from 'react'
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { Images } from '../../../Assets';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Welcome(props) {
    return (
        <View style={styles.container}>
            <StatusBar translucent
                barStyle={'dark-content'}
            />
            {<View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4.1), backgroundColor: '#0eb0f0' }} />}
            <View style={{ backgroundColor: '#0eb0f0', width: '100%', height: hp(60) }}>
                <Image source={Images.ob1} style={{ width: wp('100%'), height: hp(60), resizeMode: 'contain' }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImageStyle: {
        height: hp('100%'),
        width: wp('100%'),
    },
    content1: {
        flex: 2,
        top: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content2: {
        flex: 3,
        flexDirection: 'column',
    },
    textStyle: {
        fontFamily: 'Helvetica',
        fontSize: 19,
    },
    logoStyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    box1: {
        flex: 1,
    },
    box2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Colors } from '../Utils';
import { Icons } from '../Assets';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function SignupStatus({ bool }) {
    const signupStatus = useSelector(state => state.SignupStatusReducer);

    const [SpringValue, setSpringValue] = useState(new Animated.Value(0.2))

    const [count, setCount] = useState(20);
    useEffect(() => {
        if (signupStatus?.isSignup === true) {
            setCount(20); // Reset the count to 20 when the modal is opened
            const timer = setInterval(() => {
                setCount((prevSeconds) => {
                    if (prevSeconds === 0) {
                        clearInterval(timer);
                        return 20;
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }, 1000);
        }
    }, [signupStatus?.isSignup]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    return (
        <>
            {bool === true ?
                <Animated.View style={[styles.connectionStatus]}>
                    <View style={styles.content}>
                        <View style={{ alignItems: "center", }}>
                            <Image source={Icons.dash_loading} style={styles.bgImg} />
                            <Text style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-SemiBold', fontSize: hp(4.5), textAlign: "center", }}>
                                {formatTime(count)}
                            </Text>
                        </View>
                        <Text style={styles.connectionText}>
                            Your Profile Being Verified
                        </Text>
                    </View>
                </Animated.View> : null}
        </>
    );
}

const styles = StyleSheet.create({
    connectionStatus: {
        position: "absolute", top: 150,
        alignSelf: "center",
        backgroundColor: 'transparent',
    },
    content: {
        top: -40,
        padding: 20,
        borderRadius: 20,
        width: wp('75%'),
        height: hp(45),
        alignSelf: 'center',
        backgroundColor: Colors.White,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        borderWidth:1,
        borderColor:Colors.LightestBlue,
    },
    bgImg: {
        height: 150,
        width: 150,
        resizeMode: "contain",
    },
    centerView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    connectionText: {
        color: Colors.Charcol,
        fontFamily: 'Poppins-Medium',
        fontSize: hp(3),
        textAlign: "center",
    },
});

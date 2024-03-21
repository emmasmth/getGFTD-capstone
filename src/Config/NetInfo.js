/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { update_connection_status } from '../Redux/NetInfoRedux';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Modal } from 'react-native';

export default function MyNetInfo(props) {
    const netInfo = useSelector(state => state.NetInfoRedux);
    const [SpringValue, setSpringValue] = useState(new Animated.Value(0.2));

    const dispatch = useDispatch();
    const updateConnectionStatus = (isConnected) => dispatch(update_connection_status(isConnected));

    const spring = () => {
        SpringValue.setValue(0.2)
        Animated.spring(
            SpringValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start();
    }

    const _handleConnectionChange = ({ isConnected }) => {
        updateConnectionStatus(isConnected);
        if (!isConnected) return;

    };

    useEffect(() => {
        NetInfo.addEventListener(state => {
            _handleConnectionChange(state);
        });
        if (netInfo.isConnected) spring();
    }, []);

    return (
        <>
            {
                <Animated.View style={[styles.connectionStatus, { transform: [{ scale: SpringValue }] }]}>
                    <Modal
                        animationIn="slide"
                        transparent={true}
                        visible={!netInfo.isConnected}
                    >
                        <View style={styles.centerView}>
                            <Image source={require('../Assets/Icons/netinfo.png')} style={styles.bgImg} />
                        </View>
                    </Modal>
                </Animated.View>
            }
        </>
    );

}


const styles = StyleSheet.create({
    connectionStatus: {
        position: 'absolute',
        width: widthPercentageToDP(100),
        top: -30,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgImg: {
        width: widthPercentageToDP(90),
        resizeMode: 'contain',
    },
    centerView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    connectionText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
    },
});

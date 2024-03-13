import React, { Component } from 'react'
import { View, Text, StyleSheet, Image,ImageBackground, StatusBar} from 'react-native';

// Libraries----------------------------------------------------------------
import { oreintation, requestUserPermission } from '../../../Helper/NotificationService';

// Utils----------------------------------------------------------------
import {Images } from '../../../Assets';
import { Colors } from '../../../Utils';

export default class Splash extends Component {
    render() {
        return (
            <ImageBackground source={Images.splash} style={styles.container}  resizeMode="cover">
                <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} />
            </ImageBackground>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: "center",
        justifyContent: "center",
        resizeMode:"contain"
    },
});
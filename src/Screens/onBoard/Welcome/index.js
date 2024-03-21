import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Colors } from '../../../Utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { Images } from '../../../Assets';
import { useContext } from 'react';
import { AuthContext } from '../../../Context';
import { StatusBar } from 'react-native';


const slides = [
    {
        key: 'one',
        title: 'Title 1',
        text: "The new way to\nSend & Receive GFTs",
        image: Platform.OS === 'ios' ? Images.onboard_ios1 : Images.onboard_android1,
        backgroundColor: Colors.LightestBlue,
    },
    {
        key: 'two',
        title: 'Title 2',
        text: 'Send customized GFTs to \nsomeone special who deserves the best',
        image: Platform.OS === 'ios' ? Images.onboard_ios2 : Images.onboard_android2,
        backgroundColor: Colors.LightestBlue,
    },
    {
        key: 'three',
        title: 'Rocket guy',
        text: 'Make their day, any day, \nfrom anywhere 🎉',
        image: Platform.OS === 'ios' ? Images.onboard_ios3 : Images.onboard_android3,
        backgroundColor: Colors.LightestBlue,
    }
];


export default OnBoard = () => {
    const { onboard } = useContext(AuthContext);

    const [showRealApp, setShowRealApp] = useState(false)
    const [showSkipBtn, setShowSkipBtn] = useState(false)
    const [skiptonext, setSkiptonext] = useState(1);


    const _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        this.setState({ showRealApp: true });
    }
    const _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="arrow-forward"
                    color="white"
                    size={24}
                />
            </View>
        );
    };

    const _renderSkipButton = () => {
        return (
            <View style={styles.skipButton}>
                <Text style={{ color: '#333' }}>Skip</Text>
            </View>
        );
    };
    const _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="check"
                    color="white"
                    size={24}
                />
            </View>
        );
    };
    const _renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.body}>
                    <Image source={item.image} style={{ resizeMode: 'contain', width:  Platform.OS === 'android' ?  500 : 500, height: Platform.OS === 'android' ? 450 : 450 , marginLeft: Platform.select({
                        android: item.key == 'one' ? -30 : item.key == 'two' ? -25 : 0,
                        ios: item.key == 'one' ? -10 : item.key == 'two' ? -25 : item.key == 'three' ? 5 : 0
                    }) }} />
                    <Text style={styles.text}>{item.text}</Text>
                </View>
                <View style={styles.footer}>
                    {item.key == 'three' &&
                        <TouchableOpacity style={styles.getStartedButton} onPress={() => onboard()}>
                            <Text style={styles.getStartedButtonText}>{item.key === 'three' ? "Get Started" : "Skip"}</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <AppIntroSlider
                dotStyle={{ backgroundColor: 'silver' }}
                activeDotStyle={{ width: 20, backgroundColor: 'gold' }}
                renderItem={_renderItem}
                data={slides}
                nextLabel=""
                // skipLabel='Skip'
                // onDone={_onDone}
                // showSkipButton={true}
                renderNextButton={_renderNextButton}
            // renderDoneButton={_renderDoneButton}
            // renderSkipButton={_renderSkipButton}
            />
        </>
    )
}

const styles = StyleSheet.create({
    buttonCircle: {
        width: 50,
        height: 50,
        backgroundColor: 'gold',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.3,
        shadowColor: 'gold',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 10,
        elevation:10,
    },
    slide: {
        flex: 1,
        backgroundColor: 'white',
    },
    body: {
        backgroundColor: Colors.LightestBlue,
        flex: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomLeftRadius: Platform.OS == 'android' ? 30 : 40,
        borderBottomRightRadius:Platform.OS == 'android' ? 30 :  40,
    },
    text: {
        fontFamily: "oswald-regular",
        fontSize: hp(2.5),
        color: Colors.White,
        textAlign: 'center',
        marginTop: -10,
    },
    footer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    getStartedButton: {
        backgroundColor: 'gold',
        width: wp('50%'),
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        shadowColor: 'orange',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    getStartedButtonText: {
        fontFamily: 'Lato-Bold',
        fontSize: hp(2),
        color: 'white',
    },
    // skipButton:{
    //     width:100,
    //     // backgroundColor: 'gold',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginTop:15,
    //     // height:20,
    // }
});
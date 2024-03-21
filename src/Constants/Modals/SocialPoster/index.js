import { Alert, Image, PermissionsAndroid, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import Modal from 'react-native-modal';
import { Colors } from '../../../Utils';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Share from 'react-native-share';
import { Icon } from 'react-native-elements';
import { Images } from '../../../Assets';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

const SocialPoster = ({ isVisible, setIsVisible, uri, setScreenShotUri }) => {
    const userDetails = useSelector(state => state.UserReducer);
    const full = useRef()
    const [preview, setPreview] = useState('')
    const handleClosed = () => {
        setIsVisible(false);
        setScreenShotUri('')
        setPreview('')
    };
    const handleShare = useCallback(async () => {
        Clipboard.setString('Checkout My Wishlist! https://getgftd.io/wishes/' + userDetails?.id)
        full.current.capture().then(uri => {
            RNFS.readFile(uri, 'base64').then(async uriRes => {
                let urlString = 'data:image/jpeg;base64,' + uriRes;

                const sharedOption = {
                    // url: urlString,
                    // message: ' 🎁 Download getGFTD so we can get GFTing - any time, anywhere 🎁 \n\nDownload Now: https://gftdcamp1.enorness.com/device-checker.html',
                    title: 'Checkout My Wishlist! https://getgftd.io/wishes/' + userDetails?.id,
                    url: `https://getgftd.io/wishes/${userDetails?.id}`,
                    urls: [urlString],
                    // filename:urlString,
                    message : `Checkout My Wishlist! https://getgftd.io/wishes/${userDetails?.id}`,
                    type: 'image/jpeg',
                };
                // console.log(sharedOption);
                try {
                    const result = await Share.open(sharedOption);
                    console.log("result: " + result);
                    if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                            // await handleDownload(urlString)
                        } else {
                            // await handleDownload(urlString)
                            // shared
                        }
                    } else if (result.action === Share.dismissedAction) {
                        setIsVisible(false);
                        // dismissed
                    }
                } catch (error) {
                    console.log('onShare error', error);
                }
            })
        });
    }, [])

    return (
        <View>
            <Modal isVisible={isVisible}
                animationIn={'zoomIn'}
                animationOut={'zoomOut'}
            >
                <View style={{ width: '100%', height: '80%', backgroundColor: Colors.White, justifyContent: "center", padding: 10, borderRadius: 12, overflow: "hidden" }}>
                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: heightPercentageToDP(3), color: Colors.LightestBlue, alignSelf: "center", marginTop: 10, }}>getGFTD</Text>
                    <View style={{ flex: 1.5, padding: 0, alignItems: "center", justifyContent: 'center' }}>
                        <ViewShot ref={full} style={styles.container}>
                            <Image source={Images.shotbackground} style={{
                                width: 300,
                                height: 300,
                                resizeMode: "contain",
                                shadowColor: Colors.Black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.4,
                                shadowRadius: 8,
                                elevation: 10,
                            }} />
                            <Image source={{ uri: uri }} style={{
                                width: Platform.OS == 'android' ? 165 : 165,
                                height: 268,
                                resizeMode: "contain",
                                shadowColor: Colors.Black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.4,
                                shadowRadius: 8,
                                borderRadius: 18,
                                position: "absolute",
                                alignSelf: "flex-end",
                                justifyContent: 'flex-end',
                                top: 17,
                                right: 0,
                                bottom: 0,
                                left: 140,
                                elevation: 10,
                            }} />
                        </ViewShot>
                    </View>
                    <View style={{ flex: .8, alignItems: "center", justifyContent: "space-evenly", borderTopWidth: 1, borderColor: Colors.LightestGrey }}>
                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: heightPercentageToDP(2.5), color: Colors.ThemeColor, alignSelf: "center", marginTop: 10, }}>Share Your Wishlists</Text>
                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: heightPercentageToDP(1.3), color: Colors.Grey, textAlign: "center", }}>Shareable link is copied in clipboard, Please make sure to paste it with your post.</Text>
                        <View style={{ flexDirection: "row", width: widthPercentageToDP(70), justifyContent: "space-evenly", }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity onPress={handleClosed} style={{ width: 50, height: 50, backgroundColor: Colors.LightestBlue, alignItems: "center", justifyContent: "center", borderRadius: 100, }}>
                                    <Icon name='close' color={Colors.White} size={27} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: heightPercentageToDP(1.5), color: Colors.Grey }}>Cancel</Text>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity onPress={handleShare} style={{ width: 50, height: 50, backgroundColor: Colors.LightestBlue, alignItems: "center", justifyContent: "center", borderRadius: 100, }}>
                                    <Icon name='share' color={Colors.White} size={27} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: heightPercentageToDP(1.5), color: Colors.Grey }}>Share</Text>
                            </View>
                        </View>
                    </View>
                    <Pressable style={{ position: "absolute", top: 20, right: 15 }}
                        onPress={handleClosed}
                    >
                        <Icon name="close" color={Colors.LightestBlue} size={30} />
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

export default SocialPoster;

const styles = StyleSheet.create({

});
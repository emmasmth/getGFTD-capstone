import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StatusBar, Image, Platform, PermissionsAndroid, KeyboardAvoidingView, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

// Constants----------------------------------------------------------------
import AppTextArea from '../../../Constants/TextArea';
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';
import Checkbox from '../../../Constants/Checkbox';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Icons } from '../../../Assets';
import { Colors } from '../../../Utils';
import { oreintation } from '../../../Helper/NotificationService';

export default function ShareFeeds({ navigation }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [loading, setloading] = useState(false);
    const [description, setDescription] = useState("");
    const [check, setChecked] = useState(null);

    const [filePath, setFilePath] = useState('');
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log('requestCameraPermission error',err);
                return false;
            };
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log('requestExternalWritePermission error',err);
                alert('Write permission err', err);
            };
            return false;
        } else return true;
    };

    const captureImage = async (type) => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 0.8,
            includeBase64: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    return;
                } else if (response.errorCode == 'permission') {
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                const source = `data:image/jpeg;base64,` + response.assets[0].base64;
                setFilePath(source);
            });
        }
    };
    const chooseFile = (type) => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 0.8,
            includeBase64: true,
        };
        launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                return;
            } else if (response.errorCode == 'permission') {
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            const source = `data:image/jpeg;base64,` + response.assets[0].base64;
            setFilePath(source);
        });
    };

    const postFeed = async () => {
        if (description == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Messge can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        else if (check == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select feed type',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        else {
            const obj = {
                image: filePath,
                title: description,
                privacy: check,
            };
            const apiToken = userDetails?.api_token;
            const data = JSON.stringify(obj);
            await analytics().logEvent('create_feed',{
                image: filePath,
                title: description,
                privacy: check,
            });
            await Service.PostFeeds(data, apiToken, setloading, navigation);
        };
        setDescription("");
        setChecked(null);
        setFilePath('');
    };

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.openDrawer()} leftIcon={Icons.humburger} text="SHARE" />
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView>
                    <View style={{ flex: 1, }}>
                        {filePath == ''
                            ?
                            <>
                                <TouchableWithoutFeedback
                                    onPress={captureImage}
                                >
                                    <View style={{ margin: 20, height: hp(15), width: oreintation == "LANDSCAPE" ? wp('95%'): wp('90%'), backgroundColor: 'rgba(34,169,222,0.15)', borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.LightestBlue, borderRadius: oreintation == "LANDSCAPE" ? wp(1) : wp(2.4), alignItems: 'center', justifyContent: 'center', alignSelf: "center" }} >
                                        <Icon type="ionicon" name="images" size={hp(5)} color={Colors.LightestBlue} />
                                        <Text style={{ fontSize: hp(2), color: Colors.LightestBlue, fontFamily: 'Poppins-Regular' }}>Add Image</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5 }}>
                                    <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row',  }}>
                                        <Icon type="material" name="camera" color={Colors.LightestBlue} size={22} />
                                        <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular' }}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row',  }}>
                                        <Icon type="material" name="image" color={Colors.LightestBlue} size={22} />
                                        <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular' }}>Gallery</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <>
                                <View style={{ margin: 20, height: hp(32), width: wp('90%'), backgroundColor: 'rgba(34,169,222,0.15)', borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.LightestBlue, borderRadius: wp(2.4), alignItems: 'center', justifyContent: 'center', alignSelf: "center" }} >
                                    <Image source={{ uri: filePath }} style={{ width: wp('88%'), height: hp(31), resizeMode: 'contain', borderRadius: 8, }} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5, marginTop: 15, }}>
                                    <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row',  }}>
                                        <Icon type="material" name="camera" color={Colors.LightestBlue} size={22} />
                                        <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', }}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                        <Icon type="material" name="image" color={Colors.LightestBlue} size={22} />
                                        <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', }}>Gallery</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                    </View>
                    <View style={{ flex: 1, }}>
                        <View style={{ alignSelf: 'center' }}>
                            <AppTextArea placeholder="Type your message" value={description} onChangedText={setDescription} />
                        </View>
                        <View style={{ marginHorizontal: oreintation == "LANDSCAPE" ?40 : 30, marginVertical: 10 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Feed Type</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Checkbox setCheck={setChecked} text1="Public" text2="Private" />
                            </View>
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <AppButton loading={loading} onPressed={() => postFeed()} xlarge text="POST TO FEED" />
                        </View>
                    </View>
                    <View style={{ flex: 1, height: 50 }} />
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
});
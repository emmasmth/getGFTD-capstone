
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, TextInput, ActivityIndicator, Image, Platform, PermissionsAndroid, ScrollView, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';

// Constants----------------------------------------------------------------
import AppTextInput from '../../../Constants/TextInput';
import AppTextArea from '../../../Constants/TextArea';
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';
import Checkbox from '../../../Constants/Checkbox';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Icons, Images } from '../../../Assets';
import { Colors } from '../../../Utils';
import { RadioButton } from 'react-native-paper';
import { AuthContext } from '../../../Context';
import FastImage from 'react-native-fast-image';

const theme = {
    // ...DefaultTheme,
    roundness: 2,
    colors: {
        // ...DefaultTheme.colors,
        primary: Colors.LightestBlue,
        accent: Colors.LightestBlue,
    },
};
export default function EditWishes({ navigation, route }) {
    
    const { item } = route.params;
    const userDetails = useSelector(state => state.UserReducer)
    const [filePath, setFilePath] = useState(route.params.item.product_image ? route.params.item.product_image : '')
    const [imagePath, setImagePath] = useState('');
    const [emojiPath, setEmojiPath] = useState('');
    const [itemName, setItemName] = useState(route.params.item.product_name)
    const [itemPrice, setItemPrice] = useState(route.params.item.product_price)
    const [storeName, setStoreName] = useState(route.params.item.store_name)
    const [storeShoutOut, setStoreShoutOut] = useState(route.params.item.shoutout)
    const [description, setDescription] = useState(route.params.item.product_description)
    const [check, setCheck] = useState(null)
    const [checked, setChecked] = useState('')
    const [loading, setloading] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [emojis, setEmojis] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([]);

    const [emojisByCategory, setEmojisByCategory] = useState([]);
    const [emojisByEmojis, setEmojisByEmojis] = useState([]);

    const [query, setQuery] = useState('');
    const [fullData, setFullData] = useState([]);
    const [found, setFound] = useState('');
    const apiToken = userDetails?.api_token;

    const [customTipValue, setCustomTipValue] = useState('');
    const [customTaxValue, setCustomTaxValue] = useState('');
    const [customTax, setCustomTax] = useState(false);
    const [customTip, setCustomTip] = useState(false);
    const [totalPrice, setTotalPrice] = useState('');
    const [tipsOpen, setTipsOpen] = useState(false);
    const [taxOpen, settaxOpen] = useState(false);
    const [value3, setValue3] = useState(route.params.item.product_tax);
    const [value4, setValue4] = useState(route.params.item.product_tip);
    const [tax, setTax] = useState(null);
    const [tip, setTip] = useState(null);
    const { trackData } = useContext(AuthContext);
    const [filteredEmojis, setFilterEmojis] = useState([])

    const onTaxOpen = useCallback(() => {
        setTipsOpen(false);
    }, []);

    const onTipsOpen = useCallback(() => {
        settaxOpen(false);
    }, []);

    const setParmas = async () => {
    }
    useEffect(() => {
        setParmas();

        return () => {
            setImagePath('')
            setFilePath('');
        };
    }, []);

    useFocusEffect(() => {
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Edit Wishes');
    });


    const GetEmojisWithCategory = async () => {
        await Service.GetEmojisWithCategory(setEmojisByCategory, setEmojisByEmojis, setFullData, setloading);
    };


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
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log('requestCameraPermission error', err);
                return false;
            }
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
                console.log('requestExternalWritePermission error', err);
                alert('Write permission err', err);
            }
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
                // console.log('Response = ', response);

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
                setImagePath(source);
                setEmojiPath('');


            });
        };
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
                // alert('User cancelled camera picker');
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
            setImagePath(source);
            setEmojiPath('');

        });
    };

    const chooseEmojis = async () => {
        GetEmojisWithCategory();
        setImagePath('');
        SheetManager.show("emoji_sheet");
        if (!!emojisByCategory) {
            await getEmojisByName('All');
        }
    };

    const getEmojisByName = async (category) => {
        let data;
        data = category == 'All' ? emojisByEmojis : category == 'all' ? emojisByEmojis : emojisByEmojis.filter((item, index) => item.category == category);
        setFilterEmojis(data);
    };

    const search = text => {
        const formattedQuery = text.toLowerCase();
        const filteredData = lodashFilter(fullData, item => {
            return contains(item, formattedQuery);
        });
        setFilterEmojis(filteredData);
        setQuery(text);
        setFound(!!filteredData && `Not found ${text}`)
    };
    const contains = (item, query) => {
        const { name } = item;
        // console.log('lodash filter', name)
        if (name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };

    const handleupdate = async () => {
        if (itemName == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Item name cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (itemPrice == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Item price cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (description == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Item description cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        const obj = {
            product_id: route.params.item.id,
            name: itemName,
            price: itemPrice,
            description: description,
            wish_type: check,
            tax: value3,
            tip: value4,
        };
        if (imagePath != '') {
            Object.assign(obj, { image: imagePath })
        };
        if (emojiPath != '') {
            Object.assign(obj, { emoji: emojiPath })
        };
        if (storeName != '') {
            Object.assign(obj, { store_name: storeName, })
        };
        if (storeShoutOut != '') {
            Object.assign(obj, { shoutout: storeShoutOut, })
        }
        if (route.params.item.store_location != '') {
            Object.assign(obj, { store_location: route.params.item.store_location, })
        };

        const data = JSON.stringify(obj);
        await Service.UpdateItems(data, apiToken, setBtnLoading, navigation);
    };

    const fetchEmojis = async (category) => {
        const data = {
            emojicategory: category ? category : 'all'
        };
        await Service.GetEmojis(data, setEmojis, setFilteredData, setloading);
    };

    // const search = (searchtext) => {
    //     setSearchText(searchtext);
    //     let filteredData = emojis.filter(function (item) {
    //         if (item.name != null) {
    //             return item.name.toLowerCase().includes(searchtext.toLowerCase());
    //         };
    //     });
    //     setFilteredData(filteredData);
    // };

    const taxes = [

        {
            label: '0%',
            value: '0',
        },
        {
            label: '5%',
            value: '5',
        },
        {
            label: '6%',
            value: '6',
        },
        {
            label: '7%',
            value: '7',
        },
        {
            label: '8%',
            value: '8',
        },
        {
            label: '9%',
            value: '9',
        },
        {
            label: '10%',
            value: '10',
        },
        {
            label: 'Custom',
            value: 'Custom',
        },
    ];

    const tips = [

        {
            label: '0%',
            value: '0',
        },
        {
            label: '10%',
            value: '10',
        },
        {
            label: '15%',
            value: '15',
        },
        {
            label: '18%',
            value: '18',
        },
        {
            label: '20%',
            value: '20',
        },
        {
            label: 'Custom',
            value: 'Custom',
        },
    ];


    const getGrandTotal = () => {
        let flag;
        const val1 = Number(value3) / 100 * Number(itemPrice);
        const val2 = Number(value4) / 100 * Number(itemPrice);

        if (value3 > 0 && value4 <= 0) {
            const total = val1;
            flag = total + Number(itemPrice);
            return flag.toFixed(2);
        }
        if (value4 > 0 && value3 <= 0) {
            const total = val2;
            flag = total + Number(itemPrice);
            return flag.toFixed(2);
        }
        if (value3 > 0 && value4 > 0) {
            const total = val1 + val2;
            flag = total + Number(itemPrice);
            return flag.toFixed(2);
        }
        return itemPrice;
    };


    useEffect(() => {
        fetchEmojis()
    }, [])
    // const listing = filteredData && filteredData.length > 0 ? filteredData : emojis;

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="EDIT WISHLIST" rightColor />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <View style={{ flex: .5, backgroundColor: Colors.White, justifyContent: 'center' }}>
                            {filePath == '' ?
                                <>
                                    <TouchableWithoutFeedback onPress={captureImage}>
                                        <View style={{ margin: 20, flexDirection: 'column', backgroundColor: Colors.White, alignItems: 'center', height: hp(5), justifyContent: 'center', shadowRadius: 10, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, borderRadius: 6, elevation: 10 }}>
                                            <Text style={{ color: Colors.Grey, fontSize: hp(1.7), fontFamily: 'Lato-Regular' }}>Upload Image</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5 }}>
                                        <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: 85 }}>
                                            <Icon type="material" name="camera" color={Colors.LightestBlue} size={27} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Lato-Regular' }}>Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: 85 }}>
                                            <Icon type="material" name="image" color={Colors.LightestBlue} size={27} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Lato-Regular' }}>Gallery</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseEmojis} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: 85 }}>
                                            <Image source={Icons.troi} style={{ width: 27, height: 27, resizeMode: 'contain' }} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Lato-Regular' }}>Emojis</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                <>
                                    <View style={{ shadowRadius: 10, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, elevation: 10, width: wp('100%'), height: hp(30), backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <Image source={imagePath ? { uri: imagePath } : { uri: filePath }} style={{ width: wp('100%'), height: hp(30), resizeMode: 'contain', }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5, marginTop: 15, }}>
                                        <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: 85 }}>
                                            <Icon type="material" name="camera" color={Colors.LightestBlue} size={27} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Lato-Regular' }}>Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: 85 }}>
                                            <Icon type="material" name="image" color={Colors.LightestBlue} size={27} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Lato-Regular' }}>Gallery</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseEmojis} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: 85 }}>
                                            <Image source={Icons.troi} style={{ width: 27, height: 27, resizeMode: 'contain' }} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(2), fontFamily: 'Lato-Regular' }}>Emojis</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </View>
                        <View style={{ flex: 1, }}>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={itemName} onChangedText={setItemName} placeholder="Item Name" />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 5 }}>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={{ fontSize: hp(1.7), fontFamily: 'Lato-Regular', color: Colors.Grey }}>Item price</Text>
                                </View>
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={`${itemPrice}`} onChangedText={setItemPrice} num placeholder="Item Price" />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, bottom: -10 }}>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={{ fontSize: hp(1.7), fontFamily: 'Lato-Regular', color: Colors.Grey }}>Tax</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 40 }}>
                                    <Text style={{ fontSize: hp(1.7), fontFamily: 'Lato-Regular', color: Colors.Grey }}>Tip</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', zIndex: 500, }}>
                                <View style={{
                                    alignSelf: 'center', zIndex: Platform.OS != 'android' ? 3000 : 3000, height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                    width: wp('45%'),
                                    paddingVertical: 20,
                                    paddingBottom: 60,
                                    paddingHorizontal: 10,
                                }}>
                                    <DropDownPicker
                                        listMode={Platform.OS == 'android' ? "MODAL" : "SCROLLVIEW"}
                                        scrollViewProps={{
                                            decelerationRate: "fast"
                                        }}
                                        placeholder="Tax"
                                        placeholderStyle={{
                                            color: Colors.Grey,
                                            fontFamily: 'Lato-Regular',
                                            fontSize: hp(1.6),
                                        }}
                                        textStyle={{ color: Colors.Grey, }}
                                        dropDownContainerStyle={{
                                            backgroundColor: "#ffffff",
                                            borderColor: Colors.LightGrey,
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowColor: Colors.Grey,
                                            shadowOpacity: 0.3,
                                            shadowRadius: 10,
                                            elevation: 10,
                                        }}
                                        style={{
                                            backgroundColor: 'white', borderColor: 'transparent',
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowColor: Colors.Grey,
                                            shadowOpacity: 0.3,
                                            shadowRadius: 10,
                                            elevation: 10,
                                            height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
                                            borderWidth: .5, borderColor: Colors.LightestGrey,

                                        }}
                                        onOpen={onTaxOpen}
                                        zIndex={1000}
                                        zIndexInverse={3000}
                                        open={taxOpen}
                                        value={value3}
                                        items={taxes}
                                        setOpen={settaxOpen}
                                        setValue={(e) => {
                                            setValue3(e)
                                            if (e() == 'Custom') {
                                                setCustomTax(true)
                                            }
                                            else { setCustomTax(false) }
                                        }}
                                        setItems={setTax}
                                    />
                                </View>
                                <View style={{
                                    alignSelf: 'center', zIndex: Platform.OS != 'android' ? 3000 : 3000, height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                    width: wp('45%'),
                                    paddingVertical: 20,
                                    paddingBottom: 60,
                                    paddingHorizontal: 10,

                                }}>
                                    <DropDownPicker
                                        listMode={Platform.OS == 'android' ? "MODAL" : "SCROLLVIEW"}
                                        scrollViewProps={{
                                            decelerationRate: "fast"
                                        }}
                                        placeholder="Tip"
                                        placeholderStyle={{
                                            color: Colors.Grey,
                                            fontFamily: 'Lato-Regular',
                                            fontSize: hp(1.6),
                                        }}
                                        textStyle={{ color: Colors.Grey, }}
                                        dropDownContainerStyle={{
                                            backgroundColor: "#ffffff",
                                            borderColor: Colors.LightGrey,
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowColor: Colors.Grey,
                                            shadowOpacity: 0.3,
                                            shadowRadius: 10,
                                            elevation: 10,
                                        }}
                                        style={{
                                            backgroundColor: 'white', borderColor: 'transparent',
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowColor: Colors.Grey,
                                            shadowOpacity: 0.3,
                                            shadowRadius: 10,
                                            elevation: 10,
                                            height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
                                            borderWidth: .5, borderColor: Colors.LightestGrey,

                                        }}
                                        onOpen={onTipsOpen}
                                        zIndex={1000}
                                        zIndexInverse={3000}
                                        open={tipsOpen}
                                        value={value4}
                                        items={tips}
                                        setOpen={setTipsOpen}
                                        setValue={(e) => {
                                            setValue4(e)
                                            if (e() == 'Custom') {
                                                setCustomTip(true)
                                            }
                                            else { setCustomTip(false) }
                                        }}
                                        setItems={setTip}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: customTax && !customTip ? 'flex-start' : customTip && !customTax ? 'flex-end' : customTax && customTip ? 'space-around' : 'space-around', paddingHorizontal: customTax && customTip ? 0 : 20 }}>
                                {customTax && <View style={{
                                    marginVertical: 10,
                                    paddingVertical: 2,
                                    paddingHorizontal: 2,
                                }}>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.6) }}>{`Tax : ${customTaxValue} %`}</Text>
                                    <Slider
                                        style={{ width: wp('40%'), height: 40 }}
                                        minimumValue={0}
                                        maximumValue={100}
                                        minimumTrackTintColor={Colors.LightestBlue}
                                        maximumTrackTintColor={Colors.Grey}
                                        onValueChange={(e) => setCustomTaxValue(e.toFixed(0))}
                                        onSlidingComplete={(e) => {
                                            if (e == 0) {
                                                setValue3(0)
                                            }
                                            else {
                                                setValue3(e)
                                            }
                                        }}
                                    />
                                </View>}
                                {customTip && <View style={{
                                    marginVertical: 10,
                                    paddingVertical: 2,
                                    paddingHorizontal: 2,
                                }}>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.6) }}>{`Tip : ${customTipValue} %`}</Text>
                                    <Slider
                                        style={{ width: wp('40%'), height: 40 }}
                                        minimumValue={0}
                                        maximumValue={100}
                                        minimumTrackTintColor={Colors.LightestBlue}
                                        maximumTrackTintColor={Colors.Grey}
                                        onValueChange={(e) => setCustomTipValue(e.toFixed(0))}
                                        onSlidingComplete={(e) => {
                                            setTip(e)
                                            if (e == 0) {
                                                setValue4(0)
                                            }
                                            else {
                                                setValue4(e)
                                            }
                                        }}
                                    />
                                </View>}
                            </View>
                            <View style={{ alignSelf: 'center', zIndex: -1 }}>
                                <AppTextInput editable onChangedText={setTotalPrice} dollar
                                    value={`${getGrandTotal() != '' ? '$ ' + getGrandTotal() : ''}`}
                                    placeholder="Total Price" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={storeName} onChangedText={setStoreName} placeholder="Store Name" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={storeShoutOut} onChangedText={setStoreShoutOut} placeholder="Store Shout-Out" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextArea value={description} onChangedText={setDescription} placeholder="Description" xmedium />
                            </View>
                            <View style={{ marginHorizontal: 10, marginVertical: 10, paddingLeft: 10 }}>
                                <Text style={{ paddingHorizontal: 10, paddingBottom: 5, fontFamily: 'Lato-Regular', fontSize: hp(1.7), color: Colors.Grey }}>{'Wish Type'}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.checkLists}>
                                        <RadioButton.Android
                                            theme={theme}
                                            uncheckedColor={Colors.Grey}
                                            value="first"
                                            status={checked === 'first' ? 'checked' : 'unchecked'}
                                            onPress={() => { setChecked('first'), setCheck(1) }}
                                            // size={10}
                                            style={{ width: 8, height: 8, }}
                                        />
                                        <Text style={styles.textStyle}>{'One Time'}</Text>
                                        <RadioButton.Android
                                            theme={theme}
                                            uncheckedColor={Colors.Grey}
                                            value="first"
                                            status={checked === 'second' ? 'checked' : 'unchecked'}
                                            onPress={() => { setChecked('second'), setCheck(2) }}
                                            // size={10}
                                            style={{ width: 8, height: 8, }}
                                        />
                                        <Text style={styles.textStyle}>{'Recurring'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppButton onPressed={handleupdate} loading={btnLoading} text="UPDATE WISHLIST" xlarge />
                            </View>
                        </View>
                        <View style={{ flex: 1, height: 50 }} />
                    </ScrollView>
                </View>
                <ActionSheet id="emoji_sheet">
                    <View style={{ height: hp(70) }}>
                        <View style={{ width: hp(6), borderWidth: wp(.7), borderColor: Colors.Grey, borderRadius: 8, alignSelf: 'center', margin: 8 }} />
                        <>
                            <View>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={emojisByCategory}
                                    keyExtractor={(it, ind) => ind + 1}
                                    renderItem={(ite, index) => {
                                        const { item } = ite;
                                        return (
                                            <TouchableOpacity onPress={() => getEmojisByName(item.category_name)}>
                                                <View
                                                    style={{
                                                        width: 75,
                                                        height: 110,
                                                        borderRadius: 100 / 2,
                                                        backgroundColor: Colors.Wheat,
                                                        padding: 5,
                                                        margin: 15,
                                                        alignItems: 'center',
                                                        justifyContent: 'space-evenly'
                                                    }}>
                                                    <View style={{
                                                        width: 50,
                                                        height: 50,
                                                        backgroundColor: Colors.White,
                                                        borderRadius: 100 / 2,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        shadowRadius: 10,
                                                        shadowColor: Colors.Grey,
                                                        shadowOpacity: 0.3,
                                                        shadowOffset: { width: 0, height: 8 },
                                                        elevation: 30,
                                                    }}>
                                                        <FastImage
                                                            style={{ width: 40, height: 40 }}
                                                            source={{
                                                                uri: `${item.category_url}`,
                                                                priority: FastImage.priority.normal,
                                                            }}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                    </View>
                                                    <Text style={{ fontSize: hp(1), textAlign: 'center', color: Colors.Charcol, fontFamily: 'Poppins-Semibold' }} >{item.category_name.toUpperCase()}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
                                <View style={styles.searchBarContainer}>
                                    <View style={styles.searchBarItems}>
                                        <TextInput style={styles.searchBar} value={query} placeholder='Search...' onChangeText={search} placeholderTextColor={Colors.Grey} />
                                    </View>
                                </View>
                            </View >
                            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
                                {!loading ?
                                    filteredEmojis.length > 0
                                        ?
                                        <FlatList
                                            // horizontal={true}
                                            data={filteredEmojis}
                                            numColumns={2}
                                            keyExtractor={(item, index) => index}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => {
                                                            // console.log(item.url)
                                                            let path = item.url && item.url.split('https://getgftd.io/storage/')[1];
                                                            setEmojiPath(path)
                                                            setFilePath(item.url)
                                                            if (item.url) SheetManager.hide('emoji_sheet')
                                                        }}>
                                                        <View style={{ margin: 10, padding: 10, width: 150, height: 220, justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.White, borderWidth: 1, borderColor: Colors.Charcol, borderRadius: 8, shadowColor: Colors.Grey, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10, elevation: 10, }} >
                                                            <FastImage
                                                                style={{ width: 100, height: 150, }}
                                                                source={{
                                                                    uri: `${item.url}`,
                                                                    priority: FastImage.priority.normal,
                                                                }}
                                                                resizeMode={FastImage.resizeMode.contain}
                                                            />
                                                            <Text style={{ fontSize: hp(1.3), color: Colors.Charcol, textAlign: 'center', fontFamily: 'Poppins-Medium' }}>{item?.name.toUpperCase()}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                        :
                                        <View style={{ flex: .8, alignItems: 'center', justifyContent: 'center' }} >
                                            <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(2) }}>Not found</Text>
                                        </View>
                                    :
                                    <View style={{ flex: .8, alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator size="large" color={Colors.LightestBlue} />
                                    </View>
                                }
                            </ScrollView>
                        </>
                    </View>
                </ActionSheet>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },

    searchBarContainer: {
        width: "100%",
        height: hp(8),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchBarItems: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
        paddingHorizontal: 5,
        borderWidth: .5,
        borderColor: Colors.LightestGrey

    },
    searchBar: {
        width: wp('90%'),
        height: 45,
        paddingHorizontal: 15,
        fontFamily: 'Lato-Regular',
    },
    searchFilterContainer: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    productContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.White,
    },

    checkLists: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Lato-Regular',
    }
})
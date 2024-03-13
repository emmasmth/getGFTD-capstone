import React, { useState, useEffect, useCallback, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, PermissionsAndroid, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import analytics from '@react-native-firebase/analytics';
import Modal from "react-native-modal";
import { SvgUri } from 'react-native-svg';

// Constants----------------------------------------------------------------
import AppTextInput from '../../../Constants/TextInput';
import AppTextArea from '../../../Constants/TextArea';
import AppHeader from '../../../Constants/Header';
import Checkbox from '../../../Constants/Checkbox';

import AppButton from '../../../Constants/Button';
import filter from 'lodash.filter';
import DateTimePickerModal from "react-native-modal-datetime-picker";


// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Icons, Images } from '../../../Assets';
import { Colors } from '../../../Utils';
import { async } from 'jshint/src/prod-params';
import DropDownPicker from 'react-native-dropdown-picker';
import { useIsFocused } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import FastImage from 'react-native-fast-image';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';
// import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Adjust, AdjustEvent } from 'react-native-adjust';
import { addwishlistdata } from '../../../Redux/WishlistReducer';
import { scale } from 'react-native-size-matters';
// import Orientation from 'react-native-orientation';

const theme = {
    // ...DefaultTheme,
    roundness: 2,
    colors: {
        // ...DefaultTheme.colors,
        primary: Colors.LightestBlue,
        accent: Colors.LightestBlue,
    },
};


export default function AddWish({ navigation }) {
    const dispatch = useDispatch()
    // const getWishlist = useSelector(state => state.WishlistReducer);
    const isFocused = useIsFocused();
    const { trackData } = useContext(AuthContext);
    const userDetails = useSelector(state => state.UserReducer);
    // const setWishlist = (data) => dispatch(addwishlistdata(data));

    const [myWishlist, setMyWishlist] = useState([])

    const apiToken = userDetails?.api_token;
    const lodashFilter = filter;
    const [filePath, setFilePath] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [emojiPath, setEmojiPath] = useState('');
    const [check, setCheck] = useState(null);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [storeName, setStoreName] = useState('');
    const [storeLocation, setStoreLocation] = useState('');
    const [storeShoutOut, setStoreShoutOut] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setloading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [emojis, setEmojis] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [emojisByCategory, setEmojisByCategory] = useState([]);
    const [emojisByEmojis, setEmojisByEmojis] = useState([]);
    const [catOpen, setCatOpen] = useState(false)
    const [items, setItems] = useState([]);
    const [value1, setValue1] = useState(null);
    const [checked, setChecked] = useState('');
    const [customTipValue, setCustomTipValue] = useState('');
    const [customTaxValue, setCustomTaxValue] = useState('');
    const [customTax, setCustomTax] = useState(false);
    const [customTip, setCustomTip] = useState(false);
    const [totalPrice, setTotalPrice] = useState('');
    const [tipsOpen, setTipsOpen] = useState(false);
    const [taxOpen, settaxOpen] = useState(false);
    const [value3, setValue3] = useState('0');
    const [value4, setValue4] = useState('0');
    const [tax, setTax] = useState(null);
    const [tip, setTip] = useState(null);
    const [query, setQuery] = useState('');
    const [fullData, setFullData] = useState([]);
    const [found, setFound] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false)
    const [firstWish, setFirstWish] = useState(false)


    const [filteredEmojis, setFilterEmojis] = useState([])
    const [highlighted1, setHighlighted1] = useState(false);
    const [highlighted2, setHighlighted2] = useState(false);
    const [highlighted3, setHighlighted3] = useState(false);
    const [highlighted4, setHighlighted4] = useState(false);
    const [highlighted5, setHighlighted5] = useState(false);
    const [highlighted6, setHighlighted6] = useState(false);
    const [highlighted7, setHighlighted7] = useState(false);
    const [highlighted8, setHighlighted8] = useState(false);
    const [emojiModalVisible, setEmojiModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    // console.log(userDetails)

    const [myFFullData, setMYFFullData] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [myFriends, setMyFriends] = useState([]);
    const onTaxOpen = useCallback(() => {
        setTipsOpen(false);
    }, []);

    const onTipsOpen = useCallback(() => {
        settaxOpen(false);
    }, []);

    const handleDate = () => {
        setOpen(true);
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
        setEmojiPath('');
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
                    // alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    // alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
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
        setEmojiPath('');
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
            setImagePath(source);
            setEmojiPath('');
        });
    };

    const chooseEmojis = async () => {
        GetEmojisWithCategory();
        setImagePath('');
        // SheetManager.show("emoji_sheet");
        if (emojisByCategory) {
            setEmojiModal(true);
        }
    };

    const unmount = async () => {
        setFilePath('');
        setItemName('');
        setItemPrice('');
        setStoreName('');
        setEventName('');
        setEventDate('');
        setStoreShoutOut('');
        setStoreLocation('');
        setDescription('');
        setValue1(null)
        setValue4('0')
        setValue3('0')
        setChecked('');
        setCheck(null);
        setQuery('')
    };

    const adjustEvent = new AdjustEvent('dgvtc4')

    const handleAdd = async () => {
        if (filePath == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Item image is required',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted1(true)
            return false;
        }
        if (itemName == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please enter item name',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted2(true)
            return false;
        }
        if (itemPrice == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please enter item price',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
                // onHide: () => setHighlighted(itemPrice == '' ? true: false),
            });
            setHighlighted3(true)
            return false;
        }

        if (value1 == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select wishlist',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted5(true)
            return false;
        }
        if (check == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select wish type',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted4(true)

            return false;
        }
        if (description == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please enter item description',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted6(true)
            return false;
        }
        if (eventName !== '' && eventDate == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select event date',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted8(true)
            return false;
        }
        if (eventDate !== '' && eventName == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select event name',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted7(true)
            return false;
        }
        const obj = {
            name: itemName.trim(),
            price: itemPrice.trim(),
            description: description,
            wish_type: check,
            wishlist_id: value1,
            tax: value3,
            tip: value4,
        };

        if (storeName != '') {
            Object.assign(obj, { store_name: storeName, })
        }
        if (storeLocation != '') {
            Object.assign(obj, { store_location: storeLocation, })
        }
        if (storeShoutOut != '') {
            Object.assign(obj, { shoutout: storeShoutOut, })
        }
        if (emojiPath != '') {
            Object.assign(obj, { emoji: emojiPath })
        }
        if (imagePath != '') {
            Object.assign(obj, { image: imagePath })
        }
        if (eventDate != '' && eventName != '') {
            Object.assign(obj, { event_name: eventName, event_date: eventDate })
        }

        analytics().logAddToWishlist({
            currency: "USD",
            value: Number(itemPrice),
            items: [{
                item_id: `${value1}`,
                item_name: itemName,
                item_category: 'Wishlist',
                quantity: 1,
                price: Number(itemPrice),
            }],
        });

        await analytics().logEvent('add_items', {
            name: itemName.trim(),
            price: itemPrice.trim(),
            description: description,
            wish_type: check,
            wishlist_id: value1,
            tax: value3,
            tip: value4,
        });
        Adjust.trackEvent(adjustEvent);
        const data = JSON.stringify(obj);

        // console.log('Add Items', data)
        await Service.AddItems(data, apiToken, setBtnLoading, navigation, unmount, myWishlist);

        if (myWishlist.length > 0) {
            setFirstWish(false)
        }
        else {
            setFirstWish(true)
        }
    };


    const fetchEmojis = async (category) => {
        const data = {
            emojicategory: category ? category : 'all'
        };
        await Service.GetEmojis(data, setEmojis, setFilteredData, setloading);
    };
    const GetEmojisWithCategory = async () => {
        await Service.GetEmojisWithCategory(setEmojisByCategory, setEmojisByEmojis, setFullData, setloading);
    };

    useEffect(() => {
        getEmojisByName('all');
    }, [emojisByEmojis]);

    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();
        const filteredData = lodashFilter(fullData, item => {
            return contains(item, formattedQuery);
        });
        setFilterEmojis(filteredData.sort((a, b) => a.name.localeCompare(b.name, "en-US", { numeric: false })));

        setQuery(text);
        setFound(!!filteredData && `Not found ${text}`)
    };
    const contains = (item, query) => {
        const { name } = item;
        if (name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };


    const getEmojisByName = async (category) => {
        let data;
        data = category == 'all' ? emojisByEmojis : category == 'all' ? emojisByEmojis : emojisByEmojis.filter((item, index) => item.category == category);
        setFilterEmojis(data.sort((a, b) => a.name.localeCompare(b.name)));
        console.log("Filtered emojies", filteredEmojis);
    };

    const ShowWishlists = async () => {
        if (!!apiToken) await Service.ShowWishlists(apiToken, setWishlists, setloading);
    };


    async function fetchList(id) {
        if (!!id) await Service.GetWishlistsByUserIdWishId(userDetails.id, id, apiToken, setMyWishlist, setloading, setRefresh);
    };

    const GetBankAccounts = async () => {
        if (!!apiToken) await Service.ShowbankDetails(apiToken, setBankAccounts, setloading);
    };
    const fetchMyFriends = async () => {
        await Service.GetFriendlist(apiToken, setMyFriends, setMYFFullData, setloading);
    };

    useEffect(() => {
        fetchList('0');
        fetchEmojis()
        ShowWishlists();
        GetBankAccounts()
        fetchMyFriends()
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Add Wish');

        return () => {
            // GetEmojisWithCategory()
            fetchEmojis()
            ShowWishlists();
            unmount()
        };

    }, [isFocused]);


    let wishlistArr = wishlists.map((item, index) => ({
        label: item.title,
        value: item.id,
    }));

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


    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="ADD WISH" rightColor />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: .5, backgroundColor: Colors.White, justifyContent: 'center' }}>
                            {filePath == '' ?
                                <>
                                    <TouchableWithoutFeedback
                                        onPress={captureImage}
                                    >
                                        <View style={{ margin: 20, height: hp(15), width: oreintation == "LANDSCAPE" ? wp('95%') : wp('90%'), backgroundColor: 'rgba(34,169,222,0.15)', borderWidth: 2, borderStyle: 'dashed', borderColor: highlighted1 == true ? 'red' : Colors.LightestBlue, borderRadius: oreintation == "LANDSCAPE" ? wp(1) : wp(2.4), alignItems: 'center', justifyContent: 'center', alignSelf: "center", shadowColor: Colors.LightestBlue, shadowOffset: { width: 0, height: 10, }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 50, }} >
                                            <Icon type="ionicon" name="images" size={hp(5)} color={Colors.LightestBlue} />
                                            <Text style={{ fontSize: hp(2), color: Colors.LightestBlue, fontFamily: 'Poppins-Regular' }}>Add Image</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5 }}>
                                        <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="camera" color={Colors.LightestBlue} size={22} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', marginStart: 5 }}>Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="image" color={Colors.LightestBlue} size={22} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', marginStart: 5 }}>Gallery</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseEmojis} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Image source={Icons.troi} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', marginStart: 5 }}>Emojis</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                <>
                                    <View style={{ margin: 20, height: hp(32), width: wp('90%'), alignItems: 'center', justifyContent: 'center', alignSelf: "center" }} >

                                        {filePath.includes("svg") ? <SvgUri
                                            width={wp('88%')}
                                            height={hp(31)}
                                            uri={`${filePath}`}
                                            style={{resizeMode:"contain"}}
                                        /> :
                                            <Image source={{ uri: filePath }} style={{ width: wp('88%'), height: hp(31), resizeMode: 'contain', borderRadius: 8, }} />
                                        }
                                        <View style={{ position: 'absolute', zindex: 2, right: -5, top: -10, backgroundColor: Colors.LightGrey, borderRadius: 100 }}>
                                            <Icon type="material" name="close" onPress={() => setFilePath('')} color="black" />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5, marginTop: 15, }}>
                                        <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="camera" color={Colors.LightestBlue} size={22} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="image" color={Colors.LightestBlue} size={22} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseEmojis} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Image source={Icons.troi} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <AppTextInput highlighted={highlighted2} setHighlighted={setHighlighted2} value={itemName} onChangedText={setItemName} placeholder="Enter Name of Item" />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <AppTextInput highlighted={highlighted3} setHighlighted={setHighlighted3} dd value={itemPrice} num onChangedText={setItemPrice} placeholder="Price of Item" />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: oreintation == "LANDSCAPE" ? 30 : 20, bottom: -10 }}>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={{ fontSize: hp(1.7), fontFamily: 'Poppins-Regular', color: Colors.Grey }}>Tax</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: oreintation == "LANDSCAPE" ? 100 : 40 }}>
                                <Text style={{ fontSize: hp(1.7), fontFamily: 'Poppins-Regular', color: Colors.Grey }}>Tip</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', zIndex: 500, }}>
                            <View style={{
                                alignSelf: 'center', zIndex: Platform.OS != 'android' ? 3000 : 3000, height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                width: oreintation == "LANDSCAPE" ? wp('48%') : wp('45%'),
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
                                paddingHorizontal: oreintation == "LANDSCAPE" ? 10 : 5,
                            }}>
                                <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.6) }}>{`Tax : ${customTaxValue} %`}</Text>
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
                                paddingHorizontal: oreintation == "LANDSCAPE" ? 20 : 5,
                            }}>
                                <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.6) }}>{`Tip : ${customTipValue} %`}</Text>
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
                            <View style={{
                                alignSelf: 'center', zIndex: Platform.OS != 'android' ? 3000 : 3000,
                                height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                width: oreintation == "LANDSCAPE" ? wp('95%') : wp('90%'),
                                // paddingHorizontal: 10,
                                marginVertical: 8,
                                // borderWidth:.2,
                            }}>
                                <DropDownPicker
                                    listMode={Platform.OS == 'android' ? "MODAL" : "SCROLLVIEW"}
                                    scrollViewProps={{
                                        decelerationRate: "fast"
                                    }}

                                    dropDownContainerStyle={{
                                        backgroundColor: "#ffffff",
                                        // borderWidth:.6,
                                        borderColor: Colors.LightGrey,
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowColor: Colors.Grey,
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                        elevation: 10,
                                    }}
                                    placeholder="Select Wishlist"
                                    placeholderStyle={{
                                        color: Colors.Grey,
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp(1.6),
                                    }}
                                    textStyle={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), }}
                                    style={{
                                        backgroundColor: 'white',
                                        borderColor: highlighted5 == true ? 'red' : 'transparent',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowColor: Colors.Grey,
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                        elevation: 10,
                                        height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
                                        fontFamily: 'Poppins-Regular'
                                    }}
                                    open={catOpen}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                    value={value1}
                                    setValue={async e => {
                                        setValue1(e);
                                        setHighlighted5(false)
                                    }}
                                    items={wishlistArr}
                                    setOpen={setCatOpen}
                                    setItems={setItems}
                                />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={storeName} onChangedText={setStoreName} placeholder="Store Name (optional)" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={storeLocation} onChangedText={setStoreLocation} placeholder="Store Website (www.example.com)" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput value={storeShoutOut} onChangedText={setStoreShoutOut} placeholder="Store Shout-Out" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput highlighted={highlighted7} setHighlighted={setHighlighted7} value={eventName} onChangedText={setEventName} placeholder="Event Name" />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextInput editable={false} highlighted={highlighted8} setHighlighted={setHighlighted8} placeholder="Event Date (YYYY-MM-DD)" value={eventDate} icon2 icon2Pressed={handleDate} validation onChangedText={setEventDate} />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppTextArea highlighted={highlighted6} setHighlighted={setHighlighted6} value={description} onChangedText={setDescription} placeholder="Item Description" xmedium />
                            </View>
                            <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                                <Text style={{ paddingHorizontal: 5, paddingBottom: 5, fontFamily: 'Poppins-Regular', fontSize: hp(1.7), color: highlighted4 == true ? 'red' : Colors.Grey }}>{'Wish Type'}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.checkLists}>
                                        <RadioButton.Android
                                            theme={theme}
                                            uncheckedColor={Colors.Grey}
                                            value="first"
                                            status={checked === 'first' ? 'checked' : 'unchecked'}
                                            onPress={() => { setChecked('first'), setCheck(1), setHighlighted4(false) }}
                                            // size={10}
                                            style={{ width: 8, height: 8, }}
                                        />
                                        <Text style={styles.textStyle}>{'One Time'}</Text>
                                        <RadioButton.Android
                                            theme={theme}
                                            uncheckedColor={Colors.Grey}
                                            value="first"
                                            status={checked === 'second' ? 'checked' : 'unchecked'}
                                            onPress={() => { setChecked('second'), setCheck(2), setHighlighted4(false) }}
                                            // size={10}
                                            style={{ width: 8, height: 8, }}
                                        />
                                        <Text style={styles.textStyle}>{'Recurring'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <AppButton onPressed={handleAdd} loading={btnLoading} text="ADD WISH" xlarge />
                            </View>
                        </View>
                    </ScrollView>
                    <Modal
                        animationIn={'zoomIn'}
                        animationOut={"zoomOut"}
                        backdropColor='rgba(0,0,0,0.3)'
                        isVisible={firstWish}
                        onRequestClose={() => {
                            setVerifiedVisible(!setFirstWish);
                        }}>
                        <View style={{
                            top: -40,
                            justifyContent: 'space-between',
                            padding: wp(5),
                            borderRadius: 20,
                            width: wp('85%'),
                            height: hp(55),
                            alignSelf: 'center',
                            backgroundColor: Colors.White,
                            elevation: 10,
                            shadowOffset: { width: 0, height: 8 },
                            shadowColor: Colors.Grey,
                            shadowRadius: 10,
                            shadowOpacity: 0.3,
                        }}>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                                <Image source={Images.verified} style={{ height: 150, width: 150, resizeMode: "stretch", borderRadius: 8, }} />
                                <View>
                                    <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-SemiBold', fontSize: hp(3.5), textAlign: "center", }}>
                                        GREAT!
                                    </Text>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2.5), textAlign: "center", }}>
                                        YOU JUST ADDED YOUR 1st WISH
                                    </Text>
                                </View>
                                <View style={{ flex: .8, justifyContent: "space-evenly", }}>
                                    {myFriends.length > 0 ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFirstWish(false);
                                                navigation.goBack()
                                            }}
                                            style={{
                                                backgroundColor: Colors.LightestBlue,
                                                width: wp(70),
                                                height: hp(6),
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 8
                                            }}
                                        >
                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.White }}>Continue</Text>
                                        </TouchableOpacity>
                                        : <TouchableOpacity
                                            onPress={() => {
                                                setFirstWish(false);
                                                navigation.navigate('FindFriend', { profileImage: userDetails.image, route_to: 'ADD FRIENDS' })
                                            }}
                                            style={{
                                                backgroundColor: Colors.LightestBlue,
                                                width: wp(70),
                                                height: hp(6),
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 8
                                            }}
                                        >
                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.White }}>ADD FRIEND</Text>
                                        </TouchableOpacity>}
                                    {bankAccounts.length > 0 ? null : <TouchableOpacity disabled={true} style={{ backgroundColor: Colors.LightestGrey, width: wp(70), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Charcol }}>CONNECT A BANK ACCOUNT</Text>
                                    </TouchableOpacity>}
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <Modal
                    animationIn={'zoomIn'}
                    animationOut={"zoomOut"}
                    // backdropColor='rgba(0,0,0,0.3)'
                    isVisible={emojiModalVisible}>
                    <View style={{
                        backgroundColor: Colors.White,
                        marginTop: scale(15),
                        flex: 1,
                        borderRadius: 12
                    }}>
                        <Text style={{ margin: 20, marginBottom: 10, textAlign: "center", color: Colors.ThemeColor, fontFamily: "Poppins-SemiBold", fontSize: hp(2) }}>Select a Emoji</Text>
                        <View style={{ position: "absolute", right: 10, top: 10, }}>
                            <Icon name="close" size={22} onPress={() => setEmojiModal(!emojiModalVisible)} />
                        </View>
                        <View style={{ marginStart: 15, marginBottom: 10, }}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                // data={emojisByCategory.sort((a, b) => a.category_name[0].localeCompare(b.category_name[0]))}
                                data={emojisByCategory}
                                keyExtractor={(it, ind) => it?.id}
                                renderItem={(ite, index) => {
                                    const { item } = ite;
                                    return (
                                        <TouchableOpacity key={ite.category_name} onPress={() => getEmojisByName(item.category_name)}>
                                            <View
                                                style={{
                                                    width: 60,
                                                    height: 90,
                                                    borderRadius: 100 / 2,
                                                    backgroundColor: Colors.Wheat,
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 7,
                                                    margin: 5,
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                <Text style={{ fontSize: 6, textAlign: 'center', color: Colors.Charcol, fontFamily: 'Poppins-SemiBold' }} >{item.category_name.toUpperCase()}</Text>
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
                                                    elevation: 10,
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
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                        <View style={{ flex: 0, backgroundColor: Colors.ThemeColor, alignItems: 'center', }}>
                            <View style={styles.searchBarContainer}>
                                <View style={styles.searchBarItems}>
                                    <TextInput style={styles.searchBar} value={query} placeholder='Search...' onChangeText={handleSearch} placeholderTextColor={Colors.Grey} />
                                </View>
                            </View>
                        </View >
                        <View style={{ flex: 1, }}>
                            {!loading ?
                                filteredEmojis.length > 0
                                    ?
                                    <FlatList
                                        data={filteredEmojis}
                                        numColumns={2}
                                        contentContainerStyle={{ alignItems: "center" }}
                                        keyExtractor={(item, index) => item?.id}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    key={item?.name}
                                                    onPress={() => {
                                                        let path = item.url && item.url.split('https://getgftd.io/storage/')[1];
                                                        setEmojiPath(path)
                                                        setFilePath(item.url)
                                                        if (item.url) setEmojiModal(false)
                                                    }}>
                                                    <View style={{ margin: 10, padding: 10, width: 140, height: 200, justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.White, borderWidth: 1, borderColor: Colors.ThemeColor, borderRadius: 8, shadowColor: Colors.Grey, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10, elevation: 10, }} >
                                                        {
                                                            item.url.includes("svg") ?
                                                                <SvgUri
                                                                    width={100}
                                                                    height={150}
                                                                    uri={`${item.url}`}
                                                                />
                                                                :
                                                                <FastImage
                                                                    style={{ width: 100, height: 150, }}
                                                                    source={{
                                                                        uri: `${item.url}`,
                                                                        priority: FastImage.priority.normal,
                                                                    }}
                                                                    resizeMode={FastImage.resizeMode.contain}
                                                                />}
                                                        <Text style={{ fontSize: hp(1.3), color: Colors.ThemeColor, textAlign: 'center', fontFamily: 'Poppins-SemiBold' }}>{item?.name.toUpperCase()}</Text>
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
                        </View>
                    </View>
                </Modal>
                <DateTimePickerModal
                    isVisible={open}
                    mode="date"
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        setEventDate(moment(date).format('YYYY-MM-DD'))
                        if (!!date) setHighlighted7(false)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
            </KeyboardAvoidingView>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    searchBarContainer: {
        width: "90%",
        height: hp(7),
        // backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchBarItems: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
        paddingHorizontal: 5,
        borderWidth: .5,
        borderColor: Colors.LightestGrey
    },
    searchBar: {
        width: wp('75%'),
        height: 45,
        paddingHorizontal: 15,
        fontFamily: 'Poppins-Regular',
        color: Colors.Grey,
        // backgroundColor:"white"
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
        fontFamily: 'Poppins-Regular',
    }
})
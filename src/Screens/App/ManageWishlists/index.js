import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, FlatList, Platform, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import moment from "moment";
import Toast from 'react-native-toast-message';

// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Icons, Images } from '../../../Assets';
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';

// Stats----------------------------------------------------------------
import { addfeedlistdata } from '../../../Redux/FeedsReducer';
import Checkbox from '../../../Constants/Checkbox';
import AppTextInput from '../../../Constants/TextInput';
import { RadioButton } from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';


const theme = {
    // ...DefaultTheme,
    roundness: 2,
    colors: {
        // ...DefaultTheme.colors,
        primary: Colors.LightestBlue,
        accent: Colors.LightestBlue,
    },
};
const FilterButtons = ({ resetFilter, applyFilter, loading }) => {
    return (
        <View style={styles.section3} >
            <TouchableOpacity onPress={resetFilter}>
                <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
                    <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
                        Cancel
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilter}>
                <View style={styles.buttonStyle}>
                    {!loading ? <Text style={styles.buttonTextStyle}>
                        {'Update'}
                    </Text>
                        :
                        <ActivityIndicator size="small" color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

function Wishlists({ loading, setChecked, setPrivacy, deleteLoading, _wishlists, setIsVisible, isVisible, setWishId, wishId, onEdit, handleDelete }) {

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: Colors.White }}>
            {!loading ?
                _wishlists.length > 0
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={true}
                        data={_wishlists.sort((a, b) => a.title.localeCompare(b.title))}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: Colors.LightGrey, marginVertical: 10, paddingBottom: 10 }}>
                                    <View style={{ flex:oreintation == 'LANDSCAPE' ?3: 2, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                        <Text numberOfLines={1} style={{ fontSize: hp(2.5), color: Colors.Charcol, fontFamily: 'Poppins-SemiBold' }}>{item.title ? item.title : '--'}</Text>
                                        <View style={{ backgroundColor: Colors.LightestBlue, width: 20, height: 20, borderRadius: 100 / 2, alignItems: 'center', justifyContent: 'center', marginStart: 10 }}>
                                            <Text style={{ fontSize: hp(1.5), color: Colors.White, fontFamily: 'Poppins-SemiBold' }}>{item.total_items ? item.total_items : '0'}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: oreintation == 'LANDSCAPE' ? .3:.5, flexDirection: 'row', alignItems: 'flex-end', justifyContent: "space-evenly", }}>
                                        <Icon name="edit" onPress={() => { setIsVisible(!isVisible), setWishId(item.id), onEdit(item.title), setChecked(item.privacy == 1 ? 'first' : 'second'), setPrivacy(item.privacy) }} color={Colors.Blue} />
                                        {item.id == wishId && deleteLoading
                                            ?
                                            <ActivityIndicator size="small" color={Colors.LightestBlue} />
                                            :
                                            <Icon name="delete" onPress={() => { handleDelete(item.id), setWishId(item.id) }} color={Colors.Charcol} />
                                        }
                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={(key, index) => index}
                    /> :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: hp(2), color: Colors.DelightBlue, fontFamily:"Poppins-Regular" }}>No Wishlists Yet.</Text>
                    </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.LightestBlue} />
                </View>
            }
        </View >
    );
};

export default function ManageWishlists(props) {
    const isFocus = useIsFocused();
    const userDetails = useSelector(state => state.UserReducer);
    const [loading, setloading] = useState(false);
    const [btnLoading, setBtnloading] = useState(false);
    const [deleteLoading, setDeleteloading] = useState(false);

    const apiToken = userDetails.api_token;
    const {trackData} = useContext(AuthContext);


    const [wishlists, setWishlists] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [wishlistsValue, onEdit] = useState('');
    const [wishId, setWishId] = useState('');
    const [privacy, setPrivacy] = useState(0)
    const [checked, setChecked] = useState('')

    const ShowWishlists = async () => {
        await Service.ShowWishlists(apiToken, setWishlists, setloading);
    };

    useEffect(() => {
        ShowWishlists();
       if(!!apiToken) trackData(apiToken, 'Page Viewed', 'Manage Wishlists');

    }, [isFocus]);

    const handleLeft = () => {
        props.navigation.goBack();
    };

    const handleDelete = async (id) => {
        const obj = {
            wishlist_id: id,
        };
        await analytics().logEvent('delete_wishlists', {
            wishlist_id: id,
        });
        const data = JSON.stringify(obj);
        await Service.DeleteWishlists(data, apiToken, setDeleteloading, ShowWishlists);
    };

    const handleContinue = async () => {
        if (wishlistsValue == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please Enter Wishlist title',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (checked == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select privacy',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }

        const obj = {
            wishlist_id: wishId,
            wishlist_title: wishlistsValue,
            privacy: privacy
        };

        const data = JSON.stringify(obj);

        await analytics().logEvent('update_wishlists', {
            wishlist_id: wishId,
            wishlist_title: wishlistsValue,
            privacy: privacy
        });

        await Service.EditWishlists(data, apiToken, setBtnloading, setIsVisible, ShowWishlists);
    };

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={handleLeft} leftIcon={Icons.backarrow} text="MANAGE WISHLISTS" />
                <Wishlists setChecked={setChecked} setPrivacy={setPrivacy} loading={loading} deleteLoading={deleteLoading} _wishlists={wishlists} handleDelete={handleDelete} onEdit={onEdit} setIsVisible={setIsVisible} isVisible={isVisible} setWishId={setWishId} wishId={wishId} />
            </View>
            <Modal animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(!isVisible);
                }}>
                <View style={{
                    justifyContent: 'space-between',
                    top: hp(20),
                    padding: wp(5),
                    width: wp('85%'),
                    height: oreintation == 'LANDSCAPE' ?hp(50) :hp(40),
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    elevation: 10,
                    shadowOffset: { width: 0, height: 8 },
                    shadowColor: Colors.Grey,
                    shadowRadius: 10,
                    shadowOpacity: 0.3,
                    borderRadius: 8,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...oreintation == 'LANDSCAPE' ?{marginTop:-20} : null
                    }} >
                        <Text style={{
                            fontSize: hp(2.5),
                            color: Colors.Grey,
                            fontFamily: 'Poppins-SemiBold'
                        }}>Edit Wishlist</Text>
                        <Icon type="material" name="close" color={Colors.Grey} onPress={() => setIsVisible(!isVisible)} />
                    </View>
                    <View style={{ flex: 1, marginVertical: 30 }}>
                        <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8) }}>
                                Wishlist Name:
                            </Text>
                            <AppTextInput modal placeholder="Enter Wishlist Name" value={wishlistsValue} onChangedText={onEdit} />
                        </View>
                        <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8) }}>
                                Select Privacy
                            </Text>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={styles.checkLists}>
                                    <RadioButton.Android
                                        theme={theme}
                                        uncheckedColor={Colors.Grey}
                                        value="first"
                                        status={checked === 'first' ? 'checked' : 'unchecked'}
                                        onPress={() => { setChecked('first'), setPrivacy(1) }}
                                        // size={10}
                                        style={{ width: 8, height: 8, }}
                                    />
                                    <Text style={styles.textStyle}>{'Public'}</Text>
                                    <>
                                        <RadioButton.Android
                                            theme={theme}
                                            uncheckedColor={Colors.Grey}
                                            value="first"
                                            status={checked === 'second' ? 'checked' : 'unchecked'}
                                            onPress={() => { setChecked('second'), setPrivacy(2) }}
                                            // size={10}
                                            style={{ width: 8, height: 8, }}
                                        />
                                        <Text style={styles.textStyle}>{'Private'}</Text>
                                    </>
                                </View>
                            </View>
                        </View>
                    </View>
                    <FilterButtons loading={btnLoading} resetFilter={() => setIsVisible(!isVisible)} applyFilter={handleContinue} />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    buttonStyle: {
        backgroundColor: Colors.Blue,
        width: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5.5),
        borderRadius: 5,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        zIndex: 1,
    },
    section3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: oreintation == 'LANDSCAPE' ? "space-between": 'space-around',
        zIndex: -1
    },
    buttonTextStyle: {
        fontSize: hp(2),
        color: Colors.White,
        fontFamily: 'Poppins-SemiBold'
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Poppins-SemiBold'
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
});
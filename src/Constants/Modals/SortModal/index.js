import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

import { Colors } from '../../../Utils';
import PriceCheckbox from '../../PriceCheckbox';
import SortByCheckbox from '../../SortCheckbox';
import { Service } from '../../../Config/Services';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { oreintation } from '../../../Helper/NotificationService';


export default function SortModal({ setSelect, wishId, fetchList, type, modalVisible, setData, setFilterDataTo, setRefresh, setModalVisible, setIsFilterActive, userId }) {

    const userDetails = useSelector(state => state.UserReducer);
    const [check, setCheck] = useState(null);
    const applyFilter = async () => {
        setIsFilterActive(true);
        const apiToken = userDetails?.api_token;
        const data = {
            type: type,// product 2 wishlist,
            price: check,//start from this to this product
            user_id: userId,
        };
        if (!!wishId) Object.assign(data, { wishlist_id: wishId });

        const rawData = JSON.stringify(data);
        await Service.Sorting(rawData, apiToken, setData, setFilterDataTo, setRefresh);
        setModalVisible(!modalVisible);
    };
    const resetFilter = async () => {
        AsyncStorage.removeItem('saved_sorting');
        setModalVisible(!modalVisible);
        setIsFilterActive(false);
        fetchList('0');
        setSelect('0')
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.section1} >
                        <Text style={styles.modalTitleStyle}>FILTER</Text>
                        <Icon type="material" name="close" color={Colors.Grey} onPress={() => setModalVisible(!modalVisible)} />
                    </View>
                    <View>
                        {/* <View>
                            <Text style={styles.titleTextStyle}>SORT BY</Text>
                            <View>
                                <PriceCheckbox text1="Latest" text2="Oldest" text3="Wishlist" setCheck={setCheck} />
                            </View>
                        </View> */}
                        <View>
                            <Text style={styles.titleTextStyle}>PRICE</Text>
                            <View >
                                <SortByCheckbox text1="5 and under" text2="15 and under" text3="50 and under" text4="100 and under" text5="Over 100" text6="Start from low to high" text7="Start from high to low" setCheck={setCheck} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.section3} >
                        <TouchableOpacity onPress={resetFilter}>
                            <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
                                <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
                                    Reset Filter
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={check != null ? applyFilter : null}>
                            <View style={styles.buttonStyle}>
                                <Text style={styles.buttonTextStyle}>
                                    Apply Filter
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <FilterButtons resetFilter={resetFilter} applyFilter={applyFilter} check={check} /> */}
                </View>
            </Modal >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        justifyContent: 'space-between',
        top: hp(20),
        padding: oreintation == "LANDSCAPE"  ? wp(2.5): wp(5),
        width:  oreintation == "LANDSCAPE" ? wp('50%') : wp('85%'),
        height: hp(45),
        alignSelf: 'center',
        backgroundColor: 'white',
        elevation: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        borderRadius:8,
    },
    section1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    section3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    modalTitleStyle: {
        fontSize: hp(2.5),
        color: Colors.Grey,
        fontFamily: 'Poppins-SemiBold'
    },
    iconStyle: {
        width: 18,
        height: 18,
        tintColor: Colors.Grey,
    },
    buttonStyle: {
        backgroundColor: Colors.Blue,
        width:  oreintation == "LANDSCAPE" ? wp(20) : wp(28),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(4.5),
        borderRadius: 5,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        zIndex: 1,

    },
    buttonTextStyle: {
        fontSize: hp(1.6),
        color: Colors.White,
        fontFamily: 'Poppins-SemiBold'
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Poppins-SemiBold'
    }
})
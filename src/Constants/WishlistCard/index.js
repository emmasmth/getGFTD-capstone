import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';


export default function WishlistCard(props) {
    const userDetails = useSelector(state => state.UserReducer)
    const navigation = useNavigation();
    const { trackItems, title, item, storeName, wish, selectItem, selectMultipleItems, setSelectItem, addMultipleItems, stateSetter, productId, productDes, noteditable, fetchList, select, images, price, onRightPressed, tax, tip, selected } = props;
    let totalValue = Number(price);
    const addMultipleId = (id) => {
        if (selectItem != null) {
            setSelectItem(prevState => [...prevState, id])
        };
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.content}
                onPress={() => {
                    trackItems(userDetails.api_token, 'Friends Wishlist', title);
                    navigation.navigate('Products', {
                        screen: 'ProductDetails',
                        params: {
                            item: item,
                            fetchList: fetchList,
                            to: wish == true ? 'goBack' : 'wishlist'
                        }
                    })
                }

                }
            >
                <Image source={{ uri: images }} style={{
                    width: wp('30%'),
                    height: Platform.OS == 'android' ? hp(18) : hp(18),
                    resizeMode: 'contain',
                }} />
                <View style={styles.detailStyle} >
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: hp(1.8), color: Colors.LightBlue, fontWeight: '500', textAlign: 'center' }}>{title}</Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: hp(1.6), color: Colors.Grey,  }}>{`$ ${price ? totalValue.toFixed(2) : ''}`}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.buttonsStyle}>
                {noteditable == false ?
                    <TouchableOpacity style={styles.buttonViews} onPress={() => navigation.navigate('EditWishes', {
                        item: item,
                    })}>
                        <Icon type="material" name="edit" size={hp(3.2)} color={Colors.Grey} />
                    </TouchableOpacity>
                    : <View />
                }
                <TouchableOpacity style={{
                    width: 36,
                    height: 36,
                    backgroundColor: selected ? Colors.LightestBlue : Colors.LightGrey,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100 / 2
                }} onPress={() => { onRightPressed(), addMultipleId(item.id) }}>
                    <Icon type="material" name="check" size={hp(3.2)} color={selected ? Colors.White : Colors.Grey} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: wp('42%'),
        height: Platform.OS == 'android' ? hp(32) : hp(30),
        backgroundColor: 'white',
        marginEnd: 5,
        marginStart: 5,
        marginVertical: 10,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 8,
        elevation: 10,
        // marginHorizontal: 500,
    },
    content: {
        height: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    detailStyle: {
        width: wp('40%'),
        padding: 10,
        alignItems: 'center',
        height: hp(9.5),
        justifyContent: 'center',
    },
    buttonsStyle: {
        width: wp('40%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 6,
        position: 'absolute',
        top: 0,
        // zIndex: -1,
    },
    buttonViews: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(245, 245, 245,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100 / 2
    }
});
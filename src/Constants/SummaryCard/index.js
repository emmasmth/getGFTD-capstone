import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import analytics from '@react-native-firebase/analytics';
import { useSelector } from 'react-redux';
import { SvgUri } from 'react-native-svg';
import {scale} from "react-native-size-matters"


export default function SummaryCard(props) {
    const userDetails = useSelector(state => state.UserReducer)
    const navigation = useNavigation();
    const { trackItems, title, item, storeName, wish, productId, productDes, noteditable, fetchList, select, images, price, leftIcon, rightIcon, onPressed, onLeftPressed, onRightPressed, tax, tip } = props;
    const handleView = async (e) => {

        await analytics().logViewItem({
            value: Number(price),
            currency: 'usd',
            items: [{
                item_id: `${item.id}`,
                item_name: `${title}`,
                item_category: 'Wishlist',
                quantity: 1,
                price: Number(price),
            }]
        });

        trackItems(userDetails.api_token, 'My Wishlist', title);

        navigation.navigate('Products', {
            screen: 'ProductDetails',
            params: {
                item: item,
                fetchList: fetchList,
                to: wish == true ? 'goBack' : 'wishlist'
            }
        });
    }


    let totalValue = Number(price) + (Number(tax) / 100 * Number(price)) + (Number(tip) / 100 * Number(price))
    return (
        <View style={styles.container}>
            <View style={{ flex: 2, justifyContent: "flex-end" }}>
                <TouchableOpacity style={styles.content}
                    onPress={handleView}
                >
                    {images.includes("svg") ?

                        <SvgUri
                            // width={wp('30%')}
                            // height={hp(15)}
                            width="100%"
                            height="100%"
                            uri={`${images}`}
                        />
                        :

                        <Image source={{ uri: images }} style={{
                            // width: "80%",
                            // height: "100%",
                            width:"100%",
                            height:"100%",
                            resizeMode: 'contain',
                        }} />

                    }

                </TouchableOpacity>

            </View>
            <View style={styles.detailStyle} >
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: hp(1.7), color: Colors.LightBlue, textAlign: 'center' }}>{title}</Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: hp(1.6), color: Colors.Grey, }}>{`$ ${price ? totalValue.toFixed(2) : ''}`}</Text>
            </View>
            <View style={styles.buttonsStyle}>
                {noteditable == false ?
                    <TouchableOpacity style={styles.buttonViews} onPress={() => navigation.navigate('EditWishes', {
                        item: item,
                    })}>
                        <Icon type="material" name="edit" size={hp(3)} color={Colors.Grey} />
                    </TouchableOpacity>
                    : <View />
                }
                <TouchableOpacity style={styles.buttonViews} onPress={onRightPressed}>
                    <Icon type="material" name="delete" size={hp(3)} color={Colors.Grey} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: wp('40%'),
        height: 220,
        backgroundColor: 'white',
        marginEnd: 5,
        marginStart: 5,
        marginTop: 10,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 8,
        elevation: 10,
    },
    content: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // backgroundColor:"red"
    },
    detailStyle: {
        width: wp('40%'),
        height: hp(9.5),
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red'
    },
    buttonsStyle: {
        width: wp('40%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 6,
        position: 'absolute',
        zIndex: 1,
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
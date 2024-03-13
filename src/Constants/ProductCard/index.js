import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils';
import analytics from '@react-native-firebase/analytics';
import { oreintation } from '../../Helper/NotificationService';
import { useSelector } from 'react-redux';

export default function ProductCard(props) {
    const userDetails = useSelector(state => state.UserReducer)
    const { trackItems, navigation, title, fetchList, item, images, price, image, leftIcon, rightIcon, onPressed } = props;
    const handleView = async () => {
        await analytics().logViewItem({
            value: Number(price),
            currency: 'usd',
            items: [{
                item_id: `${item.id}`,
                item_name: `${title}`,
                item_category: 'Trending',
                quantity: 1,
                price: Number(price),
            }]
        })
        // console.log('view')
        trackItems(userDetails.api_token, 'Trending Wishlist', title);

        navigation.navigate('Products', {
            screen: 'ProductDetails',
            params: {
                item: item,
                fetchList: fetchList,
                to: 'trending'
            }
        })
    }
    return (
        <View style={styles.container} >
            <TouchableOpacity style={styles.content}
                onPress={handleView}
            >
                <Image source={{ uri: images }} style={{
                    width: wp('30%'),
                    height: hp(20),
                    resizeMode: 'contain',
                }} />
            </TouchableOpacity>
            <View style={styles.detailStyle} >
                <Text style={{ fontFamily: 'Lato-Regular', fontSize: oreintation == "LANDSCAPE" ? hp(2) : hp(1.8), color: Colors.LightBlue, fontWeight: '500', textAlign: 'center' }}>{title}</Text>
                <Text style={{ flex: 1, fontFamily: 'Lato-Regular', fontSize: oreintation == "LANDSCAPE" ? hp(1.8) : hp(1.6), color: Colors.Grey, fontWeight: '700' }}>{`$ ${price ? price : ''}`}</Text>
            </View>
            <View style={styles.buttonsStyle}>
                <TouchableOpacity style={{}} onPress={onPressed}>
                    <Image source={leftIcon} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: Colors.Grey }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonViews} onPress={onPressed}>
                    <Image source={rightIcon} style={{ width: 36, height: 36, resizeMode: 'contain', }} />
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: oreintation == "LANDSCAPE" ? wp('45%') : wp('40%'),
        height: oreintation == "LANDSCAPE" ? hp(30) : hp(27),
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
    },
    content: {
        height: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    detailStyle: {
        width: wp('40%'),
        height: oreintation == "LANDSCAPE" ? hp(8) : hp(9.5),
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
        // paddingVertical: 6,
        marginTop: oreintation == "LANDSCAPE" ? 10 : 12,
        position: 'absolute',
        right: oreintation == "LANDSCAPE" ? 5 : -3,
        zIndex: 1,
    },
    buttonViews: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(245, 245, 245,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100 / 2
    },
});
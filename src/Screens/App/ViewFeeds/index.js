
import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, Platform, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import moment from "moment";

// Constant----------------------------------------------------------------
import LoadingModal from '../../../Constants/Modals/LoadingModal';
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../Context';


export default function ViewFeeds({ navigation, route }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [loading, setloading,] = useState(false);
    const apiToken = userDetails.api_token;
    const { item } = route.params;

    const { trackData } = useContext(AuthContext);
    useFocusEffect(() => {
       if(!!apiToken) trackData(apiToken, 'Item Viewed', `${item && item.product_name != "" ? item.product_name : item.title}`);
    });
    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text={item && item.product_name != "" ? item.product_name : item.title} />
                <View>
                    <View style={{ margin: 10, paddingVertical: 5, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Image source={item && item?.image ? { uri: item.image } : ''} style={{ width: wp('100%'), height: hp(25), resizeMode: 'contain', alignSelf: 'center', marginBottom: 10 }} />
                        {item && item?.price != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Price: $ {item?.price}</Text>
                        </View> : null}
                        {item && item?.tax != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Tax: {item?.tax}</Text>
                        </View> : null}
                        {item && item?.tip != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Tip: {item?.tip}</Text>
                        </View> : null}
                        {item && item?.privacy ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Privacy: {item?.privacy == 1 ? "Public" : "Private"}</Text>
                        </View> : null}
                        {item && item?.created_at != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Created at: {moment(item?.created_at.split(' ')[0]).format('LL')}</Text>
                        </View> : null}
                        {item && item?.receiver_name != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Receiver: {item?.receiver_name}</Text>
                        </View> : null}
                        {item && item?.sender_name != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Sender: {item?.sender_name}</Text>
                        </View> : null}
                        {item && item?.message != '' ? <View style={{ borderBottomColor: Colors.LightestGrey, borderBottomWidth: .5, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', }}>
                            <Text style={{ flex: 1, marginVertical: 5, fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Message: {`${item?.message}`}</Text>
                        </View> : null}
                    </View>
                </View>
            </View>
            <LoadingModal loading={loading} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
});
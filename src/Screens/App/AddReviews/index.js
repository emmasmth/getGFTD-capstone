
import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Platform, ScrollView } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import Stars from 'react-native-stars';

// Constants----------------------------------------------------------------
import AppTextInput from '../../../Constants/TextInput';
import AppTextArea from '../../../Constants/TextArea';
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Icons } from '../../../Assets';
import { Colors } from '../../../Utils';

export default function AddReviews({ navigation }) {
    const userDetails = useSelector(state => state.UserReducer);
    const [starsVal, setStarsVal] = useState(null);
    const [reviewTitle, setReviewTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [loading, setloading] = useState(false);
    const [highlighted, setHighlighted] = useState(false);
    const apiToken = userDetails?.api_token;


    const submitReviews = async () => {
        const obj = {
            review_title: reviewTitle,
            rating: starsVal,
            description: description,
        };
        navigation.goBack();
    };

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="ADD REVIEW" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, }}>
                        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-around', marginTop: hp(3), height: hp(8) }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Rating for this product</Text>
                            <Stars
                                default={2.5}
                                update={(val) => setStarsVal(val)}
                                spacing={5}
                                count={5}
                                fullStar={<Icon name={'star'} size={hp(4)} style={[styles.myStarStyle]} color='orange' />}
                                emptyStar={<Icon name={'star'} size={hp(4)} style={[styles.myStarStyle, styles.myEmptyStarStyle]} color={Colors.LightestGrey} />}
                                halfStar={<Icon name={'star-half'} size={hp(4)} style={[styles.myStarStyle]} color='orange' />}
                            />
                        </View>
                        <View style={{ alignSelf: 'center', marginTop: hp(2) }}>
                            <Text style={{ fontSize: hp(1.9), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Review Title</Text>
                            <AppTextInput value={reviewTitle} onChangedText={setReviewTitle} placeholder="Ex. Excellent" />
                        </View>
                        <View style={{ alignSelf: 'center', marginTop: hp(2) }}>
                            <Text style={{ fontSize: hp(1.9), color: Colors.Grey, fontFamily: 'Lato-Regular' }}>Description</Text>
                            <AppTextArea setHighlighted={setHighlighted} value={description} onChangedText={setDescription} placeholder="Review Description" />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <AppButton onPressed={submitReviews} loading={loading} text="SUBMIT" xlarge />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    myStarStyle: {
        color: 'orange',
        backgroundColor: 'transparent',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 0,
    },
    myEmptyStarStyle: {
        color: 'grey',
    }
})
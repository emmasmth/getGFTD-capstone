import React, { useState } from 'react'

import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import ImageView from 'react-native-image-view';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Images } from '../../Assets';

// Constants----------------------------------------------------------------
import { Colors } from '../../Utils';
import { Icon } from 'react-native-elements';

export default function ProfileBar(props) {
    const [isImageViewVisible, setIsImageViewVisible] = useState(false)
    const { name, username, gfts, friends, profileImage, handeEdit, handleViewFriends } = props;
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, paddingHorizontal: 20, flexDirection: "row", marginBottom: 5, backgroundColor: Colors.ThemeColor, alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center", }}>
                    <Icon type="material" name="arrow-back-ios" size={hp(2.7)} color={Colors.White} onPress={() => props.navigation.goBack()} />
                </View>
                <View style={{ flex: 3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', color: Colors.White, fontSize: hp(2.5) }}>My Friends</Text>
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} />
            </View>
            <View style={{ flexDirection: 'row', flex: 3, paddingHorizontal: 20, }}>
                <View style={[styles.box3, { marginTop: 20 }]}>
                    <TouchableOpacity style={styles.box3} onPress={handeEdit}>
                        <Text style={[styles.amountStyle, { fontSize: hp(2), color: Colors.ThemeColor, fontFamily: "Poppins-SemiBold" }]}>{gfts != undefined ? gfts : 0}</Text>
                        <Text style={[styles.amountStyle, { color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold' }]}>{`GFTS`}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.box2}>
                    <TouchableOpacity style={styles.ImageView} onPress={() => setIsImageViewVisible(true)}>
                        <Image source={profileImage != '' ? { uri: profileImage } : Images.userProfile} style={styles.imageStyle} />
                    </TouchableOpacity>
                    <ImageView
                        images={[
                            {
                                source: profileImage != '' ? { uri: profileImage } : Images.userProfile,
                                // title: `${userItems?.user_info?.name}`,
                                width: 806,
                                height: 806,
                            },
                        ]}
                        imageIndex={0}
                        isVisible={isImageViewVisible}
                        onClose={() => setIsImageViewVisible(false)}
                    // renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
                    />
                    <Text style={[styles.emailStyle, { marginStart: 10, fontFamily: 'Poppins-SemiBold' }]}>{name}</Text>
                    <Text style={[styles.nameStyle, { marginStart: 10, fontFamily: 'Poppins-Medium' }]}>{username}</Text>
                </View>
                <View style={[styles.box3, { marginTop: 20 }]}>
                    <TouchableOpacity style={styles.box3} onPress={handleViewFriends}>
                        <Text style={[styles.amountStyle, { fontSize: hp(2), color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold' }]}>{friends != undefined ? friends : 0}</Text>
                        <Text style={[styles.amountStyle, { color: Colors.ThemeColor, fontFamily: 'Poppins-SemiBold' }]}>{`FRIENDS`}</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        // alignItems: "center",
        alignSelf: "center",
        justifyContent: 'space-between',

        width: wp('100%'),
        height: hp(28),
        backgroundColor: Colors.ThemeColor,
    },
    box2: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 10,
    },
    box3: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        width: 75,
        height: 75,
        backgroundColor: Colors.White,
        borderRadius: 100 / 2,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    ImageView: {
        width: 105,
        height: 105,
        backgroundColor: Colors.White,
        borderColor: Colors.Blue,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 200 / 2,
        marginBottom: 2,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    imageStyle: {
        width: 105,
        height: 105,
        resizeMode: 'cover',
        borderRadius: 200 / 2,
    },
    emailStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.5),
        color: Colors.White
    },
    nameStyle: {
        fontSize: hp(1.4),
        color: Colors.White,
        fontFamily: 'Poppins-Regular',
    },
    amountStyle: {
        color: Colors.Black,
        fontSize: hp(1.2),
        fontFamily: 'Poppins-Regular'
    },
    iconStyle: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
});
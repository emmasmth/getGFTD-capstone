import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Colors } from '../../Utils';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
// import Orientation from 'react-native-orientation';


// const initial = Orientation.getInitialOrientation();

export default function AppHeader(props) {
    const { left, darkBlue, allNotifications, rightIconpng, setFilteredData, text, searchText, setSearchText, searchbar, onPressed, onRightPressed, right, logo, leftIcon, rightIcon, rightColor } = props;
    const search = (searchtext) => {
        setSearchText(searchtext);
        let filteredData = allNotifications.filter(function (item) {
            return item.message.toLowerCase().includes(searchtext.toLowerCase());
        });
        setFilteredData(filteredData);
    };
    return (
        <LinearGradient colors={!darkBlue ? [Colors.ThemeColor, Colors.ThemeColor,] : ['white', 'white']} style={styles.container}>
            <TouchableOpacity style={styles.box1} onPress={onPressed}>
                <View style={{ width: scale(20), height: scale(20), marginLeft: scale(15) }}>
                    <Image source={leftIcon} style={{ height: "100%", width: "100%", resizeMode: 'contain', tintColor: darkBlue ? Colors.Blue : Colors.White }} />
                </View>
            </TouchableOpacity>
            <View style={styles.box2}>
                {searchbar
                    ?
                    <TextInput style={styles.searchBar} value={searchText} placeholder='Search...' onChangeText={search} />
                    :
                    text && <Text style={[styles.textStyle, { color: darkBlue ? Colors.Blue : Colors.White, textAlign: 'center' }]}>{text}</Text>
                }
            </View>
            <View style={styles.box3}>
                {rightIcon ?
                    <TouchableWithoutFeedback onPress={onRightPressed}>
                        <View style={{ width: scale(20), height: scale(20), marginRight: scale(15) }}>
                            <Image source={rightIcon} style={{ height: "100%", width: "100%", resizeMode: 'contain', tintColor: rightColor ? Colors.White : null }} />
                        </View>
                    </TouchableWithoutFeedback>
                    : rightIconpng && <Icon onPress={onRightPressed} color={Colors.White} name="add-circle" type={'ionicon'} size={scale(24)} style={{ marginRight: scale(15) }} />
                }
            </View>
        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp(8),
        flexDirection: 'row',
        justifyContent: "space-around",
        // backgroundColor: initial == "LANDSCAPE" ? 'red' : Colors.LightBlue,
        // borderColor:  Colors.LightBlue,
        // shadowColor: Colors.Grey,
        // shadowOffset:{width:0, height:10},
        // shadowRadius:8,
        // shadowOpacity:0.3,

    },
    box1: {
        flex: 1,
        // alignItems: 'center',
        alignItems: "flex-start",
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    box2: {
        // flex: initial == "LANDSCAPE" ? 12 : 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box3: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    textStyle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: hp(2.2),
        color: Colors.White,
    },
    logoStyle: {
        flexDirection: "row",
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: "center",
    },
    searchBar: {
        width: wp('70%'),
        backgroundColor: 'white',
        height: 45,
        paddingHorizontal: 5,
        fontFamily: 'Poppins-Regular',
        borderRadius: wp(2),
        color: Colors.Grey,
    },
})
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Platform, FlatList } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';
import NotificationsCard from '../../../Constants/NotificationsCard';

// Utils----------------------------------------------------------------
import { Icons } from '../../../Assets';
import { Colors } from '../../../Utils';
import { Service } from '../../../Config/Services';
import { addnotificationsdata } from '../../../Redux/NotificationsReducer';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../Context';
// import { TrackData } from '../../../Helper/TrackUser';


export default function Notifications({ navigation }) {
    const {trackData} = useContext(AuthContext);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const allNotifications = useSelector(state => state.NotificationsReducer);
    const userDetails = useSelector(state => state.UserReducer);
    const apiToken = userDetails != undefined && userDetails.api_token;

    const setNotifications = (data) => dispatch(addnotificationsdata(data));

    const [searchbar, setSearchbar] = useState(false);
    const [loading, setloading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const GetAllNotifications = async () => {
        await Service.GetAllNotifications(apiToken, setNotifications, setloading);
    };
    const listing = filteredData && filteredData.length > 0 ? filteredData : allNotifications

    const settingNotsLength = async () => {
        if (allNotifications.length > 0) {
            AsyncStorage.setItem('@notifications_length', JSON.stringify(allNotifications.length))
        }
        else {
            AsyncStorage.setItem('@notifications_length', JSON.stringify(0))
        }
    }

    // const TrackScreen  =async () =>{
    //     console.log('Notifications screen')
    //     const data = {
    //         event_name: 'Page Viewed', 
    //         page_title: "Notifications",
    //     }
    //     await Service.TrackUser(apiToken, data, setloading);
    // }

    useEffect(() => {
        GetAllNotifications();
        settingNotsLength();
       if(!!apiToken) trackData(apiToken, 'Page View', 'Notifications');
    }, [isFocused])

    return (
        <View style={styles.container}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader 
            allNotifications={allNotifications} 
            setFilteredData={setFilteredData} 
            text="NOTIFICATIONS" 
            searchbar={searchbar} 
            searchText={searchText} 
            setSearchText={setSearchText} 
            leftIcon={Icons.backarrow} 
            rightIcon={searchbar ? Icons.closebutton : Icons.magnifyIcon} 
            rightColor={Colors.White} 
            onRightPressed={() => { setSearchbar(!searchbar) }} 
            onPressed={() => {navigation.goBack(),AsyncStorage.removeItem('@notifications_length')}} />
            <View style={styles.content}  >
                {listing.length > 0
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        data={listing}
                        renderItem={({ item, index }) => {
                            // console.log(item)
                            return <NotificationsCard item={item} navigation={navigation} />
                        }}
                        keyExtractor={({ item, index }) => index}
                    />
                    :
                    <Text style={{ color: Colors.Grey, alignSelf: 'center', fontSize: hp(2), fontFamily:"Poppins-Regular" }}>No notifications yet!</Text>
                }
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    content: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
});
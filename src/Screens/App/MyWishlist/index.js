import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, TextInput, Platform, ScrollView, TouchableWithoutFeedback, RefreshControl, FlatList, TouchableOpacity, ActivityIndicator, Pressable, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
// import CaptureScreen
// import { captureScreen } from 'react-native-view-shot';
// import RNFS from 'react-native-fs';
// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';

// Stats----------------------------------------------------------------
import { addwishlistdata } from '../../../Redux/WishlistReducer';
import WishlistCard from '../../../Constants/WishlistCard';
import { Icon } from 'react-native-elements';
import MyWishlistSortModal from '../../../Constants/Modals/MyWishlistSortModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';
import SocialPoster from '../../../Constants/Modals/SocialPoster';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

function SearchBar({ WishLists, setFilteredData, modalVisible, setModalVisible, setSearchText, searchText, isFilterActive }) {
    const search = (searchtext) => {
        setSearchText(searchtext);
        let filteredData = WishLists.filter(function (item) {
            return item.product_name.toLowerCase().includes(searchtext.toLowerCase());
        });
        setFilteredData(searchtext.length > 0 ? filteredData : []);
    };
    return (
        <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBarItems}>
                    <Image source={Icons.magnifyIcon} style={{ tintColor: Colors.Grey, width: 18, height: 18, marginHorizontal: 10, }} />
                    <TextInput style={styles.searchBar} value={searchText} placeholder='Search' onChangeText={search} placeholderTextColor={Colors.Grey} />
                </View>
                <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
                    <View style={styles.searchFilterContainer}>
                        <Icon name="sort-amount-up" type="font-awesome-5" color={isFilterActive == true ? Colors.LightestBlue : Colors.Grey} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View >
    );
};

function RenderWishlist({ trackItems, refresh, value1, selectItem, setSelectItem, selectMultipleItems, addMultipleItems, stateSetter, setRefresh, navigation, fetchList, WishLists, filteredData, handleDelete, getSelected, margin }) {
    const listing = filteredData && filteredData.length > 0 ? filteredData : WishLists;
    const onRefresh = React.useCallback((id) => {
        setRefresh(true);
        fetchList(id);
        wait(2000).then(() => setRefresh(false));
    }, [refresh]);

    return (
        <>
            {refresh == true ?
                <ActivityIndicator size={'small'} color={Colors.LightestBlue} />
                : listing.length > 0
                    ?
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refresh}
                                onRefresh={() => onRefresh(value1)}
                            />
                        }
                        data={listing}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            let totalValue = Number(item.product_price);
                            let totalTax = Number(item.product_tax);
                            let totalTip = Number(item.product_tip);
                            let totalServiceCharges = ((margin / 100) * totalValue) + totalValue + ((totalTax / 100) * totalValue) + ((totalTip / 100) * totalValue);
                            let totalServiceFee = ((margin / 100) * totalValue) + ((totalTax / 100) * totalValue) + ((totalTip / 100) * totalValue);
                            // console.log('totalServiceFee ==>', totalServiceFee)
                            return (
                                <View style={{ backgroundColor: Colors.White, justifyContent: 'center', paddingHorizontal: oreintation == 'LANDSCAPE' ? 40 : 10, alignItems: "flex-start", flex: 1, }}>
                                    <WishlistCard
                                        trackItems={trackItems}
                                        selected={getSelected(item?.id)}
                                        selectItem={selectItem}
                                        selectMultipleItems={selectMultipleItems}
                                        setSelectItem={setSelectItem}
                                        addMultipleItems={addMultipleItems}
                                        stateSetter={stateSetter}
                                        wish={true}
                                        navigation={navigation}
                                        fetchList={fetchList}
                                        item={item}
                                        productId={item ? item?.id : ''}
                                        productDes={item ? item?.product_description : ''}
                                        price={item ? item.product_price : ''}
                                        tax={item ? item.product_tax : '0'}
                                        tip={item ? item.product_tip : '0'}
                                        images={item ? item?.product_image : ''}
                                        storeName={item ? item?.store_name : ''}
                                        title={item ? item?.product_name : ''}
                                        leftIcon={Icons.editWishlistIcon}
                                        onRightPressed={() => {
                                            stateSetter(totalValue.toFixed(2), totalValue.toFixed(2), item.id, item?.product_name, item.product_image)
                                            addMultipleItems(
                                                {
                                                    totalValue: parseFloat(totalValue).toFixed(2),
                                                    totalTax: totalTax,
                                                    totalTip: totalTip,
                                                    product_id: item.id,
                                                    product_name: item?.product_name,
                                                    product_image: item.product_image,
                                                    margin: margin,
                                                    totalServiceCharges: totalServiceCharges,
                                                    totalServiceFee: totalServiceFee
                                                }
                                            )
                                        }}
                                    />
                                    <View style={{ flex: 1, height: 30 }} />
                                </View>
                            )
                        }}
                    />
                    :
                    <View style={{ flex: 1, backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontFamily: 'Lato-Regular', fontSize: hp(2), color: Colors.Grey }}>No Wish Found</Text>
                    </View>
            }
        </>
    );
};

const HorizontalList = ({ data, setValue1, select, setSelect, fetchList, setFilteredData, setIsFilterActive, listId }) => {
    const isFocused = useIsFocused();
    return (
        <View style={{ margin: 10 }}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data.sort((a, b) => a.created_at.localeCompare(b.created_at))}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={{ margin: 5, backgroundColor: item.id == select ? Colors.LightBlue : Colors.LightestGrey, width: item.title.length > 14 ? oreintation == "LANDSCAPE" ? wp(15) : wp(45) : oreintation == "LANDSCAPE" ? wp(15) : wp(25), height: hp(4.5), alignItems: 'center', justifyContent: 'center', borderRadius: 100 / 2 }}
                            onPress={() => { setSelect(item.id), fetchList(item.id), setValue1(item.id), setFilteredData([]), setIsFilterActive(false), AsyncStorage.removeItem('saved_wish_sorting') }}
                        >
                            <Text style={{ fontSize: hp(1.5), color: item.id == select ? Colors.White : Colors.Grey, fontFamily: 'Poppins-Regular' }}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default function MyWishlist({ navigation, route }) {
    const { itemId, userId, selectMultipleItems2, setSelectMultipleItems2 } = route.params;
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const { trackItems } = useContext(AuthContext);
    const setWishlist = (data) => dispatch(addwishlistdata(data));
    const userDetails = useSelector(state => state.UserReducer);
    const WishLists = useSelector(state => state.WishlistReducer);
    const [loading, setloading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState(false);
    const [message, setMessage] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [wishData, setWishData] = useState([]);
    const [wishlistsData, setWishlistsData] = useState([]);
    const [value1, setValue1] = useState('0');
    const [margin, setMargin] = useState(0);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const apiToken = userDetails?.api_token;
    const [listId, setListId] = useState('');
    const [select, setSelect] = useState('');
    const { trackData } = useContext(AuthContext);
    const [selectItem, setSelectItem] = useState('');
    const [selectMultipleItems, setSelectMultipleItems] = useState(selectMultipleItems2.length > 0 ? selectMultipleItems2 : []);

    const handleAddItems = (item) => {
        if (selectMultipleItems != null) {
            return addMultipleItems(item)
        }
    };

    const addMultipleItems = (item) => {
        if (selectMultipleItems.map(a => a.product_id).includes(item.product_id)) {
            const newList = selectMultipleItems.filter(element => element.product_id != item.product_id)
            return setSelectMultipleItems(newList), setSelectMultipleItems2(newList)
        }
        setSelectMultipleItems(prevState => [...prevState, item]);
        setSelectMultipleItems2(selectMultipleItems != [] ? [...selectMultipleItems, item] : []);
    };

    const getSelected = (item) => {
        return selectMultipleItems.map(item => item.product_id).includes(item)
    };

    async function fetchList(id) {
        if (!!id) await Service.GetWishlistsByUserIdWishId(route.params.userId, id, apiToken, setWishlistsData, setloading, setRefresh);
    };

    const getAdminMargin = async () => {
        await Service.AdminMargin(setMargin, setloading);
    }

    const handleDelete = async (id) => {
        const data = {
            product_id: await id,
        };
        const parmas = JSON.stringify(data);
        await Service.AddToWishlist(parmas, apiToken, setMessage, fetchList);
    };

    const getWishlist = async (id) => {
        if (!!id) await Service.GetWishlistsByUserId(id, apiToken, setWishData, setloading, setSelect, fetchList);
    };


    const wishDataAll = wishData.map(x => (x.title === 'General' ? { ...x, id: '0' } : x));

    useEffect(() => {
        if (wishData.length == 0) fetchList('0');
        getWishlist(userId);
        getAdminMargin()
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'My Wishlist');

        AsyncStorage.getItem('saved_wish_sorting')
            .then((value) => {
                if (value) setIsFilterActive(true)
            })
    }, [isFocused]);

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => { navigation.goBack(), setIsFilterActive(false), AsyncStorage.removeItem('saved_wish_sorting') }} leftIcon={Icons.backarrow} text="SELECT WISH" />
                <SearchBar
                    WishLists={wishlistsData}
                    setFilteredData={setFilteredData}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    isFilterActive={isFilterActive}
                />
                <HorizontalList
                    select={select}
                    setSelect={setSelect}
                    setValue1={setValue1}
                    setFilteredData={setFilteredData}
                    setIsFilterActive={setIsFilterActive}
                    fetchList={fetchList}
                    data={wishDataAll}
                    listId={listId}
                />
                <RenderWishlist
                    trackItems={trackItems}
                    selectItem={selectItem}
                    setSelectItem={setSelectItem}
                    selectMultipleItems={selectMultipleItems}
                    addMultipleItems={handleAddItems}
                    stateSetter={route.params.StateSetter}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    value1={value1}
                    navigation={navigation}
                    fetchList={fetchList}
                    WishLists={wishlistsData}
                    filteredData={filteredData}
                    handleDelete={handleDelete}
                    getSelected={getSelected}
                    margin={margin}
                />
                {wishlistsData.length > 0 && selectMultipleItems.length > 0
                    ? <TouchableOpacity
                        style={{ position: 'absolute', bottom: 40, alignSelf: "center", backgroundColor: Colors.LightestBlue, width: wp('50%'), height: 55, borderRadius: 100 / 2, alignItems: 'center', justifyContent: 'center', shadowRadius: 10, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10, elevation: 10 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ fontFamily: 'Poppins-SemiBold', color: Colors.White, fontSize: hp(2) }}>CONTINUE</Text>
                    </TouchableOpacity> : null}
            </View>
            <MyWishlistSortModal
                setloading={setloading}
                fetchList={fetchList}
                setData={setWishlist}
                setFilterDataTo={setWishlistsData}
                type={2}
                wishId={value1}
                setRefresh={setRefresh}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setIsFilterActive={setIsFilterActive}
                setSelect={setValue1}
                userId={route.params.userId}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    searchBarContainer: {
        width: "100%",
        height: hp(8),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchBarItems: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
    },
    searchBar: {
        width: oreintation == "LANDSCAPE" ? wp('90%') : wp('70%'),
        height: 45,
        paddingHorizontal: 5,
        fontFamily: 'Poppins-Regular',
        color: Colors.Grey,
    },
    searchFilterContainer: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.LightGrey,
        borderRadius: 8
    },
    productContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.White,
    },
});
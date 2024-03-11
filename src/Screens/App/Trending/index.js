import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, StatusBar, Image, TextInput, Platform, RefreshControl, Modal, TouchableOpacity, ActivityIndicator, FlatList, ViewComponent } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// Constants----------------------------------------------------------------
import { SortModal } from '../../../Constants/Modals';
import LoadingModal from '../../../Constants/Modals/LoadingModal';
import ProductCard from '../../../Constants/ProductCard';
import AppHeader from '../../../Constants/Header';


// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services'
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';

// Stats----------------------------------------------------------------
import { addstorelistdata } from '../../../Redux/StorelistReducer';
import { Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { oreintation } from '../../../Helper/NotificationService';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { AuthContext } from '../../../Context';
import { addtrendingdata } from '../../../Redux/TrendingReducer';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
function SearchBar({ storeList, setFilteredData, filteredDatas, setModalVisible, modalVisible, setSearchText, searchText, }) {
    const search = (searchtext) => {
        setSearchText(searchtext);
        let filteredData = storeList.filter(function (item) {
            return item.product_name.toLowerCase().includes(searchtext.toLowerCase());
        });
        setFilteredData(filteredData);
    };
    return (
        <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBarItems}>
                    <Image source={Icons.magnifyIcon} style={{ tintColor: Colors.Grey, width: 18, height: 18, marginHorizontal: 10, }} />
                    <TextInput style={styles.searchBar} value={searchText} placeholder='Search...' onChangeText={search} placeholderTextColor={Colors.Grey} />
                </View>
                <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                    <View style={styles.searchFilterContainer}>
                        <Image source={Icons.settingIcon} style={{ width: 45, height: 45, resizeMode: 'contain', ...modalVisible == true && { tintColor: Colors.LightestGrey } }} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View >
    );
};

function WishesSkeleton({ isLoading }) {
    return (
        <View style={styles.skeletonContainer} >
            <SkeletonContent
                containerStyle={{ flex: 1, width: 300, alignItems: "center", justifyContent: 'space-around' }}
                isLoading={isLoading}
                animationType="shiver"
                duration={1500}
                animationDirection='horizontalRight'
                layout={[
                    { key: 'someId', width: 120, height: 120, marginBottom: 6, borderRadius: 100 },
                    { key: 'someOtherId', width: 100, height: 20, marginVertical: 5, },
                    { key: 'someOtherId', width: 80, height: 20, marginVertical: 5 },
                    // { key: 'someOtherId', width: 180, height: 40, marginVertical: 10 },
                ]}
            >
            </SkeletonContent>
        </View>
    )
}

function RenderWishlist({ trackItems, handleConfirm, setItemPrice, setItemName, setId, navigation, fetchList, refresh, setRefresh, setloading, storeList, filteredData, loading, handleFavourite }) {
    // const listing = filteredData && filteredData.length > 0 ? filteredData : storeList;
    const onRefresh = React.useCallback(() => {
        setRefresh(true);
        fetchList();
        wait(2000).then(() => setRefresh(false));
    }, []);
    return (
        <View
            style={styles.productContainer}
        >
            {!loading && filteredData.length > 0
                ?

                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                    data={filteredData}
                    numColumns={2}
                    // style={{alignSelf: 'flex-start'}}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flex: 1, backgroundColor: Colors.White, alignItems: "center", paddingHorizontal: oreintation == 'LANDSCAPE' ? 20 : 10 }}>
                                <ProductCard trackItems={trackItems} fetchList={fetchList} navigation={navigation} item={item} price={item.product_price} title={item.product_name} images={item ? item?.product_image : ''} rightIcon={item.is_like == 'true' ? Icons.favouritedIcon : Icons.favouriteIcon} onPressed={() => { handleConfirm(), setId(item.id), setItemPrice(item.product_price), setItemName(item.product_name) }} />
                                {/* <View style={{ flex: 1, height: 30 }} /> */}
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
                :
                <View style={{ backgroundColor: Colors.White, justifyContent: 'center', alignItems: "center", paddingHorizontal: 10, width: '100%' }}>
                    <FlatList
                        data={[{}, {}, {}, {}, {}, {}]}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        renderItem={({item,index}) => <WishesSkeleton key={item} isLoading={loading} />}
                    />
                </View>
            }
        </View >
    );
};

export default function Trending({ navigation }) {
    const { trackItems, trackData } = useContext(AuthContext);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const setStoreList = (data) => dispatch(addstorelistdata(data));
    const userDetails = useSelector(state => state.UserReducer);
    const storeList = useSelector(state => state.StorelistReducer);
    const [loading, setloading,] = useState(false);
    const [refresh, setRefresh,] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage,] = useState("");
    const [searchText, setSearchText,] = useState("");
    const [id, setId,] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const apiToken = userDetails?.api_token;

    const [wishlists, setWishlists] = useState([]);

    const [catOpen, setCatOpen] = useState(false)
    const [items, setItems] = useState([]);
    const [value1, setValue1] = useState(null);
    const [itemPrice, setItemPrice] = useState(0);
    const [itemName, setItemName] = useState('');

    const setTrendingWishes = (state) => useDispatch(addtrendingdata(state));

    const ShowWishlists = async () => {
        await Service.ShowWishlists(apiToken, setWishlists, setloading);
    };

    let wishlistArr = wishlists.map((item, index) => ({
        label: item.title,
        value: item.id,
    }));

    const handleFavourite = async () => {
        const data = {
            product_id: id,
            wishlist_id: value1
        };
        const parmas = JSON.stringify(data);

        analytics().logAddToWishlist({
            currency: "usd",
            value: Number(itemPrice),
            items: [{
                item_id: `${id}`,
                item_name: itemName,
                item_category: 'Wishlist',
                quantity: 1,
                price: Number(itemPrice),
            }],

        });
        await Service.AddToWishlist(parmas, apiToken, setMessage, fetchList);
        setIsVisible(false)
    };
    const handleConfirm = async (id) => {
        setIsVisible(true)
    };

    const fetchList = async () => {
        const apiToken = await userDetails?.api_token;
        if (!!apiToken) await Service.GetStoreList(apiToken, setStoreList, setFilteredData, setRefresh);
    };


    // const [catOpen,setCatOpen] = useState(false)

    useEffect(() => {
        analytics().logViewItemList({
            item_list_name: 'Trending'
        });
        fetchList();
        ShowWishlists()
        if(!!apiToken)trackData(apiToken, 'Page Viewed', 'Trendings')
    }, [isFocused]);

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="TRENDING" />
                <SearchBar storeList={storeList} filteredDatas={filteredData} setFilteredData={setFilteredData} setModalVisible={setModalVisible} modalVisible={modalVisible} searchText={searchText} setSearchText={setSearchText} />
                <RenderWishlist
                    trackItems={trackItems}
                    setId={setId}
                    setItemPrice={setItemPrice}
                    setItemName={setItemName}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    fetchList={fetchList}
                    navigation={navigation}
                    filteredData={filteredData}
                    storeList={storeList}
                    loading={loading}
                    handleFavourite={handleFavourite}
                    handleConfirm={handleConfirm}
                />
            </View>
            <View>
            </View>
            <SortModal fetchList={fetchList} type={1} setData={setStoreList} setFilterDataTo={setFilteredData} setRefresh={setRefresh} modalVisible={modalVisible} setModalVisible={setModalVisible} />
            {/* <LoadingModal loading={loading} /> */}
            <Modal animationType="slide"
                transparent={true}

                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(!isVisible);
                }}>
                <View style={{
                    // backgroundColor:"red",
                    justifyContent: 'space-between',
                    top: hp(20),
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    width: wp('85%'),
                    height: oreintation == "LANDSCAPE" ? hp(40) : hp(35),
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    elevation: 10,
                    shadowOffset: { width: 0, height: 8 },
                    shadowColor: Colors.Grey,
                    shadowRadius: 10,
                    shadowOpacity: 0.3,
                    borderRadius:8,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }} >
                        <Text style={{
                            fontSize: hp(2.5),
                            color: Colors.Grey,
                            fontFamily: 'Poppins-SemiBold-SemiBold'
                        }}>ADD TO FAVOURITE</Text>
                        <Icon type="material" name="close" color={Colors.Grey} onPress={() => setIsVisible(!isVisible)} />
                    </View>
                    <View style={{ flex: 1, marginVertical: 20 }}>
                        <View style={{ flexDirection: 'column', marginVertical: 10 }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8), marginLeft: oreintation == "LANDSCAPE" ? 10 : 0, marginBottom: 5 }}>
                                Select Wishlist
                            </Text>
                            <View style={{
                                alignSelf: 'center', zIndex: Platform.OS != 'android' ? 3000 : 3000,
                                height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                width: wp('82%'),
                                paddingHorizontal: 10,
                                marginVertical: 8,
                            }}>
                                <DropDownPicker
                                    listMode={Platform.OS == 'android' ? "MODAL" : "SCROLLVIEW"}
                                    scrollViewProps={{
                                        // nestedScrollEnabled: true,
                                        decelerationRate: "fast"
                                    }}
                                    dropDownContainerStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: Colors.LightGrey,
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowColor: Colors.Grey,
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                        elevation: 10,
                                    }}
                                    placeholder="Select Wishlist"
                                    placeholderStyle={{
                                        color: Colors.Grey,
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp(1.6),
                                    }}
                                    textStyle={{ color: Colors.Grey,fontFamily:'Poppins-Regular', fontSize:hp(1.6)}}
                                    style={{
                                        backgroundColor: 'white', borderColor: 'transparent',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowColor: Colors.Grey,
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                        elevation: 10,
                                        height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
                                        fontFamily:'Poppins-Regular',
                                    
                                    }}
                                    open={catOpen}
                                    // onOpen={onCatOpen}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                    value={value1}
                                    setValue={async e => {
                                        setValue1(e);
                                        // await getWishlist(e());
                                        // setTotalPrice('');
                                        // setgftPrice('');
                                    }}
                                    items={wishlistArr}
                                    setOpen={setCatOpen}
                                    setItems={setItems}
                                />
                            </View>
                            {/* <AppTextInput modal placeholder="Enter Wishlists" value={wishlists} onChangedText={setWishlists}  /> */}
                        </View>
                    </View>

                    <FilterButtons loading={loading} resetFilter={() => setIsVisible(!isVisible)} applyFilter={handleFavourite} />
                </View>
            </Modal>
        </>
    );
};

const FilterButtons = ({ resetFilter, applyFilter, loading }) => {
    return (
        <View style={[styles.section3, { zIndex: -1 }]} >
            <TouchableOpacity onPress={resetFilter}>
                <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
                    <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
                        Cancel
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilter}>
                <View style={styles.buttonStyle}>
                    {!loading ? <Text style={styles.buttonTextStyle}>
                        {'Add'}
                    </Text>
                        :
                        <ActivityIndicator size="small" color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    searchBarContainer: {
        width: wp('100%'),
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
        width: oreintation == 'LANDSCAPE' ? wp('90%') : wp('70%'),
        height: 45,
        paddingHorizontal: 5,
        fontFamily: 'Poppins-Regular',
        color: Colors.Grey,
    },
    searchFilterContainer: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    productContainer: {
        // flexWrap: 'wrap',
        flex: 1,
        // height:'100%',
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        backgroundColor: Colors.White,
    },
    buttonStyle: {
        backgroundColor: Colors.Blue,
        width: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5.5),
        borderRadius: 5,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        zIndex: 1,

    },
    buttonTextStyle: {
        fontSize: hp(2),
        color: Colors.White,
        fontFamily: 'Poppins-SemiBold'
    },
    titleTextStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Poppins-SemiBold'
    },
    section3: {
        flexDirection: 'row',
        // width: wp('100%'),
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    skeletonContainer: {
        marginTop: 5,
        marginHorizontal: 10,
        // paddingHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: "center",
        paddingVertical: 10,
        width: wp('40%'),
        height: 220,
        backgroundColor: 'white',
        // marginEnd: 5,
        // marginStart: 5,
        marginBottom: 30,
        shadowColor: Colors.Grey,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 8,
        elevation: 10,
    },
});
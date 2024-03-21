import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Platform,
    RefreshControl,
    TouchableOpacity,
    FlatList,
} from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Modal from "react-native-modal";
// import Orientation from 'react-native-orientation';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { captureScreen } from 'react-native-view-shot';
import RNFS from 'react-native-fs';

// Constants----------------------------------------------------------------
import LoadingModal from '../../../Constants/Modals/LoadingModal';
import SummaryCard from '../../../Constants/SummaryCard';
import { SortModal } from '../../../Constants/Modals';
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';

// Stats----------------------------------------------------------------
import { addwishlistdata } from '../../../Redux/WishlistReducer';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { oreintation } from '../../../Helper/NotificationService';
import { AuthContext } from '../../../Context';
import SocialPoster from '../../../Constants/Modals/SocialPoster';
import { scale } from 'react-native-size-matters';


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
                    { key: 'someId1', width: 120, height: 120, marginBottom: 6, borderRadius: 100 },
                    { key: 'someOtherId2', width: 100, height: 20, marginVertical: 5, },
                    { key: 'someOtherId3', width: 80, height: 20, marginVertical: 5 },
                    // { key: 'someOtherId', width: 180, height: 40, marginVertical: 10 },
                ]}
            >
            </SkeletonContent>
        </View>
    )
}


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

// const initial = Orientation.getInitialOrientation();


function SearchBar({ WishLists, setFilteredData, modalVisible, setModalVisible, setSearchText, searchText, isFilterActive }) {
    const search = (searchtext) => {
        setSearchText(searchtext);
        let filteredData = WishLists.filter(function (item) {
            return item.product_name.toLowerCase().includes(searchtext.toLowerCase());
        });
        setFilteredData(searchtext.length > 0 ? filteredData : []);
    };

    // (isFilterActive)



    return (
        <View style={{ flex: 0, backgroundColor: Colors.Wheat, alignItems: 'center', }}>
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBarItems}>
                    <Image source={Icons.magnifyIcon} style={{ tintColor: Colors.Grey, width: scale(18), height: scale(18), marginHorizontal: scale(10), }} />
                    <TextInput style={styles.searchBar} value={searchText} placeholder='Search...' onChangeText={search} placeholderTextColor={Colors.Grey} />
                </View>
                <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
                    <View style={styles.searchFilterContainer}>
                        <Icon name="sort-amount-up" type="font-awesome-5" color={isFilterActive == true ? Colors.LightestBlue : Colors.Grey} size={scale(18)} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View >
    );
};

function RenderWishlist({ trackItems, isLoading, refresh, select, setRefresh, navigation, fetchList, WishLists, filteredData, handleDelete }) {
    const listing = filteredData.length > 0 ? filteredData : WishLists;
    const onRefresh = React.useCallback((select) => {
        setRefresh(true);
        fetchList(select);
        wait(1000).then(() => setRefresh(false));
    }, [refresh]);

    return (
        <>
            {isLoading == true ?
                <View style={{ backgroundColor: Colors.White, justifyContent: 'center', alignItems: "center", paddingHorizontal: 10, width: '100%' }}>
                    <FlatList
                        data={[{}, {}, {}, {},]}
                        keyExtractor={(item, index) => index.toString()}

                        numColumns={2}
                        renderItem={({ item, index }) => <WishesSkeleton key={item} isLoading={isLoading} />}
                    />
                </View>
                : listing.length > 0
                    ?
                    <FlatList
                        data={listing}
                        refreshControl={
                            <RefreshControl
                                refreshing={refresh}
                                onRefresh={() => onRefresh(select)}
                            />
                        }
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={{ alignSelf: listing.length > 1 ? "center" : 'flex-start' }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ backgroundColor: Colors.White, justifyContent: 'center', paddingHorizontal: scale(10), alignItems: 'center', }}>
                                    <SummaryCard
                                        trackItems={trackItems}
                                        wish={false}
                                        navigation={navigation}
                                        select={select}
                                        fetchList={fetchList}
                                        item={item}
                                        tax={item?.product_tax}
                                        tip={item?.product_tip}
                                        productId={item ? item?.id : ''}
                                        productDes={item ? item?.product_description : ''}
                                        price={item ? item.product_price : ''}
                                        images={item ? item?.product_image : ''}
                                        storeName={item ? item?.store_name : ''}
                                        title={item ? item?.product_name : ''}
                                        leftIcon={Icons.editWishlistIcon}
                                        rightIcon={Icons.deleteIcon}
                                        noteditable={item.wish_type == '0' ? true : false}
                                        onRightPressed={() => handleDelete(item.id)}
                                    />
                                    <View style={{ flex: 1, height: 30 }} />
                                </View>
                            )
                        }}
                    />
                    // <View style={{ height: scale(500), backgroundColor: "red" }}></View>
                    :
                    <View style={{ flex: 1, backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Regular', color: Colors.Grey }}>No Wishlist Yet</Text>
                    </View>
            }
        </>
    );
};

const HorizontalList = ({ isLoading, data, select, setSelect, fetchList, setIsFilterActive }) => {
    return (
        <>
            {!isLoading && data.length > 0 ? <View style={{ margin: 10 }}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={data.sort((a, b) => a.created_at.localeCompare(b.created_at))}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={{
                                margin: scale(5),
                                backgroundColor: item.id == select ? Colors.ThemeColor : Colors.LightestGrey,
                                width: item.title.length > 14 ? oreintation == "LANDSCAPE" ? wp(17) : wp(45) : oreintation == "LANDSCAPE" ? wp(15) : wp(25),
                                padding: 10,
                                height: hp(4.5),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 100 / 2
                            }}
                                onPress={() => { setSelect(item.id), fetchList(item.id), AsyncStorage.removeItem('saved_sorting'), setIsFilterActive(false); }}>
                                <Text style={{ alignSelf: 'center', fontSize: hp(1.2), color: item.id == select ? Colors.White : Colors.Grey, fontFamily: 'Poppins-SemiBold', }}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
                :
                <View style={{ margin: 10 }}>
                    <FlatList
                        data={[{}, {}, {}]}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <View style={{
                                // margin: 5,
                                // backgroundColor: item.id == select ? Colors.LightBlue : Colors.LightestGrey,
                                width: wp(30),
                                // padding: 10,
                                height: hp(6),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 100 / 2
                            }} >
                                <SkeletonContent
                                    key={item}
                                    containerStyle={{ flex: 1, width: 300, alignItems: "center", justifyContent: 'space-around' }}
                                    isLoading={isLoading}
                                    animationType="shiver"
                                    duration={1500}
                                    animationDirection='horizontalRight'
                                    layout={[
                                        { key: 'someId', width: wp(25), height: hp(4.5), marginBottom: 6, borderRadius: 100 },
                                    ]}
                                >
                                </SkeletonContent>
                            </View>
                        )}
                    />
                </View>
            }
        </>

    )
};

function TutorialSix({ navigation, tutorialModal, setTutorialModal, tutorialCount, setTutorialCount }) {
    return (
        <View>
            <Modal isVisible={tutorialModal}>
                <View style={{ flex: 1 }}>
                    {tutorialCount == 0 &&
                        <TouchableOpacity
                            onPress={async () => {
                                // navigation.openDrawer();
                                setTutorialModal(false);
                                setTutorialCount(0);
                                await AsyncStorage.setItem('@tutorial_six', 'asd')

                            }}
                            // flexDirection: "column", padding: 10, position: 'absolute', top: Platform.OS === 'android' ? -27 : 3, right: -23,  width: wp('90%'), height: hp(22),justifyContent: 'space-between', alignItems: 'flex-end',backgroundColor:"red" 
                            style={{ padding: 10, flexDirection: "column", height: hp(19), width: wp('90%'), alignItems: "flex-end", justifyContent: "space-between", position: 'absolute', top: Platform.OS === 'android' ? -23 : oreintation == "LANDSCAPE" ? -30 : 10, right: oreintation == "LANDSCAPE" ? -55 : -23, }}>
                            <View style={{ width: 55, height: 55, borderRadius: 100 / 2, borderColor: Colors.White, borderWidth: 3, marginLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 40, height: 40, borderRadius: 100 / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.LightestBlue, }}>
                                    <Icon name="add-circle" type="ionicon" color="white" iconStyle={{ left: 1 }} />
                                </View>
                            </View>
                            <Icon name="arrowup" type="antdesign" style={{ marginRight: 5 }} size={40} color={Colors.White} />
                            <Text style={{ fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White, marginLeft: 10, }}>Tap here to add Wish.</Text>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        </View>
    );
};

export default function Wishlist({ navigation }) {
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const setWishlist = (data) => dispatch(addwishlistdata(data));
    const userDetails = useSelector(state => state.UserReducer);
    const getWishlist = useSelector(state => state.WishlistReducer);
    const [loading, setloading] = useState(false);
    const [horizontalListLoading, setHorizontalListLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [select, setSelect] = useState('0');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState(false);
    const [message, setMessage] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);
    const apiToken = userDetails?.api_token;
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [screenShotUri, setScreenShotUri] = useState('');
    const [tutorialModal, setTutorialModal] = useState(false);
    const [tutorialCount, setTutorialCount] = useState(0);
    const { trackItems, trackData, SignOut } = useContext(AuthContext);



    const handleDelete = async (id) => {
        const data = {
            product_id: await id,
        };
        const apiToken = await userDetails?.api_token;
        const parmas = JSON.stringify(data);
        await Service.AddToWishlist(parmas, apiToken, setMessage, fetchList);
    };

    const dist_wishlists = wishlists.map(x => (x.title === 'General' ? { ...x, id: '0' } : x));

    const checkTutoralSix = async () => {
        const tutorialSix = await AsyncStorage.getItem('@tutorial_six');
        if (!!tutorialSix) {
            setTutorialModal(false)
        }
        if (tutorialSix == null) {
            setTutorialModal(true)
        }
    }
    useEffect(() => {
        Service.CheckToken(SignOut);
        checkTutoralSix();
        fetchList('0');
        ShowWishlists();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Wishlist');

        // checkForTutorial1
        analytics().logViewItemList({
            item_list_name: 'Wishlist'
        });

        AsyncStorage.getItem('saved_sorting')
            .then((value) => {
                if (value) setIsFilterActive(true)
            })
    }, [isFocused]);

    const ShowWishlists = async () => {
        await Service.ShowWishlists(apiToken, setWishlists, setHorizontalListLoading);
    };

    const dispatchWishlist = (payload) => {
        setWishlistData(payload);
        setWishlist(payload)
    };
    // console.warn('getWishlist',getWishlist)


    async function fetchList(id) {
        if (!!id) await Service.GetWishlistsByUserIdWishId(userDetails.id, id, apiToken, dispatchWishlist, setloading, setRefresh);
    };



    const takeScreenShot = () => {
        captureScreen({
            format: 'jpg',
            quality: 0.9,
        }).then((uri) => {
            RNFS.readFile(uri, 'base64').then(async (uriRes) => {
                let urlString = 'data:image/jpeg;base64,' + uriRes;
                setScreenShotUri(urlString);
                setIsVisible(true)
            })
        },
            (error) => console.error('Oops, Something Went Wrong', error),
        );
    };

    const handleScreenShot = useCallback(() => {
        takeScreenShot();
    }, [screenShotUri]);

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.openDrawer()} onRightPressed={() => navigation.navigate('AddWish')} leftIcon={Icons.humburger} rightColor rightIconpng text="MY WISHLIST" />
                <SearchBar
                    WishLists={wishlistData}
                    setFilteredData={setFilteredData}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    isFilterActive={isFilterActive}
                />
                <HorizontalList
                    isLoading={horizontalListLoading}
                    data={dist_wishlists.sort((a, b) => a.title.localeCompare(b.title))}
                    select={select}
                    setSelect={setSelect}
                    fetchList={fetchList}
                    setIsFilterActive={setIsFilterActive}
                />
                <RenderWishlist
                    trackItems={trackItems}
                    isLoading={loading}
                    setRefresh={setRefresh}
                    select={select}
                    refresh={refresh}
                    navigation={navigation}
                    fetchList={fetchList}
                    WishLists={wishlistData}
                    filteredData={filteredData}
                    handleDelete={handleDelete}
                />
                {wishlistData.length > 0 ? <TouchableOpacity
                    onPress={handleScreenShot}
                    activeOpacity={.9} style={{
                        backgroundColor: Colors.LightestBlue,
                        width: scale(50),
                        height: scale(50),
                        borderRadius: scale(100),
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        bottom: scale(30),
                        right: scale(30),
                        elevation: 10,
                        shadowColor: Colors.Grey,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: scale(8),
                    }}>
                    <Icon name="share-square-o" type="font-awesome" color={Colors.White} size={scale(22)} />
                </TouchableOpacity> : null}
            </View>
            <SortModal
                setloading={setloading}
                setSelect={setSelect}
                fetchList={fetchList}
                setData={setWishlist}
                setFilterDataTo={setWishlistData}
                type={2}
                wishId={select}
                setRefresh={setRefresh}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setIsFilterActive={setIsFilterActive}
                userId={userDetails.id}
            />
            <SocialPoster isVisible={isVisible} setIsVisible={setIsVisible} uri={screenShotUri} setScreenShotUri={setScreenShotUri} />
            <TutorialSix navigation={navigation} tutorialModal={tutorialModal} setTutorialModal={setTutorialModal} tutorialCount={tutorialCount} setTutorialCount={setTutorialCount} />
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
        height: scale(60),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchBarItems: {
        flexDirection: 'row',
        height: scale(45),
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
    },
    searchBar: {
        width: oreintation == "LANDSCAPE" ? wp('90%') : wp('70%'),
        height: scale(45),
        paddingHorizontal: scale(5),
        fontFamily: 'Poppins-Regular',
        fontSize: scale(13),
        color: Colors.Grey,
    },
    searchFilterContainer: {
        height: scale(45),
        width: scale(45),
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
import React from 'react'
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils';
import { oreintation } from '../../Helper/NotificationService';



export default function Dropdown(props) {
    const {data, isSelected, setIsSelected, myWishlist, onPressed, collapse } = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        marginTop: 10,
                        alignSelf: 'center',
                        width: oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
                        height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                        borderRadius: 8,
                        borderColor: Colors.LightGrey,
                        shadowOffset: { width: 0, height: 8 },
                        shadowColor: Colors.Grey,
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                        borderWidth: .5,
                        borderColor: Colors.LightestGrey,
                    }}
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Text style={{
                        color: Colors.Grey,
                        fontSize: hp(1.6),
                        fontFamily: 'Poppins-Regular',
                    }}>{isSelected !== '' ? isSelected : 'Default'}</Text>
                    <Icon name="angle-down" type="font-awesome" size={24} color={Colors.Grey} style={{ marginEnd: 1 }} />
                </TouchableOpacity>
                {isOpen && <View
                    style={{
                        backgroundColor: 'white',
                        marginTop: 10,
                        alignSelf: 'center',
                        width: oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
                        height: hp(27),
                        borderRadius: 8,
                        borderColor: Colors.LightGrey,
                        shadowOffset: { width: 0, height: 8 },
                        shadowColor: Colors.Grey,
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 10,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                        position: 'absolute',
                        zIndex: 2,
                        top: 50,
                        borderWidth: .5, borderColor: Colors.LightestGrey,
                    }}
                >
                    <View style={{
                        backgroundColor: Colors.White, marginTop: 10, alignSelf: 'center', width: oreintation == 'LANDSCAPE' ? wp('92%') : wp('85%'), height: hp(5), borderRadius: 8, borderColor: Colors.LightGrey,
                        alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10, borderWidth: 1, borderColor: Colors.LightBlue
                    }}>
                        <TextInput placeholder="Search..." placeholderTextColor={Colors.Grey} placeholderStyle={{
                            color: Colors.Grey,
                            fontFamily: 'Poppins-Regular',
                            fontSize: hp(1),
                        }} style={{ color: Colors.Grey, width: wp('80%'), height: Platform.OS == 'android' ? hp(5.5) : hp(4.5), fontFamily: 'Poppins-Regular' }}
                            onChangeText={text => handleSearch(text)}
                            value={query}
                        />
                    </View>
                    {
                        isSelected !== '' ? <View
                            style={{
                                padding: 10, width: oreintation == 'LANDSCAPE' ? wp('92%') : wp('85%'), alignSelf: 'center', justifyContent: "space-between", flexDirection: 'row',
                                borderBottomWidth: 1, borderBottomColor: Colors.Blue
                            }}>
                            <Text style={{
                                color: Colors.Black,
                                fontSize: hp(1.6),
                                fontFamily: 'Poppins-Regular',
                            }}>{isSelected}</Text>
                            <Icon onPress={() => { setIsSelected('') }} name="close" size={20} color={Colors.Grey} style={{ marginEnd: 1 }} />
                        </View>
                            : null
                    }
                    <ScrollView contentContainerStyle={{ marginTop: 5, }}
                        indicatorStyle='white'
                        scrollEnabled={true}
                    >
                        {data.length > 0
                            ?
                            <FlatList
                                contentContainerStyle={{ marginTop: 5, padding: 10, }}
                                horizontal={false}
                                data={data}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={async () => {
                                                setIsOpen(false);
                                                setIsStateSelected(item.name)
                                            }} style={{ width: oreintation == 'LANDSCAPE' ? wp('92%') : wp('78%'), marginVertical: 10, alignSelf: 'center' }}>
                                            <Text
                                                style={{
                                                    color: Colors.Grey,
                                                    fontSize: hp(1.7),
                                                    fontFamily: 'Poppins-Regular',
                                                }}
                                            >{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                            : <View style={{ alignItems: "center", width: wp('90%'), }}>
                                <Text style={{ textAlign: 'center', color: Colors.Black, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', alignSelf: "center" }}>{found != '' ? found : 'No Friends Yet'}.</Text>
                            </View>
                        }
                    </ScrollView>

                </View>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: wp('85%'),
        height: hp('7%'),
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    text: {
        color: Colors.LightestBlue,
        fontSize: hp(2),
        marginEnd: 10,
        fontFamily: 'Lato-Bold'
    },
});
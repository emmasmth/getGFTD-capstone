import React, { Fragment, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlexStyle, ViewStyle, FlatList, ScrollView } from 'react-native';
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Colors } from '../../Utils';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

const CustomDropdown = ({ zIndex, name, label, title, items, onSelect, control, rules, leftIcon, iconType }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleItemSelect = (value, label) => {
        setSelectedValue(label);
        onSelect(value);
        toggleDropdown();
    };

    return (
        <View style={{}}>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                    return (
                        <>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.White,
                                    marginVertical: 10,
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: heightPercentageToDP(5.5),
                                    borderRadius: 6,
                                    borderColor: error ? Colors.Red : Colors.LightestGrey,
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowColor: Colors.Grey,
                                    shadowOpacity: 0.3,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                }}
                                onPress={() => setShowDropdown(!showDropdown)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                    <Icon type={iconType} name={leftIcon} size={22} color={Colors.ThemeColor} />
                                    <Text style={[styles.dropdownTitle, { color: selectedValue ? '#171725' : '#66707A', marginStart: 10, }]}>{selectedValue || title}</Text>
                                </View>
                                <Icon name={showDropdown == true ? "angle-up" : "angle-down"} type="font-awesome" size={24} color={Colors.ThemeColor} style={{ marginEnd: 1, }} />
                            </TouchableOpacity>
                            {
                                showDropdown &&
                                <View
                                    style={{
                                        backgroundColor: Colors.White,
                                        marginTop: 10,
                                        alignSelf: 'center',
                                        width: '100%',
                                        height: 160,
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
                                        position: 'absolute',
                                        zIndex: 2,
                                        top: 50,
                                        borderWidth: .5,
                                        borderColor: Colors.LightestGrey,
                                    }}
                                >
                                    {items.length > 0
                                        ?
                                        <FlatList
                                            style={{ width: '100%' }}
                                            nestedScrollEnabled={true}
                                            contentContainerStyle={{ marginTop: 5, padding: 10, width: '100%' }}
                                            horizontal={false}
                                            data={items}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => { handleItemSelect(item.value, item.label), onChange(item.value) }}
                                                        style={{ padding: 5 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: Colors.Grey,
                                                                fontSize: heightPercentageToDP(1.7),
                                                                fontFamily: 'Poppins-Regular',
                                                            }}
                                                        >{item?.label}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                        : <View style={{ alignItems: "center", width: wp('90%'), }}>
                                            <Text style={{ textAlign: 'center', color: Colors.Black, fontSize: heightPercentageToDP(1.8), fontFamily: 'Poppins-Regular', alignSelf: "center" }}>{found != '' ? found : 'No data Yet'}.</Text>
                                        </View>
                                    }
                                </View>
                            }
                            {error && (
                                <Text style={styles.error}>{error.message || 'Error'}</Text>
                            )}
                        </>
                    )
                }}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    dropdownButton: {
        width: '100%',
        height: heightPercentageToDP(5.5),
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 6,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        // marginVertical: 10,
        borderWidth: .5,
        borderColor: Colors.LightestGrey

    },
    dropdownList: {
        width: '100%',
        position: 'absolute',
        top: 60,
        padding: 10,
        // left: 0,
        // right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        height: 160,
        // zIndex: -2,
    },
    dropdownItem: {
        // padding: 10,
        // position:"relative",
        // zIndex:1000,
    },
    dropdownTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: heightPercentageToDP(1.6),
        color: '#66707A',
    },
    label: {
        fontSize: heightPercentageToDP(1.5),
        color: Colors.ThemeColor,
        // marginBottom: 10,
        fontFamily: 'Poppins-Regular'
    },
    error: {
        color: Colors.Red,
        alignSelf: 'stretch',
        fontFamily:'Poppins-Regular',
        fontSize: heightPercentageToDP(1.2)
    },
});

export default CustomDropdown;

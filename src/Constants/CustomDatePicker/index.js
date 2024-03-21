import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { Colors } from '../../Utils';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Controller } from 'react-hook-form';

const CustomDatePicker = ({ control, name, rules }) => {
    const [date, setDate] = useState('')
    const [dob, setDob] = useState('')
    const [open, setOpen] = useState(false)
    return (
        <>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                    return (
                        <>
                            <TouchableWithoutFeedback onPress={() => setOpen(!open)}>
                                <View style={[styles.datePickerStyle, {
                                    borderWidth: 1,
                                    borderColor: error ? Colors.Red : Colors.LightestGrey,
                                }]}>
                                    <View style={{}}>
                                        <Icon name="calendar" type="ionicon" size={22} color={Colors.ThemeColor} />
                                    </View>
                                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                        <Text style={{
                                            color: Colors.Grey,
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: heightPercentageToDP(1.6),
                                        }}>{dob != '' ?
                                            moment(dob).format('MM-DD-YYYY') :
                                            <Text style={{
                                                color: Colors.Grey,
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: heightPercentageToDP(1.6),
                                            }}> Date of Birth
                                                <Text style={{
                                                    color: Colors.Grey,
                                                    fontFamily: 'Poppins-Regular',
                                                    fontSize: heightPercentageToDP(1.3),
                                                }}>{' ( age must be 18 years )'}
                                                </Text>
                                            </Text>
                                            }
                                        </Text>
                                    </View>
                                    <View>
                                        <Icon name="select-arrows" type="entypo" size={18} color={Colors.ThemeColor} />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <DateTimePickerModal
                                isVisible={open}
                                mode="date"
                                onConfirm={(date) => {
                                    setOpen(false)
                                    onChange(moment(date).format('MM-DD-YYYY'))
                                    setDate(date)
                                    setDob(date)
                                }}
                                onCancel={() => {
                                    setOpen(false)
                                }}
                            />
                            {error && (
                                <Text style={styles.error}>{error.message || 'Error'}</Text>
                            )}
                        </>
                    )
                }}
            />
        </>
    )
};

export default CustomDatePicker;

const styles = StyleSheet.create({
    datePickerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        height: heightPercentageToDP(5.5),
        width: '100%',
        backgroundColor: Colors.White,
        justifyContent: 'flex-start',
        borderRadius: 6,

        marginVertical: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    error: {
        color: Colors.Red,
        alignSelf: 'stretch',
        fontFamily:'Poppins-Regular',
        fontSize: heightPercentageToDP(1.2)
    },
})
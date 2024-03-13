import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Fragment } from 'react'
import { Colors } from '../../Utils'
import { Icon } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Controller } from 'react-hook-form';

const CustomSSNTextInput = ({ control, iconType, name, rules = {},onPress, leftIcon, placeholder, rightIcon, secureTextEntry = false, }) => {
    const [hide, setHide] = React.useState(false);
    const [secureEntry, setSecureEntry] = React.useState(secureTextEntry);
    const handleHidden = () => {
        setHide(!hide);
        setSecureEntry(!secureEntry)
    };
    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                    return (
                        <Fragment>
                            <TouchableOpacity onPress={onPress} style={[styles.inputView, { borderWidth: 1, borderColor: error ? Colors.Red : Colors.LightestGrey }]}>
                                {leftIcon ? <Icon type={iconType} name={leftIcon} size={22} color={Colors.ThemeColor} /> : null}
                                <>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            backgroundColor: "white",
                                            alignItems: "center",
                                            width: wp(70),
                                            height: hp(5),
                                            // justifyContent: "center",
                                            paddingStart:10,
                                            // borderColor:
                                            //     error ? Colors.Red : Colors.Grey,
                                            // borderWidth: 1,
                                            // borderRadius: 8
                                        }}>
                                        <Text style={{ fontSize: hp(1.6), fontFamily: "Poppins-Regular", color: Colors.Grey }}>XXX-XX-</Text>
                                        <TextInput maxLength={4}
                                            style={{
                                                fontSize: hp(1.6),
                                                fontFamily: "Poppins-Regular",
                                                color: Colors.Grey,
                                                width: 70,
                                            }}
                                            editable={false}
                                            clearTextOnFocus={false}
                                            placeholder='____'
                                            placeholderTextColor={Colors.Grey}
                                            onBlur={onBlur}
                                            onChangeText={(text) => { setSsn(text), onChange(text) }}
                                            value={value}
                                            keyboardType="number-pad"
                                        />
                                    </View>
                                </>
                                {secureTextEntry ? <Icon onPress={handleHidden} type='ionicon' name={hide ? 'eye' : 'eye-off'} size={22} color={Colors.ThemeColor} />
                                    :
                                    <View style={{ width: 22 }} />}
                            </TouchableOpacity>
                            {error && (
                                <Text style={styles.error}>{error.message || 'Error'}</Text>
                            )}
                        </Fragment>
                    )
                }}
            />

        </View>
    )
}

export default CustomSSNTextInput

const styles = StyleSheet.create({
    container: {
        zIndex: -1
        // flex:1,
        // backgroundColor: Colors.White,
    },
    inputView: {
        width: '100%',
        height: hp(5.5),
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
        marginVertical: 10,
        borderWidth: .5,
        borderColor: Colors.LightestGrey
    },
    textInputView: {
        width: '80%',
        // backgroundColor: "yellow",
        height: hp(5),
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.6),
        // borderRadius:8,
    },
    error: {
        color: Colors.Red,
        alignSelf: 'stretch',
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.2)
        // marginTop:10,
    },
})
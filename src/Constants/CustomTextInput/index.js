import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { Fragment } from 'react';
import { Colors } from '../../Utils';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Controller } from 'react-hook-form';

const CustomTextInput = ({ control, iconType, name, rules = {}, leftIcon, placeholder, rightIcon, secureTextEntry = false, num, numeric  }) => {
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
                            <View style={[styles.inputView, { borderWidth: 1, borderColor: error ? Colors.Red : Colors.LightestGrey, }]}>
                                {leftIcon ? <Icon type={iconType} name={leftIcon} size={hp(2.2)} color={Colors.ThemeColor} /> : null}
                                <TextInput
                                    clearTextOnFocus={false}
                                    placeholder={placeholder}
                                    style={styles.textInputView}
                                    secureTextEntry={secureEntry}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholderTextColor={Colors.Grey}
                                    keyboardType={num ? 'decimal-pad' : numeric ? 'phone-pad' : 'default'}

                                />
                                {secureTextEntry ? <Icon onPress={handleHidden} type='ionicon' name={hide ? 'eye' : 'eye-off'} size={hp(2.2)} color={Colors.ThemeColor} />
                                    :
                                    <View style={{ width: 22 }} />}
                            </View>
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

export default CustomTextInput

const styles = StyleSheet.create({
    container: {
        zIndex: -1,
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
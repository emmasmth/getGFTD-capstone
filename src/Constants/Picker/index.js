import React from 'react';
import {
    Text,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Chevron } from 'react-native-shapes';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { Colors } from '../../Utils';

export default class Picker extends React.Component {
    constructor(props) {
        super(props);
        this.inputRefs = {
            firstTextInput: null,
            favSport0: null,
            favSport1: null,
            lastTextInput: null,
            favSport5: null,
        };
        this.state = {
            favSport0: undefined,
        };
        this.InputAccessoryView = this.InputAccessoryView.bind(this);
    };

    InputAccessoryView() {
        return (
            <View style={defaultStyles.modalViewMiddle}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState(
                            {
                                favSport5: this.state.previousFavSport5,
                            },
                            () => {
                                this.inputRefs.favSport5.togglePicker(true);
                            }
                        );
                    }}
                    hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                    <View testID="needed_for_touchable">
                        <Text
                            style={[
                                defaultStyles.done,
                                { fontWeight: 'normal', color: 'red' },
                            ]}>
                            Cancel
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text>Name | Prefer</Text>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.inputRefs.favSport5.togglePicker(true);
                    }}
                    hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                    <View testID="needed_for_touchable">
                        <Text style={defaultStyles.done}>Done</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    render() {
        const placeholder = {
            label: this.props.text,
            value: null,
            color: Colors.Grey,
        };

        return (
            <View style={styles.container}>
                <View
                    style={styles.scrollContainer}>
                    <RNPickerSelect
                        placeholder={placeholder}
                        items={this.props.data != undefined ? this.props.data : []}
                        onValueChange={value => {
                            this.props.setValue(value)
                            this.props.setParams ? this.props.setParams(value) : null
                            // console.log('valueeeee=',value)
                            this.setState({
                                favSport0: value,
                            });
                        }}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 10,
                                right: 12,
                            },
                        }}
                        value={this.state.favSport0}
                        useNativeAndroidPickerStyle={false}
                        textInputProps={{ underlineColor: 'yellow' }}
                        Icon={() => {
                            return (
                                <View style={{ alignSelf: 'center', justifyContent: 'center', top: 8, right: 5, }}>
                                    {this.props.chevron && <Chevron size={1.5} color="gray" />}
                                </View>
                            )
                        }}
                    />
                    <View paddingVertical={5} />
                </View>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    scrollContainer: {
        marginVertical: 10,
    },
    scrollContentContainer: {
        paddingTop: 40,
        paddingBottom: 10,
        marginVertical: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: Platform.OS == 'android' ? hp(6) : hp(5.5),
        width: wp('90%'),
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors.LightestGrey,
        borderRadius: 4,
        color: Colors.Grey,
        backgroundColor: Colors.White,
        paddingRight: 30,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    inputAndroid: {
        height: Platform.OS == 'android' ? hp(6) : hp(5.5),
        width: wp('90%'),
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: Colors.LightestGrey,
        borderRadius: 8,
        color: Colors.Grey,
        backgroundColor: Colors.White,

        paddingRight: 30,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10, 
    },
});

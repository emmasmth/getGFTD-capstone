import React from 'react';
import {
    Button,
    Text,
    TextInput,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Chevron } from 'react-native-shapes';


// import { Colors } from 'react-native-paper';
// import { Ionicons } from 'react-native-vector-icons';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { Colors } from '../../Utils';
// import RNPickerSelect, { defaultStyles } from './debug';

const sports = [
    {
        label: 'Football',
        value: 'football',
    },
    {
        label: 'Baseball',
        value: 'baseball',
    },
    {
        label: 'Hockey',
        value: 'hockey',
    },
];

export default class RowPicker extends React.Component {
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
            numbers: [
                {
                    label: '1',
                    value: 1,
                    color: 'orange',
                },
                {
                    label: '2',
                    value: 2,
                    color: 'green',
                },
            ],
            favSport0: undefined,
            favSport1: undefined,
            favSport2: undefined,
            favSport3: undefined,
            favSport4: 'baseball',
            previousFavSport5: undefined,
            favSport5: null,
            favNumber: undefined,
        };

        this.InputAccessoryView = this.InputAccessoryView.bind(this);
    }


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
    }

    dateList = () => {

        let dataList = this.props.data.map(x => ({
            label: x.userInfo.name,
            value: x.user.Info.id
        }));
        return dataList;
    }

    render() {
        const placeholder = {
            label: this.props.text,
            value: null,
            color: '#9EA0A4',
        };

        return (
            <View style={styles.container}>
                <View
                    style={styles.scrollContainer}>
                    {/* and value defined */}
                    <RNPickerSelect
                        placeholder={placeholder}
                        items={this.props.data != undefined ? this.props.data:[]}
                        onValueChange={value => {
                            this.props.setValue(value)
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
    }
}

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
        width: wp('40%'), height: hp(5.5),
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
        elevation: 10,// to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        width: wp('40%'), height: hp(5.5),
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
        elevation: 10, // to ensure the text is never behind the icon
    },
});

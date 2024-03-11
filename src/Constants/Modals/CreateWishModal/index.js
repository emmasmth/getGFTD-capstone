import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../Utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { oreintation } from '../../../Helper/NotificationService';
import Modal from "react-native-modal";
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import { ActivityIndicator } from 'react-native';
const theme = {
  roundness: 2,
  colors: {
      primary: Colors.ThemeColor,
      accent: Colors.LightBlue,
  },
};


const CreateWishModal = ({ btnLoading, wishlistsValue, isVisible, setIsVisible, setWishlists, highlighted1, setHighlighted1, checked, setChecked, setPrivacy, highlighted2, setHighlighted2, clearState, handleContinue }) => {
  return (
    <View>
      <Modal
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        isVisible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}>
        <TouchableOpacity style={{
          justifyContent: 'space-between',
          top: hp(0),
          padding: wp(5),
          width: wp('80%'),
          height: hp(47),
          alignSelf: 'center',
          backgroundColor: 'white',
          elevation: 10,
          shadowOffset: { width: 0, height: 8 },
          shadowColor: Colors.Grey,
          shadowRadius: 10,
          shadowOpacity: 0.3,
          borderRadius: 8,
        }}
          onPress={() => Keyboard.dismiss()}
          activeOpacity={1}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...oreintation == 'LANDSCAPE' ? { marginTop: -20 } : null
          }}
          >
            <Text style={{
              fontSize: hp(2.5),
              color: Colors.LightBlue,
              fontFamily: 'Poppins-SemiBold'
            }}>Create New Wishlist</Text>
            <Icon type="material" name="close" color={Colors.Grey} onPress={() => { setIsVisible(!isVisible), clearState() }} />
          </View>
          <View style={{ flex: 1, marginVertical: 30 }}>
            <View style={{ flexDirection: 'column', marginVertical: 5 }}>
              <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8) }}>
                Wishlist Name:
              </Text>
              <View style={[styles.InputConatiner, { borderColor: highlighted1 == true ? 'red' : Colors.LightestBlue, }]}>
                <View style={styles.textInputView}>
                  <TextInput
                    maxLength={20}
                    placeholder={"Enter Wishlist Name"}
                    onChangeText={(e) => { setWishlists(e), setHighlighted1(false) }}
                    value={wishlistsValue}
                    style={styles.textInputStyle}
                    placeholderTextColor={Colors.Grey}
                    placeholderStyle={styles.placeholderStyle}
                    keyboardType={'default'}
                  />
                </View>
              </View>
              <Text style={{ textAlign: "right", color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), marginRight: 5 }}>{`${wishlistsValue.length}/20`}</Text>
            </View>
            <View style={{ flexDirection: 'column', }}>
              <Text style={{ color: highlighted2 == true ? 'red' : Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8) }}>
                Select Privacy
              </Text>
              <View style={{ flexDirection: 'row', }}>
                <View style={styles.checkLists}>
                  <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked('first'), setPrivacy(1), setHighlighted2(false) }}
                    style={{ width: 8, height: 8, }}
                  />
                  <Text style={styles.textStyle}>{'Public'}</Text>
                  <RadioButton.Android
                    theme={theme}
                    uncheckedColor={Colors.Grey}
                    value="first"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked('second'), setPrivacy(2), setHighlighted2(false) }}
                    style={{ width: 8, height: 8, }}
                  />
                  <Text style={styles.textStyle}>{'Private'}</Text>
                </View>
              </View>
            </View>
          </View>
          <FilterButtons loading={btnLoading} resetFilter={() => { setIsVisible(!isVisible), clearState() }} applyFilter={handleContinue} />
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const FilterButtons = ({ resetFilter, applyFilter, loading }) => {
  return (
    <View style={styles.section3} >
      <TouchableOpacity onPress={resetFilter}>
        <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
          <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
            Cancel
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={applyFilter} disabled={loading}>
        <View style={styles.buttonStyle}>
          {!loading
            ? <Text style={styles.buttonTextStyle}>
              {'Create'}
            </Text>
            :
            <ActivityIndicator size="small" color="white" />
          }
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default CreateWishModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
  },
  DDcontainer: {
    backgroundColor: 'white',
    width: wp('85%'),
    height: hp('8%'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  section2: {
    flex: 2,
    alignItems: 'center',
  },
  text: {
    color: Colors.LightestBlue,
    fontSize: hp(2.2),
    marginEnd: 10,
    fontFamily: 'Poppins-SemiBold'
  },
  section3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: oreintation == 'LANDSCAPE' ? "space-between" : 'space-around',
    zIndex: -1
  },
  buttonStyle: {
    backgroundColor: Colors.LightestBlue,
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
    fontFamily: 'Poppins-Bold'
  },

  checkLists: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    color: Colors.Grey,
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
  },
  InputConatiner: {
    flexDirection: "column",
    height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
    width: wp('70%'),
    backgroundColor: Colors.White,
    justifyContent: 'flex-start',
    borderRadius: 6,
    borderWidth: .5,

    marginVertical: 10,
  },
  textInputView: {
    flexDirection: 'row',
    width: wp('65%'),
    height: Platform.OS == 'android' ? hp(6) : hp(5),
  },
  textInputStyle: {
    backgroundColor: Colors.White,
    color: Colors.Grey,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(1.6),
    width: wp('65%'),
    height: Platform.OS == 'android' ? hp(6) : hp(5),
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  placeholderStyle: {
    color: Colors.Grey,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(1),
  },
  textInputIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightImage: {
    height: 15,
    width: 20
  },
  textValidationStyle: {
    color: Colors.Red,
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
})
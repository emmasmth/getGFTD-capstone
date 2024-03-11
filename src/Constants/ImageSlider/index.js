import React, { useEffect, } from 'react';
import { Image } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';

const ImageSlider = ({ 
  images 
}) => {
  // const images = [
  //   require('../../Assets/Images/banner.png'),
  //   require('../../Assets/Images/banner.png'),
  //   require('../../Assets/Images/banner.png'),
  //   require('../../Assets/Images/banner.png'),
  //   // require('../../../assets/icons/banner.png'),
  // ];
  return (
    <Swiper style={styles.wrapper}
      showsPagination={false}
      autoplay={true}
      key={images.length}
      loop={true}
      horizontal={true}
    >
      {images.map((image, index) => {
        return (
          <View key={index} style={styles.slide}>
            <Image source={image} style={styles.image}
            />
          </View>
        )
      })}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  container: {},
  wrapper: { height: heightPercentageToDP(16),},
  slide: {
    alignSelf: "center",
  },
  image: {
    width: widthPercentageToDP(89),
    height: heightPercentageToDP(13),
    resizeMode: 'cover',
    borderRadius: 12,
  },
});

export default ImageSlider;

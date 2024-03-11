// import React, { useState, useRef } from 'react';
// import { View, TextInput, StyleSheet } from 'react-native';

// const OTPInputField = () => {
//   const [otp, setOTP] = useState('');
//   const inputRefs = useRef([]);

//   const handleTextChange = (value, index) => {
//     setOTP((prevOTP) => {
//       const newOTP = [...prevOTP];
//       newOTP[index] = value;
//       return newOTP;
//     });

//     // Move focus to the next input field
//     if (value !== '' && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleBackspacePress = (index) => {
//     if (index > 0) {
//       setOTP((prevOTP) => {
//         const newOTP = [...prevOTP];
//         newOTP[index - 1] = '';
//         return newOTP;
//       });
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const renderInputFields = () => {
//     const inputFields = [];

//     for (let i = 0; i < 6; i++) {
//       const isLastInput = i === 5;

//       inputFields.push(
//         <TextInput
//           key={i}
//           ref={(ref) => (inputRefs.current[i] = ref)}
//           style={[styles.inputField, isLastInput && styles.lastInputField]}
//           maxLength={1}
//           keyboardType="numeric"
//           onChangeText={(value) => handleTextChange(value, i)}
//           onKeyPress={({ nativeEvent }) => {
//             if (nativeEvent.key === 'Backspace') {
//               handleBackspacePress(i);
//             }
//           }}
//           value={otp[i] || ''}
//         />
//       );
//     }

//     return inputFields;
//   };

//   return <View style={styles.container}>{renderInputFields()}</View>;
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   inputField: {
//     width: 40,
//     height: 40,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 4,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   lastInputField: {
//     marginRight: 0,
//   },
// });

// export default OTPInputField;


import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

const OTPInputField = () => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleTextChange = (value, index) => {
    setOTP((prevOTP) => {
      const newOTP = [...prevOTP];
      newOTP[index] = value;
      return newOTP;
    });

    // Move focus to the next input field
    if (value !== '' && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspacePress = (index) => {
    if (index > 0) {
      setOTP((prevOTP) => {
        const newOTP = [...prevOTP];
        newOTP[index - 1] = '';
        return newOTP;
      });
      inputRefs.current[index - 1].focus();
    }
  };

  const handleClearPress = () => {
    setOTP(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  const renderInputFields = () => {
    const inputFields = [];

    for (let i = 0; i < 6; i++) {
      const isLastInput = i === 5;

      inputFields.push(
        <TextInput
          key={i}
          ref={(ref) => (inputRefs.current[i] = ref)}
          style={[styles.inputField, isLastInput && styles.lastInputField]}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(value) => handleTextChange(value, i)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              handleBackspacePress(i);
            }
          }}
          value={otp[i] || ''}
        />
      );
    }

    return inputFields;
  };

  return (
    <View style={styles.container}>
      {renderInputFields()}
      <TouchableOpacity onPress={handleClearPress}>
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputField: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    fontSize: 16,
    textAlign: 'center',
  },
  lastInputField: {
    marginRight: 0,
  },
  clearText: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 10,
  },
});

export default OTPInputField;

import React from 'react'
import { View, Modal,ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from '../../../Utils';

export default function LoadingModal({loading}) {
    return(
        <Modal
            visible={loading}
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ActivityIndicator size="large" color={Colors.Blue} />
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})

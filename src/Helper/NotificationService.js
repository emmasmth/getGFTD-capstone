import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import Orientation from 'react-native-orientation';
import { Platform } from 'react-native';
import { Alert } from 'react-native';

export async function checkUserPermission() {
    messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                getFcmToken();
            } else {
                requestUserPermission()
            }
        }).catch(error => {
            let err = `check permission error ${error}`
            console.log('check user permission error', err)
        })
};

export async function requestUserPermission() {
    await messaging().requestPermission()
        .then(async (enabled) => {
            if (enabled) {
                getFcmToken();
            } else {
                await messaging().requestPermission()
                    .then(() => {
                        getFcmToken();
                        // console.log("+++ PERMISSION REQUESTED +++++")
                    })
                    .catch(error => { console.log(" +++++ ERROR RP ++++ " + error) })
            }
        })
        .catch((err) => {
            Alert.alert(
                'Attention',
                'Please allow notifications permission.',
                [
                    {
                        text: "OK",
                        onPress: () => console.log('alert')
                    }
                ]
            )
            console.log('permission failed', err);
        })

};

async function getFcmToken() {
    let checkToken = await AsyncStorage.getItem('@fcmToken');
    // console.log('Checktoken', Platform.OS == 'android' ? 'Android ' + checkToken : 'IOS ' + checkToken)
    if (!checkToken) {
        try {
            const fcmToken = await messaging().getToken()
            if (!!fcmToken) {
                // console.log('fcmToken for setting in async===>', fcmToken)
                await AsyncStorage.setItem('@fcmToken', fcmToken)
            }
        }
        catch (err) {
            if (err) {
                Alert.alert(
                    'Attention',
                    'Please allow notifications permission or close and restart your app.',
                    [
                        {
                            text: "OK",
                            onPress: () => console.log('alert')
                        }
                    ]
                )
            }
        }
    }
};

export async function notificationListener() {
    // console.log('Lister for notifications===>')
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        // console.log('Background State', remoteMessage.notification)
    });
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                console.log('Foreground State', remoteMessage.notification)

            };
        });
};
export async function notificationControllerAndroid() {
    // console.log('Notification for android')
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        // console.log('android remote messaging', remoteMessage)
        if (remoteMessage) {
            console.log(
                'Notification caused app to open from open state:',
                remoteMessage.notification,
            );
        };

        PushNotification.localNotification({
            message: remoteMessage.notification?.body,
            title: remoteMessage?.notification?.title,
            // bigPictureUrl: remoteMessage?.notification?.android?.imageUrl,
            // smallIcon: remoteMessage?.notification?.android?.imageUrl,
        });
    });

    return unsubscribe;
};


export async function notificationControllerIos() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        if (remoteMessage) {
            console.log(
                'IOS Notification caused app to open from open state:',
                remoteMessage.notification,
            );
        };
        PushNotificationIOS.addNotificationRequest({
            id: remoteMessage.messageId,
            body: remoteMessage.notification.body,
            title: remoteMessage.notification.title,
            userInfo: remoteMessage.data,
        })

    });


    return unsubscribe;
};
export async function setupPushNotification(handleNotification) {
    PushNotification.configure({
        onNotification: function (notification) {
            handleNotification(notification)
        },
        popInitialNotification: true,
        requestPermissions: true,
    })
    return PushNotification;
};

// export const oreintation = Orientation.getInitialOrientation();
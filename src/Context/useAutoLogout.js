import { useState, useRef, useCallback, useEffect, useMemo, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '.';


export default () => {
    const { signOut } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const token = "token value";
    const lastInteraction = useRef(new Date());
    const [timeWentInactive, setTimeWentInactive] = useState < Date | null > (null);
    const inactivityTimer = useRef < boolean | NodeJS.Timeout | number > (false);
    const waitForInactivity = useRef < number > (0);

    const INACTIVITY_CHECK_INTERVAL_MS = 1000;

    useEffect(() => {
        if (token) {
            //  180 secs
            const autologoutTime = 180;
            waitForInactivity.current = autologoutTime * 1000;
        }
    }, [token, waitForInactivity.current]);

    const performAutoLogout = useCallback(() => {
        console.log('User was inactive so we logout them.')
        // signOut();
    }, []);

    const checkInactive = useCallback(() => {
        if (inactivityTimer.current) {
            return;
        }
        inactivityTimer.current = setInterval(() => {
            if (Math.abs(new Date().valueOf() - lastInteraction.current.valueOf()) >=
                waitForInactivity.current) {
                setIsInactive();
            }
        }, INACTIVITY_CHECK_INTERVAL_MS);
    }, []);

    useEffect(() => {
        if (token) {
            checkInactive();
        }
    }, [checkInactive]);

    const setIsActive = useCallback(() => {
        lastInteraction.current = new Date();
        if (timeWentInactive) {
            setTimeWentInactive(null);
        }

        if (token) {
            checkInactive();
        }
    }, []);

    const setIsInactive = () => {
        setTimeWentInactive(new Date());
        performAutoLogout();
        clearInterval(inactivityTimer.current);
        inactivityTimer.current = false;
    };

    const handleMoveShouldSetPanResponder = useCallback(() => {
        setIsActive();
        return false;
    }, [setIsActive]);

    const handleStartShouldSetPanResponder = useCallback(() => {
        setIsActive();
        return false;
    }, [setIsActive]);

    const panResponder = useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderTerminationRequest: () => true,
            onShouldBlockNativeResponder: () => false,
        }), []);

    return {
        panResponder,
    };
}

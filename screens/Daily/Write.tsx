import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import ContentBox from "../../components/layout/ContentBox";
import InputField from "../../components/generalUI/InputField";
import Button from "../../components/buttons/Button";
import MascotTip from "../../components/misc/MascotTip";
import { create as uploadJoke } from "../../services/joke";
import JokesLeftIndicator from "../../components/misc/JokesLeftIndicator";
import { colors } from '../../components/misc/Colors';
import ActiveTabContext from '../../context/ActiveTabContext';
import { SCREEN_HEIGHT } from '../../components/layout/ScreenView';
import Modal from '../../components/generalUI/Modal';
import Text from '../../components/generalUI/Text';
import PriceDisplay from '../../components/misc/PriceDisplay';
import { toggleGoToStore } from '../../state-management/goToStore';
import { showToast } from "../../state-management/toast";
import { api } from '../../api/api';
import { useDispatch } from 'react-redux';
import { store } from '../../state-management/reduxStore';
import { decrementCoins, incrementCoins, updateCoins } from '../../state-management/coinSlice';
import { UserDataManager } from '../../services/userDataManager';
import { loading } from '../../state-management/loading';

export default function Write() {
    const { activeTab } = useContext(ActiveTabContext);
    const [inputValue, setInputValue] = useState('');
    const jokesLeftIndicatorRef = useRef<{ refreshIndicator: () => void }>(null);
    const [noSubmissionsModalVisiable, setNoSubmissionsModalVisible] = useState(false);

    useEffect(() => {
        if (activeTab === 0) {
            jokesLeftIndicatorRef.current?.refreshIndicator();
        }
    }, [activeTab]);

    let submitJoke = async () => {
        let result;
        loading(true);
        try {
            result = await uploadJoke(inputValue);
        } catch {
            setNoSubmissionsModalVisible(true);
            loading(false);
            throw new Error();
        }
        loading(false);
        setInputValue('');

        Keyboard.dismiss();

        showToast('Your joke has been submitted! You can read it again by tapping on "My Jokes"!')

        jokesLeftIndicatorRef.current?.refreshIndicator();
    }

    let purchaseSubmission = async () => {
        setNoSubmissionsModalVisible(false);
        store.dispatch(decrementCoins(50)); 
        loading(true);
        try {
            const result = await api('POST', '/jokeSubmission/purchase', null, await UserDataManager.getToken());
            await new Promise(resolve => setTimeout(resolve, 50));
            loading(false);
            jokesLeftIndicatorRef.current?.refreshIndicator();
            console.log(result);
            if (result.error) { 
                throw new Error(result.error);
            }
            showToast('Purchase successful! You can now submit more jokes.');
        } catch (error) {
            jokesLeftIndicatorRef.current?.refreshIndicator();
            store.dispatch(incrementCoins(50));
            loading(false);
            showToast('Purchase failed. Please try again.');
            console.error(error);
        }
    }

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };

    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[
                styles.container,
                {
                    // paddingBottom: keyboardHeight,
                    // maxHeight: SCREEN_HEIGHT - keyboardHeight,
                    justifyContent: keyboardVisible ? "flex-start" : "center",
                    paddingTop: 20,
                }
            ]}>
                <ContentBox title="Write" style={{ maxHeight: SCREEN_HEIGHT - 100 }} headerColor={colors.yellow.dark}>
                    <InputField
                        style={{ maxHeight: SCREEN_HEIGHT - (350) }}
                        placeholder="Write your joke here..."
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                    <View style={{ alignItems: "center" }}>
                        <Button variant="submit" shadowHeight={8} fontSize={16} width={100} height={28} onPress={submitJoke} label="Sumbit" />
                    </View>
                </ContentBox>
                <JokesLeftIndicator purchaseSubmission={purchaseSubmission} ref={jokesLeftIndicatorRef} />
                <Modal onRequestClose={() => setNoSubmissionsModalVisible(false)} modalVisible={noSubmissionsModalVisiable}>
                    <ContentBox title="Out of submissions!">
                        <View style={{ marginTop: 10 }}>
                            <View style={{ alignItems: "center", gap: 10 }}>
                                <Text shadow={false} style={{ textAlign: "center", color: colors.purple.medium }} size={15}>You are out of joke submissions for today. Buy another to post your joke! </Text>
                                <Button
                                    onPress={() => {
                                        purchaseSubmission();
                                    }}
                                    width={190}
                                    variant="play"
                                    borderRadius={14}
                                >
                                    <View style={{
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        gap: 4,
                                    }}>
                                        <Text size={16}>Buy submission</Text>
                                        <PriceDisplay style={{ fontSize: 16 }} price={50} />
                                    </View>
                                </Button>
                            </View>
                        </View>
                    </ContentBox>
                </Modal>
                {/* <MascotTip /> */}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
    }
})
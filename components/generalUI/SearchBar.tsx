import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { textStyles } from "./Text";
import { colors } from "../misc/Colors";
import Shadow from "../misc/Shadow";

interface SearchBarProps {
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
    onSearch?: (query: string) => void; // New prop for debounced search
}

export default function SearchBar(props: SearchBarProps) {
    const { placeholder, onSearch } = props;
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if(onSearch) {
                onSearch(searchQuery);
            }
        }, 500); // 500ms cooldown

        return () => clearTimeout(handler);
    }, [searchQuery, onSearch]);

    return(
        <View style={styles.container}>
            <Shadow shadowHeight={4} height={50} width={"88%"} borderRadius={50} />
            <View style={styles.innerContainer}>
                <TextInput 
                    style={[textStyles.text, textStyles.shadow, styles.input]}
                    placeholderTextColor={"white"}
                    placeholder={placeholder}
                    multiline={false}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} style={styles.iconContainer}>
                    <Image style={styles.icon} source={require("../../assets/icons/search.png")} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 50,
        alignItems: "center",
        marginBottom: 10,
    },

    innerContainer: {
        width: "88%",
        height: 50,
        justifyContent: "center",
    },

    input: {
        flex: 1,
        paddingHorizontal: 20,
        paddingRight: 50,
        backgroundColor: colors.purple.dark,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.border,
        color: "white",
    },

    iconContainer: {
        position: "absolute",
        right: 20,
        height: 25,
        width: 25,
    },

    icon: {
        position: "absolute",
        height: 25,
        width: 25,
    }
})
import { StyleProp, ViewStyle } from "react-native";
import BaseButton from "./BaseButton";
import { componentColors, colors } from "../misc/Colors";

interface ButtonProps {
    label?: string;
    onPress?: () => void;
    height?: number;
    width?: number;
    fontSize?: number;
    shadowHeight?: number;
    style?: StyleProp<ViewStyle>;
    borderRadius?: number;
    variant?: "play" | "toggle" | "submit" | "blue" | "pink"
}

const variants = {
    "play": {
        leftColor: componentColors.playButton.bgLeft,
        rightColor: componentColors.playButton.bgRight,
        highlightColor: componentColors.playButton.highlight,
        borderRadius: 22,
    },
    "toggle": {
        leftColor: componentColors.toggleButton.bgLeft,
        rightColor: componentColors.toggleButton.bgRight,
        highlightColor: componentColors.toggleButton.highlight,
        borderRadius: 22,
    },
    "submit": {
        leftColor: componentColors.submitButton.bgLeft,
        rightColor: componentColors.submitButton.bgRight,
        highlightColor: componentColors.submitButton.highlight,
        borderRadius: 10,
    },
    "blue": {
        leftColor: colors.blue.light,
        rightColor: colors.blue.medium,
        highlightColor: colors.blue.dark,
        borderRadius: 10,
    },
    "pink": {
        leftColor: colors.pink.light,
        rightColor: colors.pink.medium,
        highlightColor: colors.pink.dark,
        borderRadius: 10,
    }
}

export default function Button({ label, onPress, height, width, fontSize, shadowHeight, style, borderRadius, variant = "play" }: ButtonProps) {
    return (
        <BaseButton
            onPress={onPress}
            label={label}
            leftColor={variants[variant].leftColor}
            rightColor={variants[variant].rightColor}
            highlightColor={variants[variant].highlightColor}
            borderRadius={borderRadius ? borderRadius : variants[variant].borderRadius}
            heightPercentage={height}
            widthPercentage={width}
            fontSize={fontSize}
            shadowHeight={shadowHeight}
            style={style}
        />
    );
}
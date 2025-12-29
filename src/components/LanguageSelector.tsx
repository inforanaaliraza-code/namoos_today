/**
 * Language Selector Component
 * English-only language support
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from '../hooks/useColors';

interface LanguageSelectorProps {
    style?: any;
    showLabel?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style, showLabel = false }) => {
    const Colors = useColors();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
        },
        label: {
            fontSize: 14,
            color: Colors.foreground,
            fontWeight: '600',
            textAlign: 'left',
            marginLeft: 8,
        },
    });

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            activeOpacity={0.7}
            disabled
        >
            <Icon name="translate" size={20} color={Colors.primary} />
            {showLabel && (
                <Text style={styles.label}>
                    🇬🇧 English
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default LanguageSelector;

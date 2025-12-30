/**
 * Language Selector Component
 * Supports English (LTR) and Arabic (RTL) language switching
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from '../hooks/useColors';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
    style?: any;
    showLabel?: boolean;
}

interface LanguageOption {
    code: 'en' | 'ar';
    name: string;
    flag: string;
    nativeName: string;
}

const languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style, showLabel = false }) => {
    const Colors = useColors();
    const { language, isRTL, changeLanguage } = useLanguage();
    const [modalVisible, setModalVisible] = React.useState(false);

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    const styles = StyleSheet.create({
        container: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            padding: 8,
        },
        label: {
            fontSize: 14,
            color: Colors.foreground,
            fontWeight: '600',
            textAlign: isRTL ? 'right' : 'left',
            marginLeft: isRTL ? 0 : 8,
            marginRight: isRTL ? 8 : 0,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: Colors.background,
            borderRadius: 12,
            padding: 20,
            width: '80%',
            maxWidth: 400,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.foreground,
            marginBottom: 20,
            textAlign: isRTL ? 'right' : 'left',
        },
        languageItem: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: Colors.card,
        },
        languageItemActive: {
            backgroundColor: Colors.primary + '20',
            borderWidth: 2,
            borderColor: Colors.primary,
        },
        languageFlag: {
            fontSize: 24,
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
        },
        languageText: {
            fontSize: 16,
            color: Colors.foreground,
            fontWeight: '500',
            flex: 1,
        },
        checkIcon: {
            marginLeft: isRTL ? 0 : 8,
            marginRight: isRTL ? 8 : 0,
        },
    });

    const handleLanguageSelect = async (langCode: 'en' | 'ar') => {
        if (langCode !== language) {
            await changeLanguage(langCode);
        }
        setModalVisible(false);
    };

    const renderLanguageItem = ({ item }: { item: LanguageOption }) => {
        const isActive = item.code === language;
        return (
            <TouchableOpacity
                style={[styles.languageItem, isActive && styles.languageItemActive]}
                onPress={() => handleLanguageSelect(item.code)}
                activeOpacity={0.7}
            >
                <Text style={styles.languageFlag}>{item.flag}</Text>
                <Text style={styles.languageText}>{item.nativeName}</Text>
                {isActive && (
                    <Icon
                        name="check-circle"
                        size={24}
                        color={Colors.primary}
                        style={styles.checkIcon}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.container, style]}
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
            >
                <Icon name="translate" size={20} color={Colors.primary} />
                {showLabel && (
                    <Text style={styles.label}>
                        {currentLanguage.flag} {currentLanguage.nativeName}
                    </Text>
                )}
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={styles.modalTitle}>
                            {isRTL ? 'اختر اللغة' : 'Select Language'}
                        </Text>
                        <FlatList
                            data={languages}
                            renderItem={renderLanguageItem}
                            keyExtractor={(item) => item.code}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default LanguageSelector;

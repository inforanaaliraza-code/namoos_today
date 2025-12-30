/**
 * Notifications Settings Screen
 * Configure notification preferences
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FadeInView from '../../components/FadeInView';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRTLStyles } from '../../hooks/useRTLStyles';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    category: 'push' | 'email' | 'sms';
}

const NotificationsSettingsScreen: React.FC = () => {
    const Colors = useColors();
    const { getTextAlign, getFlexDirection, getRTLMargins } = useRTLStyles();


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
        content: {
            padding: 20,
        },
        section: {
            marginBottom: 32,
        },
        sectionHeader: {
            alignItems: 'center',
            marginBottom: 16,
            gap: 8,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: Colors.foreground,
        },
        settingRow: {
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: Colors.border,
        },
        settingInfo: {
            flex: 1,
        },
        settingTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.foreground,
            marginBottom: 4,
        },
        settingDescription: {
            fontSize: 12,
            color: Colors.mutedForeground,
        },
    });
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'push',
            title: 'Push Notifications',
            description: 'Receive notifications on your device',
            enabled: true,
            category: 'push',
        },
        {
            id: 'email',
            title: 'Email Notifications',
            description: 'Receive notifications via email',
            enabled: true,
            category: 'email',
        },
        {
            id: 'sms',
            title: 'SMS Notifications',
            description: 'Receive notifications via SMS',
            enabled: false,
            category: 'sms',
        },
        {
            id: 'chat',
            title: 'Chat Messages',
            description: 'Notifications for new chat messages',
            enabled: true,
            category: 'push',
        },
        {
            id: 'contracts',
            title: 'Contract Updates',
            description: 'Notifications when contracts are ready',
            enabled: true,
            category: 'push',
        },
        {
            id: 'credits',
            title: 'Credit Updates',
            description: 'Notifications about credit balance',
            enabled: true,
            category: 'push',
        },
    ]);

    const toggleSetting = (id: string) => {
        setSettings(
            settings.map((setting) =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
        // TODO: Backend doesn't have notification settings endpoint yet
        // When backend implements it, integrate API call here:
        // await notificationsAPI.updateSettings({ [id]: !settings.find(s => s.id === id)?.enabled });
    };

    const groupedSettings = {
        push: settings.filter((s) => s.category === 'push'),
        email: settings.filter((s) => s.category === 'email'),
        sms: settings.filter((s) => s.category === 'sms'),
    };

    const renderSetting = (setting: NotificationSetting) => (
        <View key={setting.id} style={[styles.settingRow, { flexDirection: getFlexDirection('row') }]}>
            <View style={[styles.settingInfo, getRTLMargins(0, 16)]}>
                <Text style={[styles.settingTitle, { textAlign: getTextAlign('left') }]}>{setting.title}</Text>
                <Text style={[styles.settingDescription, { textAlign: getTextAlign('left') }]}>{setting.description}</Text>
            </View>
            <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: Colors.muted, true: Colors.primary }}
                thumbColor="#fff"
            />
        </View>
    );

    return (
        <FadeInView>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Push Notifications */}
                <View style={styles.section}>
                    <View style={[styles.sectionHeader, { flexDirection: getFlexDirection('row') }]}>
                        <Icon name="bell" size={24} color={Colors.primary} />
                        <Text style={[styles.sectionTitle, { textAlign: getTextAlign('left') }]}>Push Notifications</Text>
                    </View>
                    {groupedSettings.push.map(renderSetting)}
                </View>

                {/* Email Notifications */}
                <View style={styles.section}>
                    <View style={[styles.sectionHeader, { flexDirection: getFlexDirection('row') }]}>
                        <Icon name="email" size={24} color={Colors.primary} />
                        <Text style={[styles.sectionTitle, { textAlign: getTextAlign('left') }]}>Email Notifications</Text>
                    </View>
                    {groupedSettings.email.map(renderSetting)}
                </View>

                {/* SMS Notifications */}
                <View style={styles.section}>
                    <View style={[styles.sectionHeader, { flexDirection: getFlexDirection('row') }]}>
                        <Icon name="message-text" size={24} color={Colors.primary} />
                        <Text style={[styles.sectionTitle, { textAlign: getTextAlign('left') }]}>SMS Notifications</Text>
                    </View>
                    {groupedSettings.sms.map(renderSetting)}
                </View>
            </ScrollView>
        </FadeInView>
    );
};

export default NotificationsSettingsScreen;


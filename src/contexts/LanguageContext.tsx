/**
 * Language Context - Instant language switching with RTL support
 * Supports English (LTR) and Arabic (RTL)
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { I18nManager, Platform } from 'react-native';
import RNRestart from 'react-native-restart';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateProfile } from '../store/slices/authSlice';

const LANGUAGE_KEY = '@namos_language';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    isRTL: boolean;
    changeLanguage: (lang: Language) => Promise<void>;
    t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to set RTL direction
const setRTL = async (isRTL: boolean, shouldRestart: boolean = false): Promise<void> => {
    if (Platform.OS === 'web') {
        // For web, update the HTML document direction
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', isRTL ? 'ar' : 'en');
        }
    } else {
        // For mobile, use I18nManager
        const needsChange = I18nManager.isRTL !== isRTL;
        
        if (needsChange) {
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(isRTL);
            
            // On Android and iOS, we need to restart the app for RTL to take effect
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                // Only restart if explicitly requested (during language change)
                if (shouldRestart) {
                    // Use setTimeout to ensure state is saved before restart
                    setTimeout(() => {
                        if (Platform.OS === 'android') {
                            RNRestart.restart();
                        } else if (Platform.OS === 'ios') {
                            RNRestart.restart();
                        }
                    }, 100);
                }
            }
        }
    }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [isRTL, setIsRTL] = useState(false);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    // Load saved language on mount
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
                const lang = (savedLanguage === 'ar' || savedLanguage === 'en') 
                    ? savedLanguage as Language 
                    : 'en';
                
                const shouldBeRTL = lang === 'ar';
                // Don't restart on initial load - just set the RTL state
                await setRTL(shouldBeRTL, false);
                
                setLanguage(lang);
                setIsRTL(shouldBeRTL);
                i18n.changeLanguage(lang);
            } catch (error) {
                console.warn('Failed to load language:', error);
                // Default to English
                await setRTL(false, false);
                setLanguage('en');
                setIsRTL(false);
                i18n.changeLanguage('en');
            }
        };
        loadLanguage();
    }, []);

    // Sync with user profile language when user logs in
    useEffect(() => {
        if (user?.language && (user.language === 'en' || user.language === 'ar')) {
            const userLang = user.language as Language;
            if (userLang !== language) {
                changeLanguage(userLang).catch(() => {});
            }
        }
    }, [user?.language]);

    // Core function - instant language switch with RTL handling
    const changeLanguage = useCallback(async (lang: Language) => {
        try {
            // 1. Determine RTL based on language
            const shouldBeRTL = lang === 'ar';
            // Check if RTL actually needs to change by comparing with I18nManager state
            const currentRTL = Platform.OS === 'web' 
                ? (typeof document !== 'undefined' && document.documentElement.getAttribute('dir') === 'rtl')
                : I18nManager.isRTL;
            const needsRTLChange = currentRTL !== shouldBeRTL;

            // 2. Update i18n immediately
            await i18n.changeLanguage(lang);

            // 3. Update state immediately for instant UI update (on web this works immediately)
            setLanguage(lang);
            setIsRTL(shouldBeRTL);

            // 4. Save to storage
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);

            // 5. Sync to backend silently (only if logged in)
            if (user?.id) {
                dispatch(updateProfile({ language: lang })).catch(() => {});
            }

            // 6. Set RTL direction and restart if needed (only on mobile platforms)
            // For web, this will update the HTML dir attribute immediately
            if (Platform.OS !== 'web' && needsRTLChange) {
                // Restart app on mobile to apply RTL changes
                // The restart will happen after state is saved
                await setRTL(shouldBeRTL, true);
            } else {
                // For web or if RTL doesn't need to change, just set it
                await setRTL(shouldBeRTL, false);
            }
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }, [user?.id, dispatch]);

    // Translation function
    const t = useCallback((key: string, options?: any): string => {
        return i18n.t(key, options) as string;
    }, [language]);

    const value = React.useMemo(() => ({
        language,
        isRTL,
        changeLanguage,
        t,
    }), [language, isRTL, changeLanguage, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

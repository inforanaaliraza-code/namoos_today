/**
 * Language Context - Instant language switching
 * No loading, no delays - immediate UI update
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateProfile } from '../store/slices/authSlice';

const LANGUAGE_KEY = '@namos_language';

interface LanguageContextType {
    language: 'en';
    changeLanguage: () => void;
    t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language] = useState<'en'>('en');
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    // Ensure language is always English
    useEffect(() => {
        if (i18n.language !== 'en') {
            i18n.changeLanguage('en');
        }
        AsyncStorage.setItem(LANGUAGE_KEY, 'en').catch(() => { });
    }, []);

    // Sync with user profile language when user logs in (only accept English)
    useEffect(() => {
        if (user?.language && user.language !== 'en') {
            // Force English if user has non-English language
            dispatch(updateProfile({ language: 'en' })).catch(() => { });
        }
    }, [user?.language, dispatch]);

    // Core function - instant language switch (always English)
    const applyLanguage = useCallback(() => {
        // 1. Update i18n immediately
        i18n.changeLanguage('en');

        // 2. Save to storage (background, non-blocking)
        AsyncStorage.setItem(LANGUAGE_KEY, 'en').catch(() => { });
    }, []);

    // Public changeLanguage function (no-op since we only support English)
    const changeLanguage = useCallback(() => {
        // Apply immediately
        applyLanguage();

        // Sync to backend silently (only if logged in)
        if (user?.id) {
            dispatch(updateProfile({ language: 'en' })).catch(() => { });
        }
    }, [applyLanguage, user?.id, dispatch]);

    // Translation function
    const t = useCallback((key: string, options?: any): string => {
        return i18n.t(key, options) as string;
    }, [language]);

    const value = React.useMemo(() => ({
        language,
        changeLanguage,
        t,
    }), [language, changeLanguage, t]);

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

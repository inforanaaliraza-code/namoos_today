/**
 * RTL utility functions
 * Helper functions for handling RTL/LTR layouts
 */

import { I18nManager, Platform } from 'react-native';

/**
 * Check if the current layout direction is RTL
 */
export const isRTL = (): boolean => {
    if (Platform.OS === 'web') {
        if (typeof document !== 'undefined') {
            return document.documentElement.getAttribute('dir') === 'rtl';
        }
        return false;
    }
    return I18nManager.isRTL;
};

/**
 * Get flex direction based on RTL
 * @param baseDirection - Base direction ('row' or 'row-reverse')
 * @returns Appropriate flex direction for current layout
 */
export const getFlexDirection = (baseDirection: 'row' | 'row-reverse' = 'row'): 'row' | 'row-reverse' => {
    if (isRTL()) {
        return baseDirection === 'row' ? 'row-reverse' : 'row';
    }
    return baseDirection;
};

/**
 * Get text align based on RTL
 * @param baseAlign - Base alignment ('left' or 'right')
 * @returns Appropriate text alignment for current layout
 */
export const getTextAlign = (baseAlign: 'left' | 'right' | 'center' = 'left'): 'left' | 'right' | 'center' => {
    if (baseAlign === 'center') return 'center';
    if (isRTL()) {
        return baseAlign === 'left' ? 'right' : 'left';
    }
    return baseAlign;
};

/**
 * Get margin/padding based on RTL
 * @param left - Left value
 * @param right - Right value
 * @returns Object with marginLeft/marginRight or paddingLeft/paddingRight flipped if RTL
 */
export const getRTLMargins = (left: number, right: number) => {
    if (isRTL()) {
        return { marginLeft: right, marginRight: left };
    }
    return { marginLeft: left, marginRight: right };
};

export const getRTLPaddings = (left: number, right: number) => {
    if (isRTL()) {
        return { paddingLeft: right, paddingRight: left };
    }
    return { paddingLeft: left, paddingRight: right };
};


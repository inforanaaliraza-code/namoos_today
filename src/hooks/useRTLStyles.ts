/**
 * RTL-aware styling hook
 * Provides helper functions for creating RTL/LTR aware styles
 */

import { useLanguage } from '../contexts/LanguageContext';

/**
 * Hook that provides RTL-aware style utilities
 */
export const useRTLStyles = () => {
    const { isRTL } = useLanguage();

    /**
     * Get flex direction based on RTL
     * @param baseDirection - Base direction ('row' or 'row-reverse')
     * @returns Appropriate flex direction for current layout
     */
    const getFlexDirection = (baseDirection: 'row' | 'row-reverse' = 'row'): 'row' | 'row-reverse' => {
        if (isRTL) {
            return baseDirection === 'row' ? 'row-reverse' : 'row';
        }
        return baseDirection;
    };

    /**
     * Get text align based on RTL
     * @param baseAlign - Base alignment ('left' or 'right')
     * @returns Appropriate text alignment for current layout
     */
    const getTextAlign = (baseAlign: 'left' | 'right' | 'center' = 'left'): 'left' | 'right' | 'center' => {
        if (baseAlign === 'center') return 'center';
        if (isRTL) {
            return baseAlign === 'left' ? 'right' : 'left';
        }
        return baseAlign;
    };

    /**
     * Get margin values based on RTL
     * @param left - Left margin value
     * @param right - Right margin value
     * @returns Object with marginLeft/marginRight flipped if RTL
     */
    const getRTLMargins = (left: number, right: number) => {
        if (isRTL) {
            return { marginLeft: right, marginRight: left };
        }
        return { marginLeft: left, marginRight: right };
    };

    /**
     * Get padding values based on RTL
     * @param left - Left padding value
     * @param right - Right padding value
     * @returns Object with paddingLeft/paddingRight flipped if RTL
     */
    const getRTLPaddings = (left: number, right: number) => {
        if (isRTL) {
            return { paddingLeft: right, paddingRight: left };
        }
        return { paddingLeft: left, paddingRight: right };
    };

    /**
     * Get position values based on RTL (for absolute/fixed positioning)
     * @param left - Left position value
     * @param right - Right position value
     * @returns Object with left/right flipped if RTL
     */
    const getRTLPosition = (left: number | undefined, right: number | undefined) => {
        if (isRTL) {
            return { left: right, right: left };
        }
        return { left, right };
    };

    /**
     * Get writing direction (for text)
     * @returns 'rtl' or 'ltr'
     */
    const getWritingDirection = (): 'rtl' | 'ltr' => {
        return isRTL ? 'rtl' : 'ltr';
    };

    /**
     * Get layout direction (for View containers)
     * Note: In React Native, direction is handled automatically by I18nManager
     * This is mainly for web compatibility
     * @returns 'rtl' or 'ltr' or undefined (for native)
     */
    const getLayoutDirection = () => {
        // On native, direction is handled by I18nManager automatically
        // Only return explicit direction for web
        if (typeof document !== 'undefined') {
            return isRTL ? 'rtl' : 'ltr';
        }
        return undefined;
    };

    return {
        isRTL,
        getFlexDirection,
        getTextAlign,
        getRTLMargins,
        getRTLPaddings,
        getRTLPosition,
        getWritingDirection,
        getLayoutDirection,
    };
};


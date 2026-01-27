import SettingStorage from "@/core/SettingStorage";

const currentMonth = new Date().getMonth();
const SETTING_KEY_XMAS_OVERRIDE = "xmasOverride";

/**
 * Get the current Christmas state, checking for user override first
 */
export const getIsXmas = (): boolean => {
    const override = SettingStorage.getIntOrDefault(SETTING_KEY_XMAS_OVERRIDE, null);
    if (override !== null) {
        return override === 1;
    }
    return currentMonth === 11 || currentMonth === 0;
};

/**
 * Set the Christmas override (null = auto, 0 = disabled, 1 = enabled)
 */
export const setXmasOverride = (enabled: boolean | null): void => {
    if (enabled === null) {
        SettingStorage.remove(SETTING_KEY_XMAS_OVERRIDE);
    } else {
        SettingStorage.set(SETTING_KEY_XMAS_OVERRIDE, enabled ? 1 : 0);
    }
};

// For backward compatibility, export as a getter function result
export const IS_XMAS = getIsXmas();
export const IS_JANUARY = currentMonth === 0;

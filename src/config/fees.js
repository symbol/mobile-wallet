export interface FeesConfig {
    free: number;
    slow: number;
    normal: number;
    fast: number;
}

export const defaultFeesConfig: FeesConfig = {
    free: 0,
    slow: 1,
    normal: 1.2,
    fast: 2,
};

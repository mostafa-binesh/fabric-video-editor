// auth.ts

const refreshTokenSaveName = 'refreshToken';
const accessTokenSaveName = 'accessToken';

export const setRefreshToken = (refreshToken: string): void => {
    localStorage.setItem(refreshTokenSaveName, refreshToken);
};

export const setAccessToken = (accessToken: string): void => {
    localStorage.setItem(accessTokenSaveName, accessToken);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(refreshTokenSaveName);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(accessTokenSaveName);
};

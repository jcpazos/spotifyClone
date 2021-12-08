import { atom } from "recoil";

export const playlistState = atom({
    key:"playlistState",
    default: null,
});

export const playlistTitleAscState = atom({
    key:"playlistTitleAscState",
    default: null,
});

export const playlistAlbumAscState = atom({
    key:"playlistAlbumAscState",
    default: null,
});

export const playlistDateAscState = atom({
    key:"playlistDateAscState",
    default: null,
});

export const playlistDurationAscState = atom({
    key:"playlistDurationAscState",
    default: null,
});

export const playlistTitleDescState = atom({
    key:"playlistTitleDescState",
    default: null,
});

export const playlistAlbumDescState = atom({
    key:"playlistAlbumDescState",
    default: null,
});

export const playlistDateDescState = atom({
    key:"playlistDateDescState",
    default: null,
});

export const playlistDurationDescState = atom({
    key:"playlistDurationDescState",
    default: null,
});

export const playlistIdState = atom({
    key: "playlistIdState",
    default: '1mjvPnVRJ20v9b57D2cUaS'
});
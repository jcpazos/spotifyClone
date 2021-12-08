import { ClockIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    console.log("playlist at songs", playlist);

    const sortByTitle = () => {
        const sorted = [...playlist?.tracks.items].sort((a, b) => { return a.track.name.localeCompare(b.track.name)});
        let newPlaylist = {images: playlist?.images, tracks: {items: sorted}, name: playlist?.name};
        setPlaylist(newPlaylist);
    };

    const sortByAlbum = () => {
        const sorted = [...playlist?.tracks.items].sort((a, b) => { return a.track.album.name.localeCompare(b.track.album.name)});
        let newPlaylist = {images: playlist?.images, tracks: {items: sorted}, name: playlist?.name};
        setPlaylist(newPlaylist);
    };

    const sortByDuration = () => {
        const sorted = [...playlist?.tracks.items].sort((a, b) => { return a.track.duration_ms - b.track.duration_ms});
        let newPlaylist = {images: playlist?.images, tracks: {items: sorted}, name: playlist?.name};
        setPlaylist(newPlaylist);
    };

    return (
    <div>
        <div className="px-8 flex flex-col sticky top-20 bg-gradient-to-b to-black from-gray-800">
                        <div className="grid grid-cols-2 text-gray-500 py-4 px-5
                            ">
                            <div className="flex items-center space-x-4">
                                <p className="cursor-default">#</p>
                                <p className="cursor-default hover:text-white" onClick={sortByTitle}>TITLE</p>
                            </div>
                            <div className="flex items-center justify-between ml-auto md:ml-0">
                                <p className="cursor-default hidden md:inline w-40 hover:text-white" onClick={sortByAlbum}>ALBUM</p>
                                <ClockIcon className="cursor-default h-5 w-5 hover:text-white" onClick={sortByDuration}></ClockIcon>
                            </div>
                        </div>
                        <hr className="opacity-20"></hr>
                    </div>
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
            {playlist?.tracks.items.map((track, i) => (
                <Song key = {track.track.id?track.track.id:track.track.uri} track={track} order={i}/>
            ))}
        </div>;
    </div>)
}

export default Songs;

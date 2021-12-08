import { ClockIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistAlbumAscState, playlistAlbumDescState, playlistDateAscState, playlistDateDescState, playlistDurationAscState, playlistDurationDescState, playlistState, playlistTitleAscState, playlistTitleDescState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    console.log("playlist at songs", playlist);
    const [titleSortType, titleSetSortType] = useState("asc");
    const [albumSortType, albumSetSortType] = useState("asc");
    const [durationSortType, durationSetSortType] = useState("asc");
    const [dateSortType, dateSetSortType] = useState("asc");
    const titleAscPlaylist = useRecoilValue(playlistTitleAscState);
    const albumAscPlaylist = useRecoilValue(playlistAlbumAscState);
    const dateAscPlaylist = useRecoilValue(playlistDateAscState);
    const durationAscPlaylist = useRecoilValue(playlistDurationAscState);
    const titleDescPlaylist = useRecoilValue(playlistTitleDescState);
    const albumDescPlaylist = useRecoilValue(playlistAlbumDescState);
    const dateDescPlaylist = useRecoilValue(playlistDateDescState);
    const durationDescPlaylist = useRecoilValue(playlistDurationDescState);

    const sortByTitle = () => {
        /*const items = [...playlist?.tracks.items];
        const sorted = _.orderBy(items, 'track.name', titleSortType);*/
        const sorted = titleSortType === "asc" ? titleAscPlaylist : titleDescPlaylist;
        titleSetSortType(titleSortType === "asc" ? "desc" : "asc");
        albumSetSortType("asc");
        durationSetSortType("asc");
        dateSetSortType("asc");
        setPlaylist(sorted);
    };

    const sortByAlbum = () => {
        /*const items = [...playlist?.tracks.items];
        const sorted = _.orderBy(items, 'track.album.name', albumSortType);*/
        const sorted = albumSortType === "asc" ? albumAscPlaylist : albumDescPlaylist;
        albumSetSortType(albumSortType === "asc" ? "desc" : "asc");
        titleSetSortType("asc");
        durationSetSortType("asc");
        dateSetSortType("asc");
        setPlaylist(sorted);
    };

    const sortByDate = () => {
        /*const items = [...playlist?.tracks.items];
        const sorted = _.orderBy(items, 'added_at', dateSortType);*/
        const sorted = dateSortType === "asc" ? dateAscPlaylist : dateDescPlaylist;
        dateSetSortType(dateSortType === "asc" ? "desc" : "asc");
        titleSetSortType("asc");
        durationSetSortType("asc");
        albumSetSortType("asc");
        setPlaylist(sorted);
    };

    const sortByDuration = () => {
        /*const items = [...playlist?.tracks.items];
        const sorted = _.orderBy(items, 'track.duration_ms', durationSortType);*/
        const sorted = durationSortType === "asc" ? durationAscPlaylist : durationDescPlaylist;
        durationSetSortType(durationSortType === "asc" ? "desc" : "asc");
        albumSetSortType("asc");
        titleSetSortType("asc");
        dateSetSortType("asc");
        setPlaylist(sorted);
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
                                <p className="cursor-default hidden md:inline hover:text-white w-36 pr-2 pl-1" onClick={sortByDate}>DATE ADDED</p>
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

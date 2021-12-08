import { ChevronDownIcon, ClockIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {shuffle} from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistAlbumAscState, playlistAlbumDescState, playlistDateAscState, playlistDateDescState, playlistDurationAscState, playlistDurationDescState, playlistIdState, playlistState, playlistTitleAscState, playlistTitleDescState} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
];

function Center() {
    const {data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const [titleAscPlaylist, setTitleAscPlaylist] = useRecoilState(playlistTitleAscState);
    const [albumAscPlaylist, setAlbumAscPlaylist] = useRecoilState(playlistAlbumAscState);
    const [dateAscPlaylist, setDateAscPlaylist] = useRecoilState(playlistDateAscState);
    const [durationAscPlaylist, setDurationAscPlaylist] = useRecoilState(playlistDurationAscState);
    const [titleDescPlaylist, setTitleDescPlaylist] = useRecoilState(playlistTitleDescState);
    const [albumDescPlaylist, setAlbumDescPlaylist] = useRecoilState(playlistAlbumDescState);
    const [dateDescPlaylist, setDateDescPlaylist] = useRecoilState(playlistDateDescState);
    const [durationDescPlaylist, setDurationDescPlaylist] = useRecoilState(playlistDurationDescState);

    const loopPlaylists = (spotifyApi, playlistId, page, returnData) => 
        spotifyApi.getPlaylistTracks(playlistId, {
            offset: page * 100,
            limit: 100
        }).then(data => {
            if (data?.body?.next) {
                returnData?.tracks?.items = returnData?.tracks?.items.concat(data?.body?.items);
                return loopPlaylists(spotifyApi, playlistId, page + 1, returnData);
            } else {
                returnData?.tracks?.items = returnData?.tracks?.items.concat(data?.body?.items);
                return returnData;
            }
        });

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {

        const getPlaylists = (spotifyApi, playlistId) => {

            let returnData;
            let albumPlaylist;
            let titlePlaylist;
            let datePlaylist;
            let durationPlaylist;

            spotifyApi.getPlaylist(playlistId).then((data) => {
                returnData = data?.body;
                let page = 1;
                if (data?.body?.tracks?.next) {
                    loopPlaylists(spotifyApi, playlistId, page, returnData).then((returnData) => {
                        let playlist = returnData;
                        let items;
                        let sorted;

                        //sort ascending
                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'track.name', 'asc');
                        setTitleAscPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'track.album.name','asc')
                        setAlbumAscPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'added_at', 'asc');
                        setDateAscPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'track.duration_ms', 'asc');
                        setDurationAscPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        //sort descending
                        sorted = _.orderBy(items, 'track.name', 'desc');
                        setTitleDescPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'track.album.name', 'desc')
                        setAlbumDescPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'added_at', 'desc');
                        setDateDescPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});

                        items = [...playlist?.tracks.items];
                        sorted = _.orderBy(items, 'track.duration_ms', 'desc');
                        setDurationDescPlaylist({images: playlist?.images, tracks: {items: sorted}, name: playlist?.name});
                        

                        setPlaylist(returnData);   
                    });
                } else {
                    setPlaylist(returnData);  
                      
                    
                }
            }).catch((error) => {console.log("Something went wrong!", error);});
        };

        getPlaylists(spotifyApi, playlistId);
    }, [spotifyApi, playlistId])

    console.log(playlist);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 
                opacity-90 hover:opacity-80 cursor-pointer rounded-full
                p-1 pr-2 text-white" onClick={signOut}>
                    <img 
                        className="rounded-full w-10 h-10" 
                        src={session?.user.image}
                        alt="" 
                    />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color}
            h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images[0]?.url} alt="" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>


            <Songs />

        </div>
    );
}

export default Center

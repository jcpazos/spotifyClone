import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    RssIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
    const spotifyApi = useSpotify();
    const {data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists({limit: 50}).then((data) => {
                setPlaylists(data.body.items);
            }).catch((error) => {console.log(error);});
        }
    }, [session, spotifyApi]);

    console.log("you have selected >>> ", playlistId);
    //console.log("playlists", playlists);

    useEffect(() => {
        var resize = document.getElementById("sidebar-resize");
        var left = document.getElementById("sidebar-left");
        var container = document.getElementById("sidebar-container");
        var moveX =
        left.getBoundingClientRect().width +
        resize.getBoundingClientRect().width / 2;

        var drag = false;
        resize.addEventListener("mousedown", function (e) {
        drag = true;
        moveX = e.x;
        });

        container.addEventListener("mousemove", function (e) {
        moveX = e.x;
        if (drag && moveX > 50)
            left.style.width =
                moveX - resize.getBoundingClientRect().width / 2 + "px";
        });

        container.addEventListener("mouseup", function (e) {
        drag = false;
        });
    }, []);

    return (
        <div id="sidebar-container" className="text-gray-500 pl-5 pt-5 text-xs lg:text-sm  border-r border-gray-900
        overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex
        pb-36">
            <div id="sidebar-left" className="space-y-4  flex-shrink">
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5"/>
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white"> 
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white"> 
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"></hr>

                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 text-blue-500 hover:text-white"> 
                    <HeartIcon className="h-5 w-5"/>
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 text-green-500 hover:text-white"> 
                    <RssIcon className="h-5 w-5"/>
                    <p>Your episodes</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"></hr>

                {/* Playlists... */}
                {playlists.map((playlist) => (
                    <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">
                        {playlist.name}
                    </p>
                ))}

                
            </div>
            <div 
                className="bg-gray-500 flex-shrink-0 pt-0 overflow-y-scroll scrollbar-hide h-screen w-1 opacity-0 hover:opacity-100" 
                style={{cursor:'col-resize'}}
                id="sidebar-resize"
            >
            </div>
        </div>
    );
}



export default Sidebar

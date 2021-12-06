import { 
    HeartIcon, 
    VolumeUpIcon as VolumeDownIcon 
} from '@heroicons/react/outline';
import {
    RewindIcon, 
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    ReplyIcon,
    VolumeUpIcon,
    PlayIcon 
} from '@heroicons/react/solid';
import { data } from 'autoprefixer';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

function Player() {
    const spotifyApi = useSpotify();
    const { data: session , status} = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((response) => {
                console.log("Now playing: ", response.body?.item);
                setCurrentIdTrack(response.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((response) => {
                    setIsPlaying(response.body?.is_playing);
                });
            });
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((response) => {
            if (response.body?.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play().catch((err) => {});
                setIsPlaying(true);
            }
        });
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken && !currentTrackId) {
            // fetch the song info
            fetchCurrentSong();
            setVolume(50);

        }
    }, [currentTrackId, spotifyApi, session]);

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            // fetch the song info
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((error) => {});
        }, 500), []
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white
        grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img 
                    className="hidden md:inline h-10 w-10" 
                    src={songInfo?.album.images?.[0]?.url} 
                    alt="">
                </img>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon 
                    //onClick={() => spotifyApi.skipToNext()}
                    className="button" 
                />

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
                ): (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
                
                )}

                <FastForwardIcon 
                    //onClick={() => spotifyApi.skipToNext()}
                    className="button" 
                />
                
                <ReplyIcon className="button" />
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon 
                    onClick={() => volume > 0 && setVolume(volume-10)} 
                    className="button"     
                />
                <input 
                    onChange={e => setVolume(Number(e.target.value))} 
                    className="w-14 md:w-28" 
                    type="range" 
                    value={volume} 
                    min={0} 
                    max={100}
                />
                <VolumeUpIcon 
                    onClick={() => volume < 100 && setVolume(volume+10)} 
                    className="button" 
                />
            </div>
        </div>
    );
}

export default Player;

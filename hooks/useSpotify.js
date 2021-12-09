import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import spotifyApi from '../lib/spotify';


function useSpotify() {
    const {data: session, status} = useSession();
    
    useEffect(() => {
        console.log("at spotify");
        if (session) {
            console.log("at spotify and seesion is", session);
            //If refresh access token attempt fails, direct user to login...
            if (session.error === 'RefreshAccessTokenError') {
                console.log("at spotify and session error", session.error);
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);

        }
    }, [session]);

    return spotifyApi;
}

export default useSpotify

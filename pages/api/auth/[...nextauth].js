import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);
        
        const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
        console.log("REFRESH TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        };

    } catch (error) {
        console.error(error);

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,

    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },
  session: {
      jwt: true,
  },
  pages: {
      signIn: '/login',
  },

  callbacks: {
    async jwt({token, account, user}) {
        console.log('callback', token, account, user);
        // Do something with the token
        if (account && user) {
            console.log('account and user exist');
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providedAccountId,
                accessTokenExpires: account.expires_at *1000,
            };
        }
    
        // Return previous token if the access token has not expired yet
        if (Date.now() < token.accessTokenExpires) {
            console.log('token hasnt expired yet');
            return token;
        }

        //Access token has expired, try to update it
        console.log('refreshing access token');

        return refreshAccessToken(token);
    },

    async session({session, token}) {
        console.log('session', session, token);
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.usename = token.username;

        return session;
     },
  }
});
import { getToken } from "next-auth/jwt";
import { NextResponse} from "next/server";

export async function middleware(req) {
    const token = await getToken({ 
        req, 
        secret: process.env.JWT_SECRET,
        secureCookie:
        process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL_URL
    });

    const {pathname } = req.nextUrl;
    // Allow the requests if the following is true...
    // the token exists

    if (pathname.includes("/api/auth/") || token) {
        return NextResponse.next();
    }

    //redirect them to login if they dont have a taken AND are requesting
    // a protected route
    if (!token && pathname !== "/login") {
        return NextResponse.redirect("/login");
    }


}
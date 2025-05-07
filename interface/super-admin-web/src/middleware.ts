import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getFirebaseAuth } from 'next-firebase-auth-edge';
import { firebaseConfig } from './firebase/config'; // Adjust path as necessary

const PUBLIC_PATHS = ['/login']; // Paths accessible without authentication

const authConfig = {
  apiKey: firebaseConfig.apiKey!,
  cookieName: 'AuthToken',
  cookieSignatureKeys: [process.env.COOKIE_SIGNATURE_KEY_1!, process.env.COOKIE_SIGNATURE_KEY_2!], // Use environment variables
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'lax' as const,
    maxAge: 12 * 60 * 60 * 24 * 1000, // 12 days
  },
  serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined, // Use environment variable for service account
};

// Get the auth object containing the 'auth' function
const firebaseAuth = getFirebaseAuth(authConfig);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- START TEMPORARY BYPASS ---
  // Skip authentication check to allow direct access to dashboard pages
  // console.warn("Authentication checks are currently bypassed in middleware for development.");
  return NextResponse.next(); // Explicitly bypass all auth checks for now
  // --- END TEMPORARY BYPASS ---


  // NOTE: The following authentication logic is temporarily bypassed above.
  // Restore this block to enable authentication checks.

  /*
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Ensure the auth function exists before calling it
  if (typeof firebaseAuth !== 'function') {
    console.error("Firebase Auth Edge middleware function is not available. Check configuration.");
    // Redirect to login if trying to access a protected path without a valid auth function
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public paths even if auth check fails, but log the issue
    return NextResponse.next();
  }


  // Attempt to get the authenticated user using the auth function from the returned object
  let user = null;
  try {
     // Correctly call the destructured auth function
     user = await firebaseAuth(request, { checkRevoked: true }); // Check if token is revoked
  } catch (error) {
      console.error("Error during Firebase Auth Edge check:", error);
      // If auth check fails for a protected path, redirect to login
       if (!isPublicPath) {
            return NextResponse.redirect(new URL('/login', request.url));
       }
       // Allow access to public paths even if auth check throws an error
       return NextResponse.next();
  }


  // Redirect authenticated users trying to access public paths (like login) to dashboard
  if (user && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users trying to access protected paths to login
  if (!user && !isPublicPath && pathname !== '/') { // Allow access to root temporarily for redirection logic
     // Only redirect if not already on the login page or root
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
  */
}

// Define the paths that the middleware should apply to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - _auth (Firebase auth helper files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|_auth).*)',
  ],
};



# Google OAuth Setup for Starspace

To complete the Google OAuth setup for web, you need to configure the authorized redirect URIs in the Google Cloud Console.

## Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Navigate to **APIs & Services** → **Credentials**

3. Find your OAuth 2.0 Client ID (the one with ID: `774933895581-5q5qsop0jh9v19nooti0uun89skk07ru.apps.googleusercontent.com`)

4. Click on it to edit

5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8081`
   - `http://localhost:19006` (if using Expo web on different port)

6. Under **Authorized redirect URIs**, add:
   - `http://localhost:8081`
   - `http://localhost:8081/redirect`
   - `com.starspace.app://redirect` (for native apps)

7. Save the changes

## Testing:

1. Make sure the backend is running:
   ```bash
   cd /Users/ryarasi/dws/repos/dws.ryarasi.starspace.starspace-api
   docker compose up
   ```

2. Make sure the frontend is running:
   ```bash
   cd /Users/ryarasi/dws/repos/dws.ryarasi.starspace.starspace-ui
   npm start
   ```

3. Open http://localhost:8081 in your browser

4. Click "Continue with Google" - it should now redirect to Google's OAuth page

## Notes:

- The OAuth flow uses `expo-auth-session` for web platform
- Native platforms continue to use `@react-native-google-signin/google-signin`
- The backend accepts the access token and creates a JWT for our app
# Firebase Setup and Configuration Guide

This guide will help you configure Firebase properly to resolve the upload recipe issues.

## 1. Deploy Firebase Security Rules

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase in your project (if not already done)
```bash
firebase init
```
- Select "Firestore" and "Storage" when prompted
- Choose your existing project (aibridge-73844)
- Use the existing firestore.rules and storage.rules files

### Step 4: Deploy the rules
First, make sure you're in the correct Firebase project:
```bash
firebase use --add
```
Select your project (aibridge-73844) if prompted.

Then deploy the rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

Or deploy both at once:
```bash
firebase deploy --only firestore:rules,storage
```

## 2. Firebase Console Configuration

### Storage CORS Configuration
The CORS errors you're seeing can be resolved by configuring CORS for your Firebase Storage bucket:

1. Install Google Cloud SDK
2. Run the following command to set up CORS:

```bash
# Create a cors.json file first
cat > cors.json << EOF
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "https://nonamehackathon.vercel.app"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
EOF

# Apply CORS configuration
gsutil cors set cors.json gs://aibridge-73844.appspot.com
```

## 3. Firestore Security Rules Summary

The `firestore.rules` file allows:
- Users to read/write their own profile data
- Anyone to read recipes, authenticated users to write recipes
- Users to read/write their own cart and order data

## 4. Storage Security Rules Summary

The `storage.rules` file allows:
- Authenticated users to upload images to their own folders
- Anyone to read recipe and profile images (for public display)
- Structured paths: `/recipeImages/{userId}/{filename}` and `/profileImages/{userId}/{filename}`

## 5. Environment Variables

The `.env.local` file has been created with your Firebase configuration. Make sure to:

1. Keep this file secure and don't commit it to public repositories
2. For production deployment, set these as environment variables in your hosting platform

## 6. Common Issues and Solutions

### CORS Errors
- Make sure the CORS configuration includes your domain
- Firebase Storage sometimes takes time to apply CORS changes

### Permission Denied Errors
- Ensure users are properly authenticated before trying to upload
- Check that the storage rules allow the specific path being used

### API Key Issues
- The API keys in environment variables are for client-side use and are safe to be public
- Security is enforced through Firebase Security Rules, not API key secrecy

## 7. Testing the Setup

After completing the above steps:

1. Restart your development server
2. Sign in to your application
3. Try uploading a recipe
4. Check the browser console for any remaining errors

## 8. Monitoring

Use the Firebase Console to monitor:
- Authentication users
- Firestore document creation
- Storage file uploads
- Any security rule violations

## Troubleshooting Commands

```bash
# Check Firebase project status
firebase projects:list

# Test security rules
firebase emulators:start --only firestore,storage

# View logs
firebase functions:log
```

## Next Steps

1. Deploy the security rules using the commands above
2. Configure CORS if you continue to see CORS errors
3. Test the upload functionality
4. Monitor the Firebase Console for any issues

If you continue to experience issues, check the browser's Network tab and Firebase Console for more detailed error messages.

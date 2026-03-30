# Cloudinary Image Upload Migration

## Setup Instructions

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com and sign up for a free account
2. Keep your **Cloud Name**, **API Key**, and **API Secret** handy

### Step 2: Update Backend Environment Variables
Add these to your `.env` file in the Backend directory:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Install Dependencies (Already Done ✓)
```bash
npm install cloudinary multer-storage-cloudinary
```

### Step 4: Backend Changes (Already Done ✓)
- Updated `/api/blogs/upload-image` endpoint to use Cloudinary
- Images now return full HTTPS URLs instead of local paths
- No changes needed to the frontend Editor.jsx - it works with Cloudinary URLs

## What Changed

### Before (Local Storage)
```
Request: POST /api/blogs/upload-image
Response: { url: "http://localhost:8000/uploads/1234-image.jpg" }
Problem: Images deleted when you redeploy, no CDN, only works locally
```

### After (Cloudinary)
```
Request: POST /api/blogs/upload-image  
Response: { url: "https://res.cloudinary.com/abc123/image/upload/v1234/blog_covers/image.jpg" }
Benefits: Persistent, global CDN, free tier generous
```

## How It Works in the App

1. When creating a blog post, EditorJS lets users upload images
2. Images are sent to `/api/blogs/upload-image` 
3. Multer-storage-cloudinary handles the upload
4. Cloudinary returns a secure HTTPS URL
5. The image is saved with the blog content

## Cover Image (CreatePost.jsx)
Currently accepts a URL paste. If you want file upload for cover images later:
- Add a file input
- Create a `/api/blogs/upload-cover` endpoint (same Cloudinary setup)
- Update CreatePost to send file instead of URL

## Testing
1. Create a new blog post
2. Try uploading an image using the editor
3. Check Cloudinary dashboard (https://cloudinary.com/console) → "Media Library" → "blog_covers" folder
4. Verify image is persisted and accessible

## Troubleshooting

**Error: "Cannot read properties of undefined (reading 'path')"**
- Missing Cloudinary environment variables in .env
- Restart backend server after adding env vars

**Error: "Not authenticated"**
- Make sure you're logged in when creating a post
- Check JWT token is valid

**Image shows as broken**
- Verify Cloudinary credentials are correct
- Check Media Library in Cloudinary console

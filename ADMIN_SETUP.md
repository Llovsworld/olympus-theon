# Admin Panel Setup Instructions

## Quick Setup

### 1. Create Environment Variables

Create a file called `.env.local` in the root of your project with the following content:

```env
DATABASE_URL="file:./dev.db"

# NextAuth - Generate a random secret for production
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials - CHANGE THESE!
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="YourSecurePassword123"
```

**Important:** Replace `YourSecurePassword123` with your own secure password!

### 2. Restart the Development Server

After creating `.env.local`, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Access the Admin Panel

1. Open `http://localhost:3000/admin`
2. You'll be redirected to the login page
3. Enter your credentials (username: `admin`, password: whatever you set)
4. Start creating posts and books!

## Features

### Rich Text Editor
- **Bold, Italic, Headings** - Text formatting
- **Lists** - Bullet and numbered lists
- **Quotes & Code** - Blockquotes and code blocks
- **Images** - Upload or paste image URLs
- **Videos** - Embed YouTube videos
- **Links** - Add hyperlinks

### Image Upload
- Drag & drop images
- Click to browse
- Max 5MB per image
- Supports JPG, PNG, GIF, WEBP

### Live Preview
- See your content in real-time
- Preview how it will look to readers
- Side-by-side editor and preview

## Security Notes

- Only you can access the admin panel (via username/password)
- Session expires after period of inactivity
- Images are stored locally in `/public/uploads/`
- For production, consider using a cloud storage service (Cloudinary, AWS S3)

## Generating a Secure Secret

For production, generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Copy the output and replace the value in `.env.local`

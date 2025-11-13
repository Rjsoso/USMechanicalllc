# Admin Panel Access

## Local Development

When running locally with `npm run dev`:

- **Website**: http://localhost:3000/
- **Admin Panel**: http://localhost:3000/admin

## Production Deployment

Once deployed (e.g., Vercel, Netlify):

- **Website**: `https://yourwebsite.com/`
- **Admin Panel**: `https://yourwebsite.com/admin`

## Login Credentials

- **Password**: `admin123`

⚠️ **Security Note**: For production, you should:
1. Change the password to something more secure
2. Consider implementing proper authentication (OAuth, Firebase Auth, etc.)
3. Add environment variables for the password

## Features

The admin panel allows you to edit:
- ✅ Hero section (headline, subtext, button text, background image)
- ✅ About section (title, text)
- ✅ Safety section (title, text)
- ✅ Recognition projects (add, edit, remove projects)

All changes are saved to `localStorage` and will be visible on the main website immediately after saving.

## Alternative: Sanity CMS

For production content management, use **Sanity CMS** at:
- **Studio**: https://us-mechanical.sanity.studio

Sanity provides a more robust solution with:
- Better UI for content editing
- Image uploads
- User permissions
- Version history
- And more...


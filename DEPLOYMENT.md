# Deployment Guide for U.S. Mechanical Website

## 🔗 Local Development URLs

While running the local server, you can access:

- **Main Website**: `http://localhost:8005/index.html` or `http://localhost:8005/`
- **Admin Panel**: `http://localhost:8005/admin-unified.html`
- **Services Pages**: 
  - `http://localhost:8005/services/hvac.html`
  - `http://localhost:8005/services/hydronic.html`
  - `http://localhost:8005/services/process-piping.html`
  - `http://localhost:8005/services/design-build.html`

## 🚀 Vercel Deployment

### Pre-Deployment Checklist

1. ✅ Build script configured in `package.json`
2. ✅ Vercel configuration file (`vercel.json`) created
3. ✅ `.vercelignore` file created to exclude unnecessary files
4. ✅ Tailwind CSS build output in `dist/output.css`

### Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

4. **Or use Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Vercel will automatically detect the configuration

### Expected Vercel URLs

Once deployed, your URLs will be:

- **Main Website**: `https://your-project-name.vercel.app/`
- **Admin Panel**: `https://your-project-name.vercel.app/admin` (via rewrite)
  - Or directly: `https://your-project-name.vercel.app/admin-unified.html`

After first deployment, you can also set up a custom domain:
- **Main Website**: `https://usmechanical.com`
- **Admin Panel**: `https://usmechanical.com/admin`

### Build Configuration

The project uses:
- **Build Command**: `npm run build` (builds Tailwind CSS)
- **Output Directory**: `.` (root directory)
- **Framework Preset**: Other (static HTML)

### Important Notes

1. **localStorage**: The admin panel uses `localStorage` for data persistence. This works on the client-side but data will be stored in each user's browser, not on the server.

2. **Image Uploads**: Currently, images are stored in `localStorage`. For production, you may want to:
   - Use a service like Cloudinary, AWS S3, or Vercel Blob Storage
   - Implement server-side storage for uploaded images

3. **Environment Variables**: If you need environment variables, create a `.env` file (not committed) and configure them in Vercel dashboard under Project Settings > Environment Variables.

4. **Security**: The admin panel is not password protected. Consider adding:
   - Authentication middleware
   - Password protection via Vercel's password protection feature
   - Or move admin panel behind a login system

## 📝 Next Steps

1. Run `npm run build` to ensure Tailwind CSS is up to date
2. Test the website locally
3. Deploy to Vercel when ready
4. Configure custom domain if needed
5. Set up analytics (optional)

## 🛠️ Local Development

To start local development server:

```bash
npm start
# or
python3 -m http.server 8005
```

Then visit: `http://localhost:8005`


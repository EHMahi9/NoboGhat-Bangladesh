# Render Deployment Migration - Tasks ✅

## Step 1: Create render.yaml at git repo root ✅
- [x] Copy render.yaml from `NoboGhat/` to repo root `../` for Render auto-detection

## Step 2: Remove Vercel-specific files ✅
- [x] Delete `frontend/vercel.json`
- [x] Delete `frontend/api/` directory (Vercel serverless proxy)

## Step 3: Update documentation ✅
- [x] README.md - Change Railway/Vercel → Render
- [x] docs/ARCHITECTURE.md - Update deployment section
- [x] docs/GOOGLE_LOGIN_SETUP.md - Update OAuth redirect URI
- [x] docs/PRESENTATION_NOTES.md - Update deployment references

## Step 4: Verify api.js ✅
- [x] Already points to `https://noboghat-backend.onrender.com`


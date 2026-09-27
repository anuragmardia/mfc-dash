# Setup checklist — one-time only

Do these roughly in order. Each step notes what it depends on.

## 1. Google Cloud OAuth Client ID
1. console.cloud.google.com → select or create a project
2. APIs & Services → Credentials → Create Credentials → OAuth client ID
3. Application type: Web application
4. Authorized JavaScript origins: add `https://anuragmardia.github.io` (or your actual Pages domain once known)
5. Copy the Client ID (ends in `.apps.googleusercontent.com`)
6. Paste it into two places in this repo:
   - `index.html`: the `"clientId": "..."` value
   - `Code.js`: the `CLIENT_ID` variable at the top
7. Also edit `Code.js`: add every family member's email who should have access to `ALLOWED_EMAILS`

## 2. Install and configure clasp (one-time on your machine)
```
npm install -g @google/clasp
clasp login
```
This opens a browser to authorize clasp against your Google account.

## 3. Connect clasp to the existing Apps Script project
Your current script's ID is in its URL: Apps Script editor → Project Settings → "Script ID".
```
cd mfc-dash
clasp clone <YOUR_SCRIPT_ID> --rootDir .
```
This will try to pull the existing files down — since we're providing `Code.js` and `appsscript.json` already, you can instead just confirm the `.clasp.json` file it creates points at the right script ID, then proceed to push our versions over it:
```
clasp push
```

## 4. Deploy the Apps Script as a new version
```
clasp deploy --description "clasp-managed deploy"
```
This updates the *existing* Web App URL (same one you've been using) rather than creating a new one, as long as you don't delete the old deployment first.

## 5. Push the frontend to GitHub
```
git init
git remote add origin https://github.com/anuragmardia/mfc-dash.git
git add .
git commit -m "Initial clasp-managed cockpit"
git push -u origin main
```
Then: repo Settings → Pages → Deploy from branch → main → /(root)

## 6. Cloudflare Access
1. Cloudflare dashboard → Zero Trust → Access → Applications → Add an application → Self-hosted
2. Domain: your GitHub Pages URL from step 5
3. Policy: Include → Emails → your email (add family members as needed)
4. Save

## 7. Verify
Open the Pages URL. You should hit the Cloudflare login first, then the dashboard, then the
"Sign in with Google" button should actually work (unlike on the claude.ai preview link, which
cannot load Google's sign-in script at all — that's expected and not a bug).

## Rotating access later
- Remove a family member: delete their email from `ALLOWED_EMAILS` in `Code.js`, then `clasp push && clasp deploy`.
- Revoke Cloudflare access: remove their email from the Access policy.
- No API keys to rotate anymore — this was the entire point of moving to Google Sign-In.

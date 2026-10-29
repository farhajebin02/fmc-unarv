# FMC ഉണർവ് (Unarv) – Registration website

A mobile-first registration page for the FMC Unarv women's wellness programme
(Family Medicine Centre, Karuvanpoyil). Women fill in the questionnaire,
and each registration lands as a row in a private Google Sheet.

```
public/            ← the website (this is what Vercel serves)
  index.html       ← the whole site: questions, consent, thank-you screen with WhatsApp button
  favicon.png, apple-touch-icon.png, fmc-logo.png
apps-script/
  Code.gs          ← backend that saves registrations to Google Sheets (NOT served by Vercel)
vercel.json        ← tells Vercel to serve the public/ folder
```

No build step, no dependencies – it is plain HTML/JS.

---

## 1. Set up the Google Sheet backend (once)

1. Open the Google Sheet linked to your Google Form (Form → Responses → View in Sheets), or create a new Sheet.
2. In the Sheet: **Extensions → Apps Script**. Delete the sample code and paste the
   contents of `apps-script/Code.gs`. Save.
3. Choose the function **`setup`** in the toolbar and click **▶ Run**. Approve the
   permissions (it creates the *Website Registrations* tab with headers).
4. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (it starts with `https://script.google.com/macros/s/...`).

> If you later edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version**
> so the same URL keeps working.

## 2. Fill in your settings

Open `public/index.html`, find the `CONFIG` block near the bottom and replace:

```js
SCRIPT_URL: 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE',  // ← Web app URL from step 1
```

The fee is not collected on the website. After submitting, the thank-you screen has a
WhatsApp button that opens a chat to `WHATSAPP_NUMBER` with the person's name and phone
filled in; you send them the payment details there.

## 3. Push to GitHub

```bash
cd fmc-unarv
git init
git add .
git commit -m "FMC Unarv registration site"
git branch -M main
git remote add origin https://github.com/<your-username>/fmc-unarv.git
git push -u origin main
```

(Create the empty `fmc-unarv` repo on GitHub first. A **private** repo is fine.)

## 4. Deploy on Vercel

1. Go to vercel.com → **Add New… → Project** → import the `fmc-unarv` GitHub repo.
2. Framework preset: **Other**. Leave Build Command and Install Command empty.
   (`vercel.json` already points Vercel at the `public/` folder.)
3. Click **Deploy**. You get a link like `https://fmc-unarv.vercel.app`.
4. Optional: **Settings → Domains** to rename it or attach your own domain.

Every `git push` to `main` redeploys automatically.

## 5. Test before sharing

1. Open the Vercel link on your phone and submit one test registration.
2. Check that a new row appears in the *Website Registrations* tab.
3. Delete the test row, then share the link in the WhatsApp groups.

While `SCRIPT_URL` is not set, the site runs in **preview mode** – it shows a notice
and nothing is saved.

## Managing registrations

- Each row has two checkboxes at the end: **ഫീസ് ലഭിച്ചു ✓** (fee received)
  and **ഗ്രൂപ്പിൽ ചേർത്തു ✓** (added to WhatsApp group).
- Payment is handled on WhatsApp. Tick **ഫീസ് ലഭിച്ചു ✓** once you receive the fee.
- BMI is calculated automatically from height and weight.

## Privacy

The Sheet contains health details. Keep it **private** – share it only with
Dr. Nishath Rahiman and the organisers. Do not commit the Sheet or exported
registrations to GitHub.

## Notes

- **Editing questions:** the questions live in the `STEPS` list in `index.html`.
  If you add a new question, also add its key to `COLUMNS` in `Code.gs` and
  redeploy the Apps Script (new version) so it gets its own column.
- Enquiries: WhatsApp +91 90483 84956.

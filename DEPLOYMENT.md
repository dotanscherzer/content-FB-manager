# הוראות Deployment ל-Render ו-Netlify

> **📝 לפני שנתחיל:** אם עדיין לא העלת את הקוד ל-GitHub, עקוב אחר ההוראות המפורטות ב-[GIT_SETUP.md](GIT_SETUP.md)

## שלב 1: וידוא שהקוד ב-GitHub

ודא שה-repository שלך ב-GitHub כולל:
- ✅ תיקייה `backend/`
- ✅ תיקייה `frontend/`
- ✅ קבצים: `README.md`, `.gitignore`

---

## שלב 2: הגדרת Render (Backend)

### יצירת שירות Web ב-Render

1. היכנס ל-https://render.com והתחבר עם חשבון GitHub שלך

2. לחץ על **"New +"** → **"Web Service"**

3. **בחירת Source Code - זה החלק החשוב!**
   
   **⚠️ חשוב:** אל תלחץ על "Public Git Repository"!
   
   במקום זה:
   - לחץ על הטאב **"Git Provider"** (הטאב הראשון, בצד שמאל)
   - אם אתה לא רואה את הטאב הזה, זה אומר שעדיין לא חיברת את חשבון GitHub שלך
   - לחץ על **"Connect GitHub"** או **"Connect account"** וחבר את חשבון GitHub שלך
   - לאחר החיבור, תראה רשימה של ה-repositories שלך
   - **בחר את ה-repository שיצרת** (`content-FB-manager`)

4. **הגדרת השירות:**
   
   לאחר שבחרת את ה-repository, תעבור למסך ההגדרות. מלא את השדות הבאים:
   
   - **Name:** `content-fb-manager-backend` (או כל שם שתרצה)
   - **Region:** בחר את האזור הקרוב אליך (למשל: Frankfurt, Singapore)
   - **Branch:** `main`
   - **Root Directory:** `backend` ← **זה חשוב מאוד!** (זה אומר ל-Render לבנות מתוך תיקיית backend)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** בחר את התוכנית המתאימה (Free tier זמין)

### הגדרת Environment Variables ב-Render

לחץ על **"Environment"** והוסף את המשתנים הבאים:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | ה-connection string שלך ל-MongoDB |
| `MAKE_WEBHOOK_URL` | ה-URL של ה-webhook שלך במייק |
| `PORT` | השאר ריק - Render יקבע זאת אוטומטית |
| `FRONTEND_URL` | ה-URL של האפליקציה ב-Netlify (נוסיף אחרי ה-deployment) |
| `NODE_ENV` | `production` |

**או:** השתמש בקובץ `render.yaml` שכבר קיים:
- ב-Render, בחר **"New +"** → **"Blueprint"**
- בחר את ה-repository
- Render יקרא את `render.yaml` ויגדיר את השירות אוטומטית
- תצטרך רק להוסיף את ה-Environment Variables ב-Render Dashboard

### קבלת ה-URL של Backend

לאחר שה-deployment מסתיים:
1. Render ייתן לך URL, למשל: `https://content-fb-manager-backend.onrender.com`
2. שמור את ה-URL הזה - תצטרך אותו לשלב הבא

---

## שלב 3: הגדרת Netlify (Frontend)

### יצירת Site ב-Netlify

1. היכנס ל-https://app.netlify.com והתחבר עם חשבון GitHub שלך

2. לחץ על **"Add new site"** → **"Import an existing project"**

3. בחר **"Deploy with GitHub"** ובחר את ה-repository (`content-FB-manager`)

4. במסך ההגדרות, מלא:
   - **Base directory:** `frontend` ← **זה חשוב!**
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - **Branch to deploy:** `main`

### הגדרת Environment Variables ב-Netlify

לפני ה-deployment הראשון:

1. לחץ על **"Show advanced"** → **"New variable"**
2. הוסף:
   - **Key:** `VITE_API_URL`
   - **Value:** ה-URL של Backend מ-Render (למשל: `https://content-fb-manager-backend.onrender.com`)

3. לחץ על **"Deploy site"**

### עדכון CORS ב-Render

לאחר ש-Netlify נותן לך URL (למשל: `https://your-app-name.netlify.app`):

1. חזור ל-Render Dashboard
2. עבור ל-Environment Variables
3. **הוסף או עדכן** את `FRONTEND_URL` להיות ה-URL של Netlify
   - **⚠️ חשוב:** ה-URL חייב להתחיל ב-`https://` ולהסתיים ב-`.netlify.app` (ללא `/` בסוף)
   - דוגמה: `https://rainbow-tulumba-1de9ba.netlify.app`
4. Render יבצע re-deploy אוטומטי (זה יכול לקחת 2-3 דקות)

**📖 אם יש שגיאת CORS:** ראה [CORS_FIX.md](CORS_FIX.md) לפתרון מפורט

---

## שלב 4: בדיקה ופתרון בעיות

### בדיקת Backend

פתח בדפדפן: `https://your-backend-url.onrender.com/health`

צריך לראות:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### בדיקת Frontend

פתח את ה-URL של Netlify. צריך לראות את האפליקציה עם הטאבים.

### פתרון בעיות נפוצות

**בעיה: Backend לא מתחבר ל-MongoDB**
- ✅ בדוק שה-`MONGODB_URI` נכון
- ✅ וודא ש-MongoDB מאפשר חיבורים מ-Render (IP whitelist)

**בעיה: CORS errors ב-console**
- ✅ בדוק ש-`FRONTEND_URL` ב-Render שווה ל-URL של Netlify
- ✅ וודא ש-`VITE_API_URL` ב-Netlify שווה ל-URL של Render

**בעיה: Frontend לא מוצא את ה-API**
- ✅ בדוק שה-`VITE_API_URL` מוגדר ב-Netlify Environment Variables
- ✅ לאחר הוספת משתנה סביבה ב-Netlify, צריך לעשות re-deploy

---

## עדכונים עתידיים

לאחר כל שינוי בקוד:

```bash
git add .
git commit -m "תיאור השינוי"
git push origin main
```

- **Render** יבצע re-deploy אוטומטי של Backend
- **Netlify** יבצע re-deploy אוטומטי של Frontend

---

## סיכום המבנה

```
GitHub Repository: content-FB-manager/
├── backend/          ← Render יבנה מכאן
├── frontend/         ← Netlify יבנה מכאן
├── README.md
└── render.yaml       ← הוראות ל-Render
```

**Render:** בונה מתוך `backend/`  
**Netlify:** בונה מתוך `frontend/`


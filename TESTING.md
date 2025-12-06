# מדריך בדיקה למערכת

## שלב 1: בדיקת Backend ב-Render

### 1.1 בדיקת חיבור בסיסי

פתח בדפדפן את ה-URL של Render שלך (למשל: `https://content-fb-manager-backend.onrender.com/health`)

**צריך לראות:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

✅ **אם אתה רואה את זה** - השרת עובד!  
❌ **אם אתה רואה שגיאה** - בדוק את ה-logs ב-Render (Settings → Logs)

### 1.2 בדיקת חיבור ל-MongoDB

פתח את אחד מה-endpoints הבאים:

- **Emails:** `https://your-backend-url.onrender.com/api/emails`
- **FB Posts:** `https://your-backend-url.onrender.com/api/fb-posts`
- **Newsletter Topics:** `https://your-backend-url.onrender.com/api/newsletter-topics`

**צריך לראות:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": X,
    "totalPages": Y
  }
}
```

❌ **אם אתה רואה שגיאת חיבור ל-MongoDB:**
- בדוק שה-`MONGODB_URI` נכון ב-Render Environment Variables
- וודא ש-MongoDB מאפשר חיבורים מ-IP של Render (אם יש IP whitelist)

---

## שלב 2: בדיקת Frontend ב-Netlify

### 2.1 פתיחת האפליקציה

פתח את ה-URL של Netlify (למשל: `https://your-app-name.netlify.app`)

**צריך לראות:**
- ✅ כותרת "Content FB Manager"
- ✅ 3 טאבים: אימיילים, פוסטים בפייסבוק, נושאי ניוזלטר
- ✅ רשימת נתונים (או הודעה אם אין נתונים)

### 2.2 בדיקת קריאות API

1. פתח את **Developer Tools** בדפדפן (F12)
2. עבור לטאב **Network** (רשת)
3. לחץ על אחד הטאבים באפליקציה (למשל: "אימיילים")

**צריך לראות:**
- ✅ קריאה ל-API: `/api/emails` (או `/api/fb-posts`, `/api/newsletter-topics`)
- ✅ Status: 200 OK
- ✅ תגובה עם data ו-pagination

❌ **אם אתה רואה שגיאת CORS:**
- בדוק ש-`FRONTEND_URL` ב-Render שווה ל-URL של Netlify
- וודא שה-URL מתחיל ב-`https://`
- עשה re-deploy ב-Render לאחר עדכון `FRONTEND_URL`

❌ **אם אתה רואה שגיאת 404 או "API not found":**
- בדוק ש-`VITE_API_URL` מוגדר ב-Netlify Environment Variables
- עשה re-deploy ב-Netlify לאחר הוספת המשתנה

---

## שלב 3: בדיקת פונקציונליות מלאה

### 3.1 בדיקת דפדוף (Pagination)

1. עבור לטאב "אימיילים" (או כל טאב אחר)
2. לחץ על כפתור "הבא" (Next)
3. ודא שהנתונים משתנים

✅ **אם זה עובד** - Pagination תקין!

### 3.2 בדיקת הצגת תמונות (FB Posts)

1. עבור לטאב "פוסטים בפייסבוק"
2. ודא שהתמונות מוצגות (אם יש פוסטים עם תמונות)

✅ **אם תמונות מוצגות** - הכל תקין!  
❌ **אם תמונות לא מוצגות** - בדוק את ה-logs ב-Render

### 3.3 בדיקת הפעלת Make Webhook

1. עבור לטאב "נושאי ניוזלטר"
2. לחץ על כפתור "הפעל תהליך מייק" ליד אחת הרשומות
3. בדוק שאתה רואה הודעת הצלחה

✅ **אם אתה רואה "תהליך מייק הופעל בהצלחה!"** - הכל תקין!

❌ **אם אתה רואה שגיאה:**
- בדוק שה-`MAKE_WEBHOOK_URL` נכון ב-Render Environment Variables
- פתח את ה-logs ב-Render (Settings → Logs) כדי לראות את השגיאה המדויקת
- ודא שה-webhook במייק מוכן לקבל קריאות

---

## שלב 4: בדיקת Logs וניפוי שגיאות

### 4.1 בדיקת Logs ב-Render

1. היכנס ל-Render Dashboard
2. לחץ על השירות שלך
3. לחץ על **"Logs"** בתפריט

**מה לחפש:**
- ✅ `MongoDB connected successfully`
- ✅ `Server is running on port XXXX`
- ❌ שגיאות חיבור
- ❌ שגיאות API

### 4.2 בדיקת Logs ב-Netlify

1. היכנס ל-Netlify Dashboard
2. לחץ על ה-site שלך
3. לחץ על **"Deploys"** → בחר את ה-deploy האחרון
4. לחץ על **"View build logs"**

**מה לחפש:**
- ✅ `Build successful`
- ✅ `Published directory: frontend/dist`
- ❌ שגיאות build
- ❌ שגיאות בחיפוש קבצים

---

## שלב 5: בדיקה מקיפה - Checklist

עבור על הרשימה הבאה ווודא שהכל עובד:

### Backend (Render)
- [ ] Health check endpoint עובד (`/health`)
- [ ] API endpoints מחזירים נתונים (`/api/emails`, `/api/fb-posts`, `/api/newsletter-topics`)
- [ ] MongoDB מחובר (ללא שגיאות ב-logs)
- [ ] CORS מוגדר נכון (ללא שגיאות CORS ב-console)

### Frontend (Netlify)
- [ ] האפליקציה נפתחת ונראית טוב
- [ ] כל הטאבים עובדים
- [ ] נתונים מוצגים מהמסד נתונים
- [ ] Pagination עובד
- [ ] תמונות מוצגות (אם יש)
- [ ] אין שגיאות ב-Console (F12)

### Make Integration
- [ ] כפתור "הפעל תהליך מייק" עובד
- [ ] הודעת הצלחה מופיעה
- [ ] התהליך במייק מתבצע (בדוק במייק)

---

## פתרון בעיות נפוצות

### שגיאה: "Cannot GET /"
**פתרון:** וודא שה-URL נכון והשרת עובד (`/health` endpoint)

### שגיאה: "CORS policy: No 'Access-Control-Allow-Origin'"
**פתרון:**
1. בדוק ש-`FRONTEND_URL` ב-Render שווה בדיוק ל-URL של Netlify
2. עשה re-deploy ב-Render

### שגיאה: "Network Error" או "Failed to fetch"
**פתרון:**
1. בדוק ש-`VITE_API_URL` מוגדר ב-Netlify
2. ודא שה-URL מתחיל ב-`https://`
3. עשה re-deploy ב-Netlify

### שגיאה: "MongoDB connection error"
**פתרון:**
1. בדוק שה-`MONGODB_URI` נכון
2. וודא ש-MongoDB מאפשר חיבורים מ-Render (IP whitelist)
3. בדוק שה-connection string כולל את שם ה-database (`prodDB`)

### האפליקציה לא מציגה נתונים
**פתרון:**
1. פתח את Console (F12) ובדוק אם יש שגיאות
2. בדוק את הטאב Network (רשת) - האם יש קריאות ל-API?
3. בדוק את ה-Status של הקריאות (200 OK?)

---

## בדיקת End-to-End מלאה

### תרחיש בדיקה:

1. ✅ פתח את האפליקציה ב-Netlify
2. ✅ עבור לטאב "אימיילים" - ודא שנתונים מוצגים
3. ✅ עבור לטאב "פוסטים בפייסבוק" - ודא שנתונים מוצגים
4. ✅ עבור לטאב "נושאי ניוזלטר" - ודא שנתונים מוצגים
5. ✅ לחץ על "הפעל תהליך מייק" על אחת הרשומות
6. ✅ ודא שאתה רואה הודעת הצלחה
7. ✅ בדוק במייק שהתהליך רץ

אם כל השלבים עוברים - המערכת עובדת בהצלחה! 🎉

---

## צעדי בדיקה מהירה

אם אתה רוצה בדיקה מהירה, פתח את הקישורים הבאים בדפדפן (החלף את ה-URLs ב-URLs שלך):

1. **Backend Health:** `https://your-backend.onrender.com/health`
2. **Backend API:** `https://your-backend.onrender.com/api/newsletter-topics`
3. **Frontend:** `https://your-app.netlify.app`

כל אחד מהם צריך להחזיר תגובה תקינה.


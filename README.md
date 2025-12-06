# Content FB Manager

מערכת ניהול תוכן Full-Stack להצגת נתונים מ-MongoDB עם אפשרות להפעיל תהליכים במייק.

## מבנה הפרויקט

```
content-FB-manager/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite Client
└── README.md
```

## טכנולוגיות

- **Backend**: Node.js, Express, Mongoose, MongoDB
- **Frontend**: React, Vite, Axios
- **Deployment**: Render (Backend), Netlify (Frontend)

## הגדרת פיתוח מקומי

### דרישות מוקדמות

- Node.js 18+ 
- npm או yarn
- MongoDB connection string

### Backend Setup

1. עבור לתיקיית backend:
```bash
cd backend
```

2. התקן תלויות:
```bash
npm install
```

3. צור קובץ `.env`:
```bash
MONGODB_URI=your_mongodb_connection_string
MAKE_WEBHOOK_URL=your_make_webhook_url
PORT=3000
FRONTEND_URL=http://localhost:5173
```

4. הפעל את השרת:
```bash
npm start
# או למצב development:
npm run dev
```

השרת יפעל על `http://localhost:3000`

### Frontend Setup

1. עבור לתיקיית frontend:
```bash
cd frontend
```

2. התקן תלויות:
```bash
npm install
```

3. צור קובץ `.env`:
```bash
VITE_API_URL=http://localhost:3000
```

4. הפעל את השרת הפיתוח:
```bash
npm run dev
```

האפליקציה תיפתח על `http://localhost:5173`

## API Endpoints

### Emails
- `GET /api/emails?page=1&limit=20` - קבלת רשימת אימיילים

### Facebook Posts
- `GET /api/fb-posts?page=1&limit=20` - קבלת רשימת פוסטים

### Newsletter Topics
- `GET /api/newsletter-topics?page=1&limit=20` - קבלת רשימת נושאים
- `POST /api/newsletter-topics/:id/trigger-make` - הפעלת webhook למייק על רשומה ספציפית

## Deployment

**📖 לקובץ הוראות מפורט: ראה [DEPLOYMENT.md](DEPLOYMENT.md)**

**🧪 לבדיקת המערכת לאחר Deployment: ראה [TESTING.md](TESTING.md)**

### סיכום קצר:

1. **העלה את הקוד ל-GitHub** (ראה DEPLOYMENT.md לפרטים)

2. **Render (Backend)**:
   - צור Web Service חדש
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - הוסף Environment Variables: `MONGODB_URI`, `MAKE_WEBHOOK_URL`, `FRONTEND_URL`

3. **Netlify (Frontend)**:
   - צור Site חדש מה-repository
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - הוסף Environment Variable: `VITE_API_URL` (ה-URL של Render)

**חשוב:** כל אחד מהשירותים בונה מתוך התיקייה שלו (`backend/` או `frontend/`)

## מבנה הטבלאות

### Email Collection
- `_id`, `ID`, `body`, `Subject`, `sent_at`, `html_body`, `created_at`, `Sender_name`, `sender_email`

### fb_posts Collection
- `_id`, `image`, `email_id`, `post_text`, `created_at`, `fb_post_id`, `post_title`, `topic_title`

### newsletter_topics Collection
- `_id`, `topic_key`, `email_id`, `created_at`, `email_subject`, `topic_score`, `topic_summary`, `topic_title`, `topic_type`, `fb_post_id`

## שימוש

1. פתח את האפליקציה בדפדפן
2. בחר את הטאב הרצוי (אימיילים, פוסטים, נושאי ניוזלטר)
3. לדפדוף בין העמודים, השתמש בכפתורי הדפדוף
4. להפעלת תהליך מייק על נושא ניוזלטר, לחץ על כפתור "הפעל תהליך מייק" ליד הרשומה

## פתרון בעיות

### שגיאת חיבור ל-MongoDB
- וודא שה-connection string נכון
- וודא שה-MongoDB נגיש מהסביבה שלך

### CORS errors
- וודא ש-`FRONTEND_URL` ב-backend מוגדר נכון
- וודא ש-`VITE_API_URL` ב-frontend מוגדר נכון

### שגיאת webhook במייק
- וודא שה-`MAKE_WEBHOOK_URL` נכון
- בדוק את ה-logs ב-Render לפרטים נוספים

## רישיון

ISC


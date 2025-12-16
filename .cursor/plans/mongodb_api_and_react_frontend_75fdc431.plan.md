---
name: MongoDB API and React Frontend
overview: בניית מערכת צד שרת (Node.js + Express) וצד לקוח (React) להצגת נתונים מ-MongoDB עם אפשרות להפעיל תהליך במייק על רשומה מטבלת newsletter_topics
todos: []
---

# תוכנית: מערכת ניהול תוכן עם MongoDB ו-React

## סקירה כללית

בניית מערכת full-stack עם:

- **Backend**: Node.js + Express עם חיבור ל-MongoDB
- **Frontend**: React עם ממשק משתמש להצגת נתונים
- **API Integration**: אפשרות להפעיל webhook במייק על רשומות מטבלת newsletter_topics

## מבנה הפרויקט

```
content-FB-manager/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models (EMAIL, fb_posts, newsletter_topics)
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── config/          # MongoDB connection
│   │   └── server.js        # Express server entry point
│   ├── package.json
│   └── .env                 # MongoDB connection string, Make webhook URL
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js       # או create-react-app
└── README.md
```

## שלבי היישום

### Backend (Node.js + Express)

1. **הגדרת פרויקט**: יצירת `backend/package.json` עם תלויות (express, mongoose, cors, dotenv)
2. **חיבור ל-MongoDB**: קובץ `backend/src/config/database.js` עם חיבור ל-MongoDB
3. **Mongoose Models**: יצירת models עבור 3 הטבלאות:

   - `EMAIL` model
   - `fb_posts` model  
   - `newsletter_topics` model

4. **API Routes**: יצירת endpoints:

   - `GET /api/emails` - קבלת כל האימיילים
   - `GET /api/fb-posts` - קבלת כל הפוסטים
   - `GET /api/newsletter-topics` - קבלת כל הנושאים
   - `POST /api/newsletter-topics/:id/trigger-make` - הפעלת webhook למייק על רשומה ספציפית

5. **Controllers**: לוגיקה עסקית לכל endpoint
6. **Server Setup**: `server.js` עם Express, CORS, ו-routing

### Frontend (React)

1. **הגדרת פרויקט**: יצירת React app (Vite מומלץ)
2. **API Service**: קובץ `frontend/src/services/api.js` עם כל ה-API calls
3. **Components**: 

   - `EmailList` - הצגת רשימת אימיילים
   - `FbPostsList` - הצגת רשימת פוסטים
   - `NewsletterTopicsList` - הצגת רשימת נושאים + כפתור להפעלת מייק

4. **Navigation**: תפריט ניווט בין הטבלאות השונות
5. **UI Styling**: עיצוב בסיסי ונקי (CSS או Tailwind)

### Make Integration

1. **Webhook Configuration**: משתנה סביבה `MAKE_WEBHOOK_URL` ב-`.env`
2. **Trigger Endpoint**: POST endpoint שמקבל ID של newsletter_topic ושולח את הנתונים ל-webhook של מייק

### Deployment

1. **Render (Backend)**:

   - קובץ `backend/render.yaml` או הגדרות ב-Render dashboard
   - Environment variables: `MONGODB_URI`, `MAKE_WEBHOOK_URL`, `PORT`
   - Build command: `npm install`
   - Start command: `node src/server.js` או `npm start`
   - CORS configuration להתיר קריאות מ-Netlify domain

2. **Netlify (Frontend)**:

   - קובץ `frontend/netlify.toml` עם build settings
   - Environment variable: `VITE_API_URL` עם ה-URL של Render backend
   - Build command: `npm run build`
   - Publish directory: `dist` (אם Vite) או `build` (אם Create React App)

3. **Environment Configuration**:

   - Backend `.env.example` עם template של כל ה-variables
   - Frontend `.env.example` עם API URL template

## קבצים עיקריים

- `backend/src/server.js` - נקודת הכניסה של השרת
- `backend/src/config/database.js` - חיבור MongoDB
- `backend/src/models/*.js` - Mongoose models
- `backend/src/routes/*.js` - API routes
- `backend/src/controllers/*.js` - Controllers
- `frontend/src/App.jsx` - קומפוננטה ראשית
- `frontend/src/services/api.js` - API service layer

## מבנה הטבלאות (מתמונות MongoDB Compass)

### Email Collection (`prodDB.Email`)

- `_id`: ObjectId
- `ID`: String
- `body`: String (HTML/text content)
- `Subject`: String
- `sent_at`: Date
- `html_body`: String (HTML content)
- `created_at`: Date
- `Sender_name`: String
- `sender_email`: String

### newsletter_topics Collection (`prodDB.newsletter_topics`)

- `_id`: ObjectId
- `topic_key`: String
- `email_id`: String
- `created_at`: Date
- `email_subject`: String
- `topic_score`: Number
- `topic_summary`: String
- `topic_title`: String
- `topic_type`: String
- `fb_post_id`: String

### fb_posts Collection (`prodDB.fb_posts`)

- `_id`: ObjectId
- `image`: Binary (Base64 encoded image)
- `email_id`: String
- `post_text`: String
- `created_at`: Date
- `fb_post_id`: String
- `post_title`: String
- `topic_title`: String

## הערות

- החיבור ל-MongoDB יהיה ל-`prodDB` database
- Make webhook URL יוגדר ב-`.env` ויהיה ניתן לעדכן אותו
- Frontend יקרא ל-backend API על localhost:3000 (או פורט אחר)
- לא נדרשת אבטחה בשלב זה (ללא authentication)
- התמונה ב-fb_posts תישלח כ-base64 string ל-frontend
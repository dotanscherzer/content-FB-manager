# הוראות להעלאה ל-GitHub

## צעד אחר צעד

### 1. יצירת Repository ב-GitHub

1. היכנס ל-https://github.com/new
2. מלא:
   - **Repository name:** `content-FB-manager` (או שם אחר)
   - **Description:** (אופציונלי)
   - **Visibility:** Public או Private (בחר לפי רצונך)
3. **אל תסמן**:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
4. לחץ על **"Create repository"**

### 2. העלאת הקוד

פתח Terminal/Command Prompt בתיקייה הראשית של הפרויקט (`content-FB-manager`) והפעל:

```bash
# אתחול Git
git init

# הוסף את כל הקבצים
git add .

# צור commit ראשון
git commit -m "Initial commit: Full-stack app with backend and frontend"

# הוסף את ה-remote (החלף את USERNAME ו-REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# העלה ל-GitHub
git branch -M main
git push -u origin main
```

**החלף:**
- `USERNAME` = שם המשתמש שלך ב-GitHub
- `REPO_NAME` = שם ה-repository שיצרת

### 3. וידוא שהכל עלה

עמוד ב-GitHub Repository שלך ותוודא שאתה רואה:
- ✅ תיקייה `backend/`
- ✅ תיקייה `frontend/`
- ✅ קבצים: `README.md`, `DEPLOYMENT.md`, `.gitignore`

### 4. המשך ל-Deployment

כעת המשך לקובץ [DEPLOYMENT.md](DEPLOYMENT.md) כדי להגדיר את Render ו-Netlify.


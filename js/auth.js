// ==========================================
// 1. ניהול דינמי של התפריט בכל עמודי האתר
// ==========================================
function updateAuthButton() {
    // שליפת שם המשתמש המחובר מהזיכרון של הדפדפן
    const currentUser = localStorage.getItem('currentUser');
    
    // שליפת כל הקישורים (תגיות a) שנמצאים בתוך ה-header של האתר
    const allLinks = document.querySelectorAll('header a');

    allLinks.forEach(link => {
        const text = link.textContent.trim();

        if (currentUser) {
            // --- מצב מחובר ---
            // בודק בצורה גמישה אם הקישור מכיל את המילה "התחבר" או שכבר רשום עליו "שלום"
            if (text.includes('התחבר') || text.includes('שלום,')) {
                link.textContent = `שלום, ${currentUser} | התנתק`;
                link.href = "#";
                
                // הגדרת פעולת הלחיצה להתנתקות
                link.onclick = function(e) {
                    e.preventDefault();
                    localStorage.removeItem('currentUser'); // מחיקת החיבור מהזיכרון
                    
                    // בדיקה האם אנחנו בדף הבית או בדף פנימי לצורך ריענון נכון של העמוד
                    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('.html');
                    window.location.href = isHomePage ? 'index.html' : '../index.html';
                };
            }
            
            // מחפש את כפתור ההרשמה (כל מה שמכיל "הרשמ") ומסתיר אותו לחלוטין
            if (text.includes('הרשמ')) {
                if (link.parentElement) {
                    link.parentElement.style.display = 'none'; // מסתיר את כל ה-li שלו
                } else {
                    link.style.display = 'none';
                }
            }
        } else {
            // --- מצב מנותק (אורח) ---
            if (text.includes('שלום,')) {
                link.textContent = 'התחברות';
                link.onclick = null;
            }
            if (text.includes('הרשמ')) {
                if (link.parentElement) {
                    link.parentElement.style.display = 'flex';
                } else {
                    link.style.display = 'inline-block';
                }
            }
        }
    });
}

// פונקציה למעבר בין הטפסים בתוך דף ה-login.html
function toggleForms() {
    document.getElementById('login-section').classList.toggle('hidden');
    document.getElementById('register-section').classList.toggle('hidden');
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('reg-error').classList.add('hidden');
}

// בדיקה איזה טופס לפתוח בדף login.html לפי הכתובת ב-URL
function checkUrlMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (mode === 'register' && loginSection && registerSection) {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    } else if (mode === 'login' && loginSection && registerSection) {
        if (loginSection) loginSection.classList.remove('hidden');
        if (registerSection) registerSection.classList.add('hidden');
    }
}

// הרצת הפונקציות ברגע שהעמוד נטען בדפדפן
document.addEventListener('DOMContentLoaded', () => {
    checkUrlMode();
    updateAuthButton();
});


// ==========================================
// 2. לוגיקת טפסי שליחה והעברה לדף הבית
// ==========================================

// בעת שליחת טופס הרשמה
document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        document.getElementById('reg-error').classList.remove('hidden');
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', name); 
    
    // מעבר ישיר ותקין אל דף הבית (יוצא מתיקיית העמודים החוצה)
    window.location.href = '../index.html';
});

// בעת שליחת טופס התחברות
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(user => user.email === email && user.password === password);
    
    if (validUser) {
        localStorage.setItem('currentUser', validUser.name); 
        
        // מעבר ישיר ותקין אל דף הבית (יוצא מתיקיית העמודים החוצה)
        window.location.href = '../index.html';
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
});
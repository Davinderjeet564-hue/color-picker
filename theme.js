const body = document.body;
const themeChangeBtn = document.querySelector('.theme-change-btn');

const theme =  localStorage.getItem('theme');

if (theme === 'dark') {
    body.classList.add('darkmode');
    body.classList.remove('lightmode');
} else {
    body.classList.add('lightmode');
    body.classList.remove('darkmode');
}

themeChangeBtn.addEventListener('click', () => {
    themeChangeBtn.classList.toggle('clicked');
    body.classList.toggle('darkmode');
    body.classList.toggle('lightmode');
    localStorage.setItem('theme', body.classList.contains('darkmode') ? 'dark' : 'light');
});
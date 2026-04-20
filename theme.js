const body = document.body;
const themeChangeBtn = document.querySelector('.theme-change-btn');

localStorage.getItem('theme') === 'dark' ? body.classList.add('darkmode') : body.classList.remove('darkmode');

themeChangeBtn.addEventListener('click', () => {
    themeChangeBtn.classList.toggle('clicked');
    body.classList.toggle('darkmode');
    localStorage.setItem('theme', body.classList.contains('darkmode') ? 'dark' : 'light');
});
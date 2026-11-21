'use strict';

// Тестовая авторизация без сервера и базы данных.
const demoUsers = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'user', password: 'user', role: 'user' },
];
const usersKey = 'polka.users';
const sessionKey = 'polka.session';

function readSaved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function getUsers() {
  return [...demoUsers, ...readSaved(usersKey, [])];
}

function saveSession(user) {
  // Для отображения аккаунта пароль в сессии не нужен.
  localStorage.setItem(sessionKey, JSON.stringify({ username: user.username, role: user.role }));
}

const accountLink = document.querySelector('[data-account-link]');
const form = document.querySelector('#auth-form');
const accountPanel = document.querySelector('#account-panel');
const formsPanel = document.querySelector('#auth-forms');
let mode = 'login';

function renderAccount() {
  const session = readSaved(sessionKey, null);
  if (accountLink) accountLink.textContent = session ? 'Мой аккаунт' : 'Войти';
  if (!accountPanel) return;
  accountPanel.hidden = !session;
  formsPanel.hidden = Boolean(session);
  if (session) {
    document.querySelector('#account-name').textContent = session.username;
    document.querySelector('#account-role').textContent = session.role === 'admin' ? 'Администратор' : 'Пользователь';
  }
}

if (form) {
  const username = form.elements.username;
  const password = form.elements.password;
  const message = document.querySelector('#auth-message');

  document.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      mode = button.dataset.authMode;
      document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      const registering = mode === 'register';
      document.querySelector('#form-title').textContent = registering ? 'Давайте знакомиться.' : 'С возвращением.';
      document.querySelector('#form-description').textContent = registering ? 'Придумайте логин и пароль.' : 'Войдите в свой аккаунт.';
      document.querySelector('#auth-submit').textContent = registering ? 'Зарегистрироваться' : 'Войти';
      password.autocomplete = registering ? 'new-password' : 'current-password';
      message.textContent = '';
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = '';
    let user;
    try {
      if (mode === 'register') {
        // Все новые аккаунты получают роль обычного пользователя.
        user = { username: username.value, password: password.value, role: 'user' };
        const users = readSaved(usersKey, []);
        users.push(user);
        localStorage.setItem(usersKey, JSON.stringify(users));
      } else {
        user = getUsers().find((item) => item.username === username.value && item.password === password.value);
        if (!user) {
          message.textContent = 'Не удалось войти: логин или пароль не совпадают.';
          return;
        }
      }
      saveSession(user);
      form.reset();
      renderAccount();
    } catch {
      message.textContent = 'Для входа разрешите браузеру сохранять данные сайта.';
    }
  });

  document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem(sessionKey);
    renderAccount();
  });
}

window.addEventListener('storage', renderAccount);
renderAccount();

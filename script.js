'use strict';

const filters = document.querySelectorAll('[data-filter]');
const works = document.querySelectorAll('.work');
const filterStatus = document.querySelector('#filter-status');
const dialog = document.querySelector('#info-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    let visibleCount = 0;
    works.forEach((work) => {
      work.hidden = category !== 'all' && work.dataset.category !== category;
      if (!work.hidden) visibleCount += 1;
    });
    filterStatus.textContent = `Работ в выбранной категории: ${visibleCount}.`;
  });
});

function showInfo(title, description) {
  dialogTitle.textContent = title;
  dialogDescription.textContent = description;
  dialog.showModal();
}

document.querySelectorAll('[data-author]').forEach((button) => {
  button.addEventListener('click', () => {
    showInfo('Ваша полка скоро появится', 'Сейчас это первая версия площадки. Публикация работ и личные профили появятся на следующем этапе. Пока можно познакомиться с идеей и посмотреть демонстрационную коллекцию.');
  });
});

document.querySelectorAll('[data-work]').forEach((button) => {
  button.addEventListener('click', () => {
    showInfo(button.dataset.work, `Пример работы для будущей витрины. Демонстрационная цена: ${button.dataset.price}. Авторы и работы вымышлены. Покупка, скачивание и оплата пока недоступны.`);
  });
});

dialog.querySelectorAll('.dialog-close, .dialog-done').forEach((button) => {
  button.addEventListener('click', () => dialog.close());
});

dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

document.querySelector('#year').textContent = new Date().getFullYear();

'use strict';

const news = document.querySelector('.news');
const form = document.querySelector('.send-new-form');
const formReg = document.querySelector('.register-form');
const popup = document.querySelector('.popup');
const popupTitle = document.querySelector('.popup__title');
const wrapp = document.querySelector('.wrapp')

let yourName = '';

const request = (async (url, method = 'GET', body = null, headers = {
  'Content-Type': 'application/json'
}) => {

  try {
    const response = await fetch(url, {
      method,
      body,
      headers
    });

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (e) {
    throw e;
  }
});

formReg.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(formReg);

  const object = {};
  data.forEach(function (value, key) {
    object[key] = value;
  });
  

  // request(`https://zxsas-46ecd-default-rtdb.firebaseio.com/login.json`, 'POST', JSON.stringify(object))

  request(`https://zxsas-46ecd-default-rtdb.firebaseio.com/login.json`)
  .then(res => {

    
    Object.values(res).some(({pass, name}) => {
      if (object.pass === pass) { object.name = name; }
    }); 

    if(object.name) {
      renderItems();
      popup.style.display = 'none';
      wrapp.classList.remove('wrapp-m');
      yourName = Object.values(res)[0].name;
    } else {
      popupTitle.textContent = 'мику не обведешь(пароль не верный)'
    }
  })
  .catch(err => popupTitle.textContent = 'произошла ошибка, обнови страницу')
})

function renderItems () {
  request('https://zxsas-46ecd-default-rtdb.firebaseio.com/news.json')
  .then(res => {
    Object.values(res).forEach(({name, text, date}) => {
      const element = document.createElement('li');
      element.innerHTML = `
      <li>
      <div class="news__wrapp">
      <div class="news__header">
      <p class="news__title">${name}</p>
      <span class="date">${date}</span>
      </div>
      <p class="news__text">${text}</p>
      </div>
      </li> 
      `
      news.prepend(element);
    })
  })  
  .catch(err => console.log(err));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  let date = new Date().getFullYear() + ' ' + new Date().getMonth() + ' ' + new Date().getDate();

  const object = {};
  data.forEach(function (value, key) {
    object[key] = value;
  });

  object.id = Math.random();
  object.date = date;
  object.name = yourName;

  console.log(JSON.stringify(object));

  request('https://zxsas-46ecd-default-rtdb.firebaseio.com/news.json', 'POST', JSON.stringify(object))
    .then(res => {
      const element = document.createElement('li');
      element.innerHTML = `
        <li>
          <div class="news__wrapp news-anim">
            <div class="news__header">
              <p class="news__title">${object.name}</p>
              <span class="date">${object.date}</span>
            </div>
            <p class="news__text">${object.text}</p>
          </div>
        </li> 
      `
      news.prepend(element);
    })
})




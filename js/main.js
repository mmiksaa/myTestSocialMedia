'use strict';

const news = document.querySelector('.news');
const form = document.querySelector('.send-new-form');
const inputSend = document.querySelector('.form__textarea');
const formLog = document.querySelector('.login__form');
const popup = document.querySelector('.popup');
const logTitle = document.querySelector('.login__title');
const wrapp = document.querySelector('.wrapp')
const btnLeave = document.querySelector('.btn-leave');

const settings = document.querySelector('.settings');
const btnSettings = document.querySelector('.form__nickname');
const formSettings = document.querySelector('.settings__form');
const titlteSettings = document.querySelector('.settings__title');

const profile = {
  name: '',
  nickname: '',
  pass: '',
  id: ''
}

try {
  const localdata = localStorage.getItem('login').split(',');
  profile.name = localdata[0];
  profile.nickname = localdata[1];
  profile.pass = localdata[2];
  profile.id = localdata[3];
}catch(e){}



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

if (!profile.name) {
  formLog.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(formLog);

    const object = {};
    data.forEach(function (value, key) {
      object[key] = value;
    });


    // request(`https://zxsas-46ecd-default-rtdb.firebaseio.com/login.json`, 'POST', JSON.stringify(object))

    request(`https://zxsas-46ecd-default-rtdb.firebaseio.com/login.json`)
      .then(res => {

        // Object.keys(res)[3]

        Object.values(res).some(({pass, name, nickname}, i) => {
          if (object.pass === pass) {
            profile.name = name;
            profile.nickname = nickname ? nickname : name;
            profile.pass = pass;
            profile.id = Object.keys(res)[i];
            return;
          }
        });

        if (profile.name) {
          renderItems();
          popup.style.display = 'none';
          wrapp.classList.remove('wrapp-m');
          localStorage.setItem('login', [profile.name, profile.nickname, profile.pass, profile.id]);
        } else {
          logTitle.textContent = 'мику не обведешь(пароль не верный)'
        }

      })
      .catch(err => logTitle.textContent = 'произошла ошибка, обнови страницу')
  })
}else {
  renderItems();
  popup.style.display = 'none';
  wrapp.classList.remove('wrapp-m');
}


function renderItems () {
  request('https://zxsas-46ecd-default-rtdb.firebaseio.com/news.json')
  .then(res => {
    Object.values(res).forEach(({name, text, date, nickname}) => {

      if(!nickname) {
        nickname = name;
      }

      const element = document.createElement('li');
      element.innerHTML = `
      <li>
          <div class="news__wrapp">
            <div class="news__header">
              <div class="news__header-wrapp">
                <p class="news__title">${nickname}</p>
                <span class="news__name">${name}</span>
              </div>
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
  object.nickname = profile.nickname;
  object.name = profile.name;

  request('https://zxsas-46ecd-default-rtdb.firebaseio.com/news.json', 'POST', JSON.stringify(object))
    .then(res => {
      inputSend.value = ``;
      const element = document.createElement('li');
      element.innerHTML = `
        <li>
          <div class="news__wrapp news-anim">
            <div class="news__header">
              <div class="news__header-wrapp">
                <p class="news__title">${object.nickname}</p>
                <span class="news__name">${object.name}</span>
              </div>
              <span class="date">${object.date}</span>
            </div>
            <p class="news__text">${object.text}</p>
          </div>
        </li>
      `
      news.prepend(element);
    })
})

btnLeave.addEventListener('click', () => {
  localStorage.removeItem('login');
  location.reload();
});

btnSettings.addEventListener('click', () => {
  settings.style.display = 'block';
  wrapp.classList.add('wrapp-m');
  document.querySelector('.settings__input').value = profile.nickname;
});

formSettings.addEventListener('submit', (e) => {
  e.preventDefault();


  profile.nickname = document.querySelector('.settings__input').value;
  console.log(profile.nickname);
  if (profile.name.length < 11) {
    request(`https://zxsas-46ecd-default-rtdb.firebaseio.com/login/${profile.id}.json`, 'PUT', JSON.stringify(profile))
      .then(res => {
        settings.style.display = 'none';
        wrapp.classList.remove('wrapp-m');
      })
      .catch(e => titlteSettings.textContent = 'что-то пошло не так, перезагрузи страницу');
  }else {
    titlteSettings.textContent = 'длинный ник'
  }

  
});

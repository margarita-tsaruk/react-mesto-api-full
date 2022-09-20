import { config } from './config.js'

class Api {
  constructor({url, token}) {
    this.url = url;
    this.token = token;
  }
  
  //Объявление приватного метода: получение ответа от сервера
  _getServerResponse(res) {
    if(res.ok) { 
      return res.json(); 
    } else { 
      return Promise.reject(`Ошибка: ${res.status}`); 
    } 
  } 
  
  //Объявление публичного метода: отправить запрос серверу - загрузить карточки
  getInitialCards() {
    return fetch (`${this.url}/cards`, {
      method: 'GET',
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json'
      }
    })
    .then(this._getServerResponse)
  }
  
  //Объявление публичного метода: отправить запрос серверу - загрузить информацию о пользователе
  getUserInfo() {
    return fetch (`${this.url}/users/me`, {
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json'
      },
    })
    .then(this._getServerResponse)
  }
  
  //Объявление публичного метода: выполнять загрузку всех данных
  getData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
  }

  //Объявление публичного метода: отправить запрос серверу на обновление данных профиля пользователя
  setUserInfo(name, about) {
    return fetch (`${this.url}/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
        name: name,
        about: about
      })
    })
    .then((res) => {
      return this._getServerResponse(res)
    })
  }
  
  //Объявление публичного метода: отправить запрос серверу на добавление новой карточки
  addCard(cardData) {
    return fetch (`${this.url}/cards`, {
      method: 'POST',
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
        name: cardData.name,
        link: cardData.link
        })
    })
    .then((res) => {
      return this._getServerResponse(res)
    })
  }
  
  //Объявление публичного метода: отправить запрос серверу на удаление своей карточки
  deleteCard(card) {
    return fetch (`${this.url}/cards/${card._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.token,
        'Content-Type': 'application/json'
      },
    })
    .then((res) => {
      return this._getServerResponse(res)
    })
  }
   
  //Объявление публичного метода: отправить запрос серверу - поставить лайк карточки
  changeLikeCardStatus(card, isLiked) {
    if(isLiked) {
      return fetch (`${this.url}/cards/${card._id}/likes`, {
        method: 'PUT',
        headers: {
          Authorization: this.token,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        return this._getServerResponse(res)
      })
    } else {
      return fetch (`${this.url}/cards/${card._id}/likes`, {
        method: 'DELETE',
          headers: {
            Authorization: this.token,
            'Content-Type': 'application/json'
          }
      })
      .then((res) => {
        return this._getServerResponse(res)
      })
     }
  }

  //Объявление публичного метода: отправить запрос - обновить аватар
  setUserAvatar(link) {
    return fetch (`${this.url}/users/me/avatar`, {
      headers: {
          Authorization: this.token,
          'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify ({
        avatar: link,
      })
    })
    .then((res) => {
      return this._getServerResponse(res)
    })
  }
}

const api = new Api(config)
  
export default api;
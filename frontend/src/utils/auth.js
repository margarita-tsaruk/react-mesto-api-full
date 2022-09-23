class Auth {
  constructor({url, headers}) {
    this.url = url;
    this.headers = headers;
  }
  
  _getServerResponse(res) {
    if(res.ok) { 
      return res.json(); 
    } else { 
      return Promise.reject(`Ошибка: ${res.status} ${res.statusText}`); 
    } 
  }
  
  register(userData) {
    return fetch(`${this.url}/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        password: userData.password,
        email: userData.email
      })
    })
    .then(this._getServerResponse)
  }
  
  authorize(userData) {
    return fetch(`${this.url}/signin`, {
      method: 'POST',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify({
        password: userData.password,
        email: userData.email
      })
    })
    .then(this._getServerResponse);
  }
  
  getToken(token) {
    return fetch(`${this.url}/users/me`, {
      method: 'GET',
      headers: this.headers,
      credentials: 'include',
    })
    .then(this._getServerResponse);
  }

  logOut() {
    return fetch(`${this.url}/signout`, {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'include',
    })
    .then(this._getServerResponse)
  }
}

const auth = new Auth({
  url: 'https://api.margarita-tsaruk.nomoredomains.sbs',
  headers: {
    'Content-Type': 'application/json'
  }
})
  
export default auth;
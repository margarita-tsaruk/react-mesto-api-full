import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { Route, Switch, useHistory } from 'react-router-dom';

import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ConfirmationPopup from './ConfirmationPopup.js';
import api from '../utils/api.js';
import Register from './Register.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';
import auth from '../utils/auth.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const isPopupOpened = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isImagePopupOpen || isConfirmationPopupOpen

  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();
  
  function handleCheckToken() {
    const jwt = localStorage.getItem('jwt');
    if(!jwt) {
      return
    }
    
    auth.getToken(jwt)
      .then((data) => {
        if(data) {
          setIsLoggedIn(true);
          setUserEmail(data.data.email);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('jwt');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  } 

  useEffect(() => {
    handleCheckToken()
  }, [])

  useEffect(() => {
    if(isLoggedIn) {
      history.push('/');
    }
  }, [history, isLoggedIn])

  useEffect(() => {
    if(isLoggedIn) {
      api.getData()
      .then(([userData, cardsData]) => {
        setCurrentUser(userData)
        setCards(cardsData)
      })
      .catch((err) => {
        console.log(err);
      })
    } 
  }, [isLoggedIn])

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleTrashButtonClick(card) {
    setSelectedCard(card);
    setIsConfirmationPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleInfoTooltip() {
    setIsInfoTooltipPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isPopupOpened) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isPopupOpened]) 

  function handleUpdateUser(value) {
    api.setUserInfo(value.name, value.about)
      .then((res) => {
        setCurrentUser(prevState => {
          return {
            ...prevState,
            name: res.name,
            about: res.about,
          }
        })
        
        closeAllPopups();

      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar(inputValue) {
    api.setUserAvatar(inputValue.avatar)
      .then((res) => {
        setCurrentUser(prevState => {
          return {
            ...prevState,
            avatar: res.avatar
          }
        })
        
        closeAllPopups();

      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(card, !isLiked) 
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleCardDelete(card) {
    api.deleteCard(card)
      .then(() => {
        closeAllPopups()
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddPlace(card) {
    api.addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  function handleAuthorization(userData) {
    auth.authorize(userData)
      .then((userData) => {
        if(userData.token) {
          localStorage.setItem('jwt', userData.token);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          handleInfoTooltip();
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false);
        handleInfoTooltip();
      })
  }

  function handleRegistration(userData) {
    auth.register(userData)
    .then((data) => {
      if(data) {
        setTimeout(()=> handleAuthorization(userData), 300); //Пришлось добавить setTimeout тк сервер падает из-за частых запросов
        handleInfoTooltip();
        setUserEmail(data.data.email);
      } else {
        handleInfoTooltip();
      }
    })
    .catch((err) => {
      console.log(err);
      setIsLoggedIn(false);
      handleInfoTooltip();
    })
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header 
         isLoggedIn={isLoggedIn}
         userEmail={userEmail}
         onSignOut={handleSignOut}
        />
        <Switch>  
          <Route path="/sign-up">
            <div className="auth">
              <Register 
                onSignedUp={handleRegistration}
              />
            </div>
          </Route>
          <Route path="/sign-in">
            <div className="auth">
              <Login 
                onSignedIn={handleAuthorization}
              />
            </div>
          </Route>
          <ProtectedRoute
            exact path="/"
            isLoggedIn={isLoggedIn}
            component={Main} 
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onConfirmation={handleTrashButtonClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          /> 
        </Switch> 
        <Footer />
        <EditProfilePopup
          isPopupOpened={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup 
          isPopupOpened={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />
        <EditAvatarPopup
          isPopupOpened={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} 
        />
        <ImagePopup 
          isPopupOpened={isImagePopupOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <ConfirmationPopup 
          isPopupOpened={isConfirmationPopupOpen}
          onClose={closeAllPopups}
          card={selectedCard}
          setSelectedCard={setSelectedCard}
          onDeleteCard={handleCardDelete} 
        />
        <InfoTooltip
          isPopupOpened={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isLoggedIn={isLoggedIn}
        />
       </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

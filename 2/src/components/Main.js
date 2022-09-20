import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

import Card from './Card.js';

function Main( {onEditProfile, onAddPlace, onEditAvatar, onConfirmation, cards, onCardClick, onCardLike, onCardDelete} ) {
  const currentUser = useContext(CurrentUserContext);
 
  const cardsElements = cards.map((card) => {
    return (
      <Card
        key={card._id}
        card={card}
        onCardClick={onCardClick}
        onCardLike={onCardLike}
        onCardDelete={onCardDelete}
        onConfirmation={onConfirmation}
      />
    )
  })
  
  return (
    <div className="content">
      <section className="profile">
        <div className="profile__avatar"
          onClick={onEditAvatar}
          style={{ backgroundImage: `url(${currentUser.avatar})` }}
        >
        </div>
        <div className="profile__info">
          <div className="profile__line">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button 
              type="button" 
              className="profile__edit-button" 
              onClick={onEditProfile}
            >
            </button>
          </div>
            <p className="profile__job">{currentUser.about}</p>
        </div>
        <button 
          type="button" 
          className="profile__add-button" 
          onClick={onAddPlace}>
        </button>
      </section>
      <section className="cards">
        <div className="cards__container">
          {cardsElements}
        </div>
      </section>
    </div>
  )
}

export default Main;
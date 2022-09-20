import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'

function Card( {card, onCardClick, onCardLike, onConfirmation} ) {
  function handleImageClick() {
    onCardClick(card)
  }

  function handleLikeClick() {
    onCardLike(card)
  }

  function handleDeleteClick() {
    onConfirmation(card)
  }
  
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `card__trash-button ${isOwn ? 'card__trash-button' : 'card__trash-button_hidden'}`
  );

  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = (
    `card__like-button ${isLiked ? 'card__like-button_active' : 'card__like-button'}`
  );

  return (
    <div className="card">
      <img 
        src={card.link} 
        alt={card.name} 
        className="card__image"
        onClick={handleImageClick}
      />
      <h3 className="card__title">{card.name}</h3>
      <button 
        type="button" 
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      >
      </button>
      <div className="card__like-container">
        <button 
          type="button" 
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        > 
        </button>
        <p className="card__like-quantity">{card.likes.length}</p>
      </div>
    </div>
  );
}

export default Card;

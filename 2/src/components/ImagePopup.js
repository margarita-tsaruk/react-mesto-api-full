function ImagePopup( {isPopupOpened, card, onClose} ) {
  const cardName = card && card.name;

  return (
    <div 
      className={`popup popup_open_image ${isPopupOpened && 'popup_visible'}`}
    >
      <div className="popup__cover">
        <button 
          className="popup__close-button" 
          type="button"
          onClick={onClose}
        >
        </button>
        <figure className="popup__image-container">
        <img 
          className="popup__image"  
          alt={cardName}
          src={card && card.link}
        />
          <figcaption className="popup__caption">{cardName}</figcaption>
        </figure>
      </div>
    </div>
  )
}
  
export default ImagePopup;
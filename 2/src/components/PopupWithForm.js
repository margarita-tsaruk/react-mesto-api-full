function PopupWithForm( {name, title, type, button, isPopupOpened, onClose, onSubmit, children, isDisabled} ) {

  return (
    <div className={`popup popup_type_${name} ${isPopupOpened && 'popup_visible'}`}>
      <div className={`popup__content popup__content_${type}`}>
        <button 
          className="popup__close-button" 
          type="button"
          onClick={onClose}
        >
        </button>
        <h3 className={`popup__title popup__title_${type}`}>{title}</h3>
        <form  
          className={`popup__form popup__form_${type}`}
          name={`${name}-form`} 
          onSubmit={onSubmit}
        >
          {children}
          <button 
            type="submit" 
            className={`popup__button popup__button_${type} ${!isDisabled && 'popup__button_disabled'}`}
            disabled={!isDisabled}
          >{`${button}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;
import LoggedIn from '../images/LoggedIn.svg';
import NotLoggedIn from '../images/NotLoggedIn.svg';

function InfoTooltip( {isPopupOpened, onClose, isLoggedIn} ) {
    
  return (
    <div className={`popup popup_type_info ${isPopupOpened && 'popup_visible'}`}>
      <div className={`popup__content popup__content_info`}>
        <button 
          className="popup__close-button" 
          type="button"
          onClick={onClose}
        >
        </button>
        <img
          className="popup__registration-image"
          src={isLoggedIn ? LoggedIn : NotLoggedIn}
          alt={isLoggedIn ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
        />
        <h3 
          className="popup__title popup__title_info">
          {isLoggedIn ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h3>
      </div>
    </div>
  )
}
  
export default InfoTooltip;
  
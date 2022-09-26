import { useEffect } from 'react';
import { useForm } from '../hooks/useForm.js';

import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup( {isPopupOpened, onClose, onAddPlace} ) {
  const { values, setValues, handleChange, errors, isValid, resetErrors } = useForm({});

  function handleSubmit(event) {
    event.preventDefault();
    
    onAddPlace({...values});
  }

  useEffect(() => {
    if(isPopupOpened) {
      setValues({});
      resetErrors();
    }
  }, [isPopupOpened]);

  return (
    <PopupWithForm
      name="place"
      title="Новое место" 
      button="Сохранить"
      isPopupOpened={isPopupOpened}
      onClose={onClose}
      onSubmit={handleSubmit}
      isDisabled={isValid}
    >
      <input
        id="title-input"
        type="text"
        name="name"
        className={`popup__input popup__input_type_title ${errors.name && 'popup__input_type_invalid'}`}
        placeholder="Название"
        minLength="2"
        maxLength="30"
        required
        value={values.name || ''}
        onChange={handleChange}
      />
        <span 
          className="popup__error popup__error_top" 
          id="title-input-error">
            {!isValid && errors.name}
        </span>
        <input
          id="link-input"
          type="url"
          name="link"
          className={`popup__input popup__input_type_link ${errors.link && 'popup__input_type_invalid'}`}
          placeholder="Ссылка на картинку"
          required
          value={values.link || ''}
          onChange={handleChange}
        />
        <span 
          className="popup__error popup__error_bottom" 
          id="link-input-error">
            {!isValid && errors.link}
        </span>  
    </PopupWithForm>
  )
}

export default AddPlacePopup;
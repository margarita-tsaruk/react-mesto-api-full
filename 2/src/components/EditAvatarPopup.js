import { useEffect } from 'react';
import { useForm } from '../hooks/useForm.js';

import PopupWithForm from './PopupWithForm';

function EditAvatarPopup( {isPopupOpened, onClose, onUpdateAvatar} ) {
  const { values, setValues, handleChange, errors, isValid, resetErrors } = useForm({});
 
  function handleSubmit(event) {
    event.preventDefault();

    onUpdateAvatar({
      avatar: values.link,
    });
  }

  useEffect(() => {
    if(isPopupOpened) {
      setValues({});
      resetErrors();
    }
  }, [isPopupOpened]);

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар" 
      type="modified"
      button="Сохранить"
      isPopupOpened={isPopupOpened}
      onClose={onClose}
      onSubmit={handleSubmit}
      isDisabled={isValid}
    >
      <input
        id="link-avatar"
        type="url"
        name="link"
        className="popup__input popup__input_type_link"
        placeholder="Ссылка на изображение"
        required
        value={values.link || ''}
        onChange={handleChange}
      />
      <span 
        className="popup__error popup__error_top" 
        id="link-avatar-error">
          {!isValid && errors.link}
      </span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
import { useForm } from '../hooks/useForm.js';
import { Link } from 'react-router-dom';

function Register( {onSignedUp} ) {
  const { values, handleChange, errors, isValid, resetErrors } = useForm({});
    
  function handleSubmit(event) {
    event.preventDefault();
        
    onSignedUp({...values});

    resetErrors();
  }
  
  return (
    <form  
      className="auth__form"
      onSubmit={handleSubmit}
    >
      <h3 className="auth__title">Регистрация</h3>
      <input
        id="name-input"
        type="email"
        name="email"
        className={`auth__input ${errors.email && 'auth__input_type_invalid'}`}
        placeholder="Email"
        minLength="2"
        maxLength="40"
        required
        value={values.email || ''}
        onChange={handleChange}
      />
      <span className="auth__error auth__error_top" id="input-email-error">
        {!isValid && errors.email}
      </span>
      <input
        id="password-input"
        type="password"
        name="password"
        className={`auth__input ${errors.password && 'auth__input_type_invalid'}`}
        placeholder="Пароль"
        minLength="2"
        maxLength="40"
        required
        value={values.password || ''}
        onChange={handleChange}
      />
      <span className="auth__error auth__error_bottom" id="input-password-error">
        {!isValid && errors.password}
      </span>
      <button 
        type="submit" 
        className="auth__button"
      >
        Зарегистрироваться   
      </button>
      <p className="auth__paragraph">
        Уже зарегистрированы?
        <Link className="auth__link" to="/sign-in"> Войти</Link>
      </p>
    </form> 
  );
}
  
export default Register;
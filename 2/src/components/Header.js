import { Switch, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import headerLogo from '../images/logo.svg'

function Header( {isLoggedIn, userEmail, onSignOut} ) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  
  function showMenu() {
    setIsOpenMenu(!isOpenMenu)
  }
  
  function signOut() {
    setIsOpenMenu(false);
    onSignOut();
  }
  
  return (
    <header className={!isOpenMenu ? 'header' : 'header header__menu'}>
      <div className="header__container">
        <img className="header__logo" src={headerLogo} alt="Лого" /> 
        <button 
          className={`${!isOpenMenu ? 'header__menu-button' : `header__menu-button header__menu-button_close`}
          ${!isLoggedIn && 'header__menu-button_signedout'}`}
          onClick={showMenu}
        >
        </button>
      </div>
      <Switch>
        <Route path="/sign-in">
          <div className={`${!isLoggedIn && 'header__link header__link_hover'}`}>
            <nav>
              <Link
                className='header__link'
                to="/sign-up"
              >
                Регистрация
              </Link>
            </nav>
          </div>
        </Route>
        <Route path="/sign-up">
          <div className={`${!isLoggedIn && 'header__link header__link_hover'}`}>
            <nav>
              <Link
                className='header__link'
                to="/sign-in"
              >
                Войти
              </Link>
            </nav>
          </div>
        </Route>
        <Route exact path="/">
          <div className={!isOpenMenu ? 'header__signedIn-details' : 'header__signedIn-details header__signedIn-details_show'}>
            <p className='header__email'>{userEmail}</p>
            <button
              className='header__sign-out-button'
              onClick={signOut}
            >
              Выйти
            </button>
          </div>
        </Route>
      </Switch>
    </header>
  );
}

export default Header;
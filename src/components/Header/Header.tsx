import styles from './header.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { NavBar } from 'components/NavBar';
import { SearchComponent } from 'components/SearchComponent';
import { SwitchLanguageHeader } from 'components/SwitchLanguageHeader';
import { ReactComponent as Logo } from 'img/icons/Logo.svg';
import { ReactComponent as Menus } from 'img/icons/burger-menu.svg';
import { ReactComponent as Cours } from 'img/icons/cours.svg';
import { ReactComponent as Heart } from 'img/icons/hearts.svg';
import { Theme } from 'components/Theme/Theme';


export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState(false);
  const [isLangSwitcherShow, setIsLangSwitcherShow] = useState(false);
  const [t] = useTranslation('global');

  const favourItes = useSelector(
    (state: RootState) => state.product.favourites,
  );
  const favoritesCount = favourItes.length;

  const cartItes = useSelector((state: RootState) => state.product.cart);
  const cartCount = cartItes.length;

  const toggleMenu = () => {
    setIsMenuShow(!isMenuShow);
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(styles.header__nav_link, { [styles.is_active]: isActive });

  const { pathname } = useLocation();
  const isShowSearch =
    pathname === '/tablets' ||
    pathname === '/accessories' ||
    pathname === '/phones';

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setIsLangSwitcherShow(true);
    }
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          <div>
            <Link to="/" aria-label="Nice gadgets logo">
              <Logo className={styles.header__img} />
            </Link>
          </div>
        </div>

        <nav data-cy="nav" className="navbar">
          <div className={styles.header__navbar}>
            <NavLink className={getLinkClass} to="/">
              {t('header.home')}
            </NavLink>

            <NavLink className={getLinkClass} to="/phones">
              {t('header.phones')}
            </NavLink>

            <NavLink className={getLinkClass} to="/tablets">
              {t('header.tablets')}
            </NavLink>

            <NavLink className={getLinkClass} to="/accessories">
              {t('header.accessories')}
            </NavLink>
          </div>
        </nav>
      </div>

      <div className={styles.right_side}>
        <div className={styles.language_switcher}>
          {isLangSwitcherShow && <SwitchLanguageHeader />}
        </div>
        {isShowSearch && <SearchComponent />}

        <div className={styles.theme}>
          <Theme />
        </div>

        <NavLink
          to="/Favorites"
          className={({ isActive }) =>
            classNames(styles.favorites, { [styles.is_active]: isActive })
          }
        >
          <div className={styles.favoritesIconContainer}>
            <Heart className={styles.favorites__logo} />

            {favoritesCount > 0 && (
              <div className={styles.favoritesItemCount}>{favoritesCount}</div>
            )}
          </div>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            classNames(styles.cart, { [styles.is_active]: isActive })
          }
        >
          <div className={styles.cartIconContainer}>
            <Cours className={styles.cart__logo} />
            {cartCount > 0 && (
              <div className={styles.cartItemCount}>{cartCount}</div>
            )}
          </div>
        </NavLink>

        <button className={styles.menus} onClick={toggleMenu}>
          <Menus className={styles.menus__logo} />
        </button>

        {isMenuShow && (
          <div className={styles.navBarWrapper}>
            <NavBar onClose={toggleMenu} />
          </div>
        )}
      </div>
    </div>
  );
};

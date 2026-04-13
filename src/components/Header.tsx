import { NavLink, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Inicio', fin: true },
  { to: '/about', label: 'Acerca de', fin: false },
];

function getIconLabel(tema: 'light' | 'dark'): { icon: string; label: string } {
  return tema === 'light'
    ? { icon: '', label: 'Modo oscuro' }
    : { icon: '', label: 'Modo claro' };
}

function buildNavItem(itemData: { to: string; label: string; fin: boolean }, idx: number) {
  return (
    <li key={idx} className="site-nav__item">
      <NavLink
        to={itemData.to}
        end={itemData.fin}
        className={({ isActive }) =>
          isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
        }
      >
        {itemData.label}
      </NavLink>
    </li>
  );
}

export function Header() {
  const { currentThemeMode, toggleThemeMode } = useThemeContext();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const iconInfo = getIconLabel(currentThemeMode);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <span className="site-header__brand-icon" aria-hidden="true"></span>
          <h1 className="site-header__brand-name">JULibrary</h1>
        </div>

        <nav className="site-nav" aria-label="Navegación principal">
          <ul className="site-nav__list">
            {navLinks.map(buildNavItem)}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            className="theme-toggle-button"
            onClick={toggleThemeMode}
            aria-label={`Cambiar a ${iconInfo.label}`}
          >
            <span className="theme-toggle-button__icon" aria-hidden="true">
              {iconInfo.icon}
            </span>
            <span className="theme-toggle-button__label">{iconInfo.label}</span>
          </button>
          {token && (
            <button
              className="logout-button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

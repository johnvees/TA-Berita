import React from 'react';
import Button from '../elements/Button';
import BrandIcon from './BrandIcon';

export default function Header(props) {
  const getNavLinkClass = (path) => {
    return props.location.pathname === path ? ' active' : '';
  };

  return (
    <header className="spacing-sm">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <BrandIcon />
        </nav>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item${getNavLinkClass('/')}`}>
              <Button className="nav-link" type="link" href="/">
                Beranda
              </Button>
            </li>
            <li className={`nav-item${getNavLinkClass('/pencarian')}`}>
              <Button className="nav-link" type="link" href="/pencarian">
                Pencarian
              </Button>
            </li>
            <li className={`nav-item${getNavLinkClass('/tentang')}`}>
              <Button className="nav-link" type="link" href="/tentang">
                Tentang
              </Button>
            </li>
          </ul>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <div className="dropdown-menu">
              <Button
                className={`dropdown-item${getNavLinkClass('/history')}`}
                type="link"
                href="/history"
              >
                History
              </Button>
              <Button
                className={`dropdown-item${getNavLinkClass('/logout')}`}
                type="link"
                href="/logout"
              >
                Logout
              </Button>
            </div>
          </li>
        </div>
      </div>
    </header>
  );
}

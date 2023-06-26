import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../elements/Button';
import BrandIcon from './BrandIcon';

export default function Header() {
  const location = useLocation();
  const getNavLinkClass = (path) => {
    return location.pathname === path ? ' active' : '';
  };

  return (
    <header className="spacing-sm">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light">
          <BrandIcon />
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
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

            {/* dipakai ketika belum melakukan login */}
            {/* <Button className="btn btn-login" type="link" href="/auth">
              Masuk / Daftar
            </Button> */}

            {/* dipakai ketika telah melakukan login */}
            {/* <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                role="button"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                John Doe
              </a>

              <div className="dropdown-menu">
                <Button className="dropdown-item" type="link" href="/history">
                  History
                </Button>
                <Button className="dropdown-item" type="link" href="/logout">
                  Logout
                </Button>
              </div>
            </div> */}
          </div>
        </nav>
      </div>
    </header>
  );
}

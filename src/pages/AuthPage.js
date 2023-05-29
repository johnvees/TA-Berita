import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../elements/Button';
import BrandLogo from '../assets/images/brandlogo.png';
import ILLogin from '../assets/images/loginimg.png';
import ILRegister from '../assets/images/registerimg.png';

export default function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameWarning, setUsernameWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (event.target.value.length === 0) {
      setUsernameWarning(true);
    } else {
      setUsernameWarning(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length === 0 || event.target.value.length < 8) {
      setPasswordWarning(true);
    } else {
      setPasswordWarning(false);
    }
  };

  const handleLogin = () => {
    let hasError = false;

    if (username.length === 0) {
      setUsernameWarning(true);
      hasError = true;
    }

    if (password.length === 0 || password.length < 8) {
      setPasswordWarning(true);
      hasError = true;
    }

    if (!hasError) {
      // Here, you can implement your login logic
      // For example, you can send the username and password to a server for authentication
      console.log('Username:', username);
      console.log('Password:', password);

      // Navigate to another page (e.g., '/dashboard') after successful login
      navigate('/');
    }
  };

  const isDisabled =
    username.length === 0 || password.length === 0 || password.length < 8;

  return (
    <section className="container-fluid">
      <div className="row align-items-center">
        <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5 ">
          <div className="input-content">
            <div className="login-content-logo">
              <div
                className="col-sm-6 col-md-6 col-lg-6 col-xl-6"
                style={{ padding: 0 }}
              >
                <Button type="link" href="/">
                  <img src={BrandLogo} alt="" style={{ width: '100%' }} />
                </Button>
              </div>
              <div className="col-auto"></div>
            </div>
            <div className="login-content-input">
              <h2>Selamat Datang Kembali!</h2>
              <p>Silangkah lengkapi data diri anda di bawah ini.</p>

              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Username
                  </span>
                </div>
                <input
                  className={`form-control ${
                    usernameWarning ? 'input-warning' : ''
                  }`}
                  type="text"
                  placeholder="contoh123"
                  value={username}
                  onChange={handleUsernameChange}
                  aria-label="username-login"
                  aria-describedby="basic-addon1"
                />
              </div>
              {usernameWarning && username.length === 0 && (
                <p className="warning">
                  Tolong masukkan username Anda dengan benar
                </p>
              )}
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Password
                  </span>
                </div>
                <input
                  className={`form-control ${
                    passwordWarning ? 'input-warning' : ''
                  }`}
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-label="password-login"
                  aria-describedby="basic-addon1"
                />
              </div>
              {passwordWarning && password.length === 0 && (
                <p className="warning">
                  Tolong masukkan password Anda dengan benar
                </p>
              )}
              {passwordWarning &&
                password.length > 0 &&
                password.length < 8 && (
                  <p className="warning">
                    Tolong masukkan password dengan minimal 8 karakter
                  </p>
                )}
              <Button
                className={`btn btn-auth-login ${isDisabled ? 'disabled' : ''}`}
                onClick={handleLogin}
                disabled={isDisabled}
              >
                Masuk
              </Button>
              <Button className="link-auth-login" type="link" onClick={onclick}>
                Belum memiliki akun? Daftar disini
              </Button>
              <div className="link-auth-back-wrapper">
                <Button className="link-auth-back" type="link" href="/">
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-7 col-md-7 col-lg-7 col-xl-7 d-none d-sm-block">
          <div className="image-content">
            <img className="image-content image" src={ILLogin} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /* <div className="col-sm-7 col-md-7 col-lg-7 col-xl-7 d-none d-sm-block">
          <div className="image-content">
            <img className="image-content image" src={ILRegister} alt="" />
          </div>
        </div>

        <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5">
          <div className="input-content">
            <div className="register-content-logo">
              <div className="col-auto"></div>
              <div
                className="col-sm-6 col-md-6 col-lg-6 col-xl-6 ml-auto"
                style={{ padding: 0 }}
              >
                <Button type="link" href="/">
                  <img src={BrandLogo} alt="" style={{ width: '100%' }} />
                </Button>
              </div>
            </div>
            <div className="register-content-input">
              <h2>Daftarkan Akun Baru</h2>
              <p>Silangkah lengkapi data diri anda di bawah ini.</p>

              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="contoh nama"
                  aria-label="fullname-register"
                  aria-describedby="basic-addon1"
                />
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Nama Lengkap
                  </span>
                </div>
              </div>

              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="contoh123"
                  aria-label="username-register"
                  aria-describedby="basic-addon1"
                />
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Username
                  </span>
                </div>
              </div>
              <div className="input-group">
                <input
                  className="form-control"
                  type="password"
                  placeholder="********"
                  aria-label="password-register"
                  aria-describedby="basic-addon1"
                />
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Password
                  </span>
                </div>
              </div>
              <Button className="btn btn-auth">Masuk</Button>
              <Button className="link-auth" type="link" onClick={onclick}>
                Belum memiliki akun? Daftar disini
              </Button>
              <div className="link-auth-back-wrapper">
                <Button className="link-auth-back" type="link" href="/">
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        </div> */
}

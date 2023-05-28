import React from 'react';
import Button from '../elements/Button';
import BrandLogo from '../assets/images/brandlogo.png';
import ILLogin from '../assets/images/loginimg.png';
import ILRegister from '../assets/images/registerimg.png';

export default function AuthPage() {
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
                  className="form-control"
                  type="text"
                  placeholder="contoh123"
                  aria-label="username-login"
                  aria-describedby="basic-addon1"
                />
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Password
                  </span>
                </div>
                <input
                  className="form-control"
                  type="password"
                  placeholder="********"
                  aria-label="password-login"
                  aria-describedby="basic-addon1"
                />
              </div>
              <Button className="btn btn-auth-login">Masuk</Button>
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

{/* <div className="col-sm-7 col-md-7 col-lg-7 col-xl-7 d-none d-sm-block">
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
        </div> */}

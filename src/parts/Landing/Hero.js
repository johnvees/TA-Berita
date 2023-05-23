import React from 'react';
import Button from '../../elements/Button';

export default function Hero() {
  return (
    <section className="container-fluid">
      <div className="row">
        <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2"></div>
        <div className="hero-landing col-sm-8 col-md-8 col-lg-8 col-xl-8">
          <h1>SISTEM KURATOR BERITA GRATIS UNTUK ANDA</h1>
          <p>
            Saat ini telah banyak berita yang dipublikasikan baik melalui media
            digital maupun cetak. Namun apakah berita yang anda cari selama ini
            sesuai dengan berita yang hendak anda cari? Kami disini hadir untuk
            memastikan berita yang anda baca sesuai dengan yang anda inginkan.{' '}
          </p>

          <div className="row">
            <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2"></div>
            <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8">
              <Button className="btn btn-mulai" type="link" href="/pencarian">
                Mulai Sekarang
              </Button>
            </div>
            <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2"></div>
          </div>
        </div>
        <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2"></div>
      </div>
    </section>
  );
}

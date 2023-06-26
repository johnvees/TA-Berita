import React from 'react';
import Button from '../../elements/Button';

export default function Hero() {
  return (
    <section>
      <div className="hero-landing">
        <div className="title">
          <h1>Sistem Kurator Berita Gratis Untuk Anda</h1>
          <p>
            Saat ini telah banyak berita yang dipublikasikan baik melalui media
            digital maupun cetak. Namun apakah berita yang anda cari selama ini
            sesuai dengan berita yang hendak anda cari? Kami disini hadir untuk
            memastikan berita yang anda baca sesuai dengan yang anda inginkan.{' '}
          </p>
        </div>

        <div className="row">
          <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
          <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <Button className="btn btn-mulai" type="link" href="/pencarian">
              Mulai Sekarang
            </Button>
          </div>
          <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
        </div>
      </div>
    </section>
  );
}

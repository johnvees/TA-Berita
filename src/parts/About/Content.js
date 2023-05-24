import React from 'react';
import ProfileImage from '../../assets/images/profileimg.jpg';

export default function Content() {
  return (
    <section>
      <div className="content-about">
        <div className="first-content">
          <h1>Sistem Kurator Berita Gratis Untuk Anda</h1>
          <p>
            Saat ini telah banyak berita yang dipublikasikan baik melalui media
            digital maupun cetak. Namun apakah berita yang anda cari selama ini
            sesuai dengan berita yang hendak anda cari? Kami disini hadir untuk
            memastikan berita yang anda baca sesuai dengan yang anda inginkan.{' '}
          </p>
        </div>
        <div className="second-content">
          <h3>TUJUAN KAMI</h3>
          <div className="desc">
            <h2>Membantu Memastikan Ketepatan Pencarian Berita Anda</h2>
            <p>
              Website yang anda akses sekarang ini mampu untuk mengukur tingkat
              kemiripan berita berdasarkan kata kunci yang anda ingin temukan,
              disertai dengan topik-topik yang sedang diangkat pada suatu
              berita. Dengan menerapkan salah satu metode text mining yaitu
              Latent Semantic Analysis diharapkan mampu untuk membantu anda
              dalam meminimalisir kesalahan dalam proses perolehan berita yang
              diakibatkan oleh ketidaksesuaian hasil pencarian berita.
            </p>
          </div>
        </div>
        <div className="third-content">
          <h3>DIBENTUK OLEH</h3>
          <div className="desc">
            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <img
                className="rounded-lg"
                src={ProfileImage}
                alt=""
                style={{ width: '100%' }}
              />
            </div>

            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5">
              <h5>Yohanes Velly Sabattino</h5>
              <p>yohanesvelly23@gmail.com</p>
              <p className="desc">
                Website ini dibentuk sebagai tugas akhir dalam menyelesaikan
                studi sarjana program studi sistem informasi.
              </p>
            </div>

            <div className="col-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

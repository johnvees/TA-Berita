import React, { useState } from 'react';
import Button from '../../elements/Button';
import ILPortal from '../../assets/images/portalvector.png';
import ILUrl from '../../assets/images/urlvector.png';
import ILDokumen from '../../assets/images/dokumenvector.png';

export default function Content() {
  const [selectedButton, setSelectedButton] = useState('portal');
  const buttonData = [
    {
      name: 'Portal Berita',
      imageSrc: ILPortal,
      alias: 'portal',
      title: 'Pencarian Dengan Sumber Portal Berita',
      content:
        'Pencarian berita yang dilakukan dibantu dengan sumber berita yang telah disediakan oleh portal-portal berita yang telah ternama di Indonesia seperti liputan6, kompas, CNN, dan berbagai portal berita ternama lainnya.',
    },
    {
      name: 'URL / Link',
      imageSrc: ILUrl,
      alias: 'url',
      title: 'Pencarian Dengan Sumber URL / Link',
      content:
        'Pencarian berita yang dilakukan menggunakan sumber berita yang berasal dari URL / Link yang diketahui oleh masing-masing pengguna dengan tujuan untuk mengukur kemiripan pencarian dengan URL / Link berita.',
    },
    {
      name: 'Dokumen',
      imageSrc: ILDokumen,
      alias: 'dokumen',
      title: 'Pencarian Dengan Sumber Dokumen Yang Dimiliki',
      content:
        'Pencarian berita yang dilakukan menggunakan sumber berita yang berasal dari dokumen yang dimiliki oleh pengguna masing-masing dengan tujuan untuk mengukur kemiripan dokumen dengan pencarian yang diinginkan.',
    },
  ];

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <section>
      <div className="content-landing">
        <div className="title">
          <h2>
            Layanan Kami Untuk Membantu Memastikan Ketepatan Pencarian Berita
            Anda
          </h2>
        </div>

        <div className="row align-items-center" style={{ marginBottom: 70 }}>
          <div className="col-sm-2 col-md-2 col-lg-2 col-xl-3"></div>
          <div className="col-sm-8 col-md-8 col-lg-8 col-xl-6">
            <div className="row align-items-center">
              {buttonData.map((button) => (
                <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                  <Button
                    key={button.name}
                    className={`btn btn-${
                      selectedButton === button.alias ? 'active' : 'deactive'
                    }`}
                    onClick={() => handleButtonClick(button.alias)}
                  >
                    {button.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-2 col-md-2 col-lg-2 col-xl-3"></div>
        </div>

        <div className="row align-items-center">
          <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
            {buttonData.map(
              (button) =>
                selectedButton === button.alias && (
                  <div key={button.name} className="il il-sumber-wrapper">
                    <img
                      className="il il-sumber"
                      src={button.imageSrc}
                      alt={button.name}
                      onLoad={() => {
                        const imageHeight =
                          document.querySelector('.il-sumber').offsetHeight;
                        document.querySelector(
                          '.vertical-line'
                        ).style.height = `${imageHeight + 20}px`;
                      }}
                    />
                  </div>
                )
            )}
          </div>

          <div className="col-auto d-none d-md-block">
            <div className="vertical-line"></div>
          </div>
          <div className="desc col-sm-5 col-md-5 col-lg-5 col-xl-5 align-items-center">
            {buttonData.map(
              (button) =>
                selectedButton === button.alias && (
                  <div key={button.name}>
                    <h4 className="desc title">{button.title}</h4>
                    <p className="desc content">{button.content}</p>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

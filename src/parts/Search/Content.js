import React, { useEffect, useRef } from 'react';
import Button from '../../elements/Button';
import ICVectorDownGray from '../../assets/images/vectordowngray.png';
import ICVectorDownBlue from '../../assets/images/vectordown.png';

export default function Content() {
  const colRef = useRef(null);
  const dividerRef1 = useRef(null);
  const dividerRef2 = useRef(null);

  useEffect(() => {
    const colHeight = colRef.current.offsetHeight;
    dividerRef1.current.style.height = `${colHeight}px`;
    dividerRef2.current.style.height = `${colHeight}px`;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section>
      <div className="hero-search">
        <div className="search-title">
          <h1>Temukan Beritamu Sekarang!</h1>
        </div>

        <div className="col-auto"></div>
        <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 d-none d-md-block">
          <img
            src={ICVectorDownBlue}
            alt=""
            style={{ width: '100%', marginBottom: 24 }}
          />
        </div>
        <div className="col-auto"></div>

        <div className="search-menu-wrapper">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Masukkan Kata Kunci Pencarian Dipisahkan dengan Tanda Baca Koma"
            />

            <div className="input-group-append">
              <Button className="input-group-text" onClick={onclick}>
                Telusuri
              </Button>
            </div>
          </div>

          <div className="search-filter-wrapper">
            <div className="row align-items-center">
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-5 col-xl-5 mb-2">
                <p>Sumber Berita</p>
                <select class="custom-select">
                  <option value="portal berita">Portal Berita</option>
                  <option value="url">URL / Link</option>
                  <option value="dokumen">Dokumen</option>
                </select>
              </div>

              <div className="col-auto d-none d-lg-block">
                <div ref={dividerRef1} className="vertical-divider"></div>
              </div>

              <div
                ref={colRef}
                className="col-xs-4 col-sm-4 col-md-4 col-lg-3 col-xl-3 mb-2"
              >
                <p>Jumlah Berita yang Ditampilkan</p>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="col-auto d-none d-lg-block">
                <div ref={dividerRef2} className="vertical-divider"></div>
              </div>

              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-3 col-xl-3 mb-2">
                <p>Minimum Persentase Kemiripan</p>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="10"
                    max="100"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text persen">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import Button from '../../elements/Button';
import ICVectorDownGray from '../../assets/images/vectordowngray.png';
import ICVectorDownBlue from '../../assets/images/vectordown.png';

export default function Content() {
  const [selectedOption, setSelectedOption] = useState('portal berita');
  const [showResult, setShowResult] = useState(false);
  const colRef = useRef(null);
  const dividerRef1 = useRef(null);
  const dividerRef2 = useRef(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setShowResult(false);
  };

  const handleToggleResultScreen = () => {
    setShowResult(true);
  };

  useEffect(() => {
    const colHeight = colRef.current.offsetHeight;
    dividerRef1.current.style.height = `${colHeight}px`;
    dividerRef2.current.style.height = `${colHeight}px`;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderFilterContent = () => {
    if (selectedOption === 'portal berita') {
      return (
        <>
          <div className="row align-items-center justify-content-center">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-5 col-xl-5 mb-2">
              <p>Sumber Berita</p>
              <select
                className="custom-select"
                value={selectedOption}
                onChange={handleOptionChange}
              >
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
        </>
      );
    } else if (selectedOption === 'url') {
      return (
        <>
          <div className="row align-items-center">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-2">
              <p>Sumber Berita</p>
              <select
                className="custom-select"
                value={selectedOption}
                onChange={handleOptionChange}
              >
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
              className="col-xs-6 col-sm-6 col-md-6 col-lg-5 col-xl-5 mb-2"
            >
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
          <div className="horizontal-divider mt-3"></div>
          <p className="mt-3">Masukkan URL / Link Berita</p>
          <div className="row align-items-center">
            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
              <div className="input-group">
                <input
                  className="form-control mb-2"
                  type="url"
                  placeholder="https://contoh.com"
                />
              </div>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mb-2">
              <Button className="btn btn-add" onClick={onclick}>
                Tambah
              </Button>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              {/* deactive bisa dinyalakan dan tidak */}
              <Button className="btn btn-reset deactive" onClick={onclick}>
                Reset
              </Button>
            </div>
          </div>
          {/* jangan lupa menambahkan warn */}
          {/* jangan lupa menambahkan list berita yang udah di tambah */}
        </>
      );
    } else {
      return (
        <>
          <div className="row align-items-center">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-2">
              <p>Sumber Berita</p>
              <select
                className="custom-select"
                value={selectedOption}
                onChange={handleOptionChange}
              >
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
              className="col-xs-6 col-sm-6 col-md-6 col-lg-5 col-xl-5 mb-2"
            >
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
          <div className="horizontal-divider mt-3"></div>
          <p className="mt-3">Unggah Dokumen Berita</p>
          <div className="row align-items-center">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <input type="file" multiple className="btn btn-add mb-2" />
              {/* <Button className="btn btn-add" onClick={onclick}>
                Tambah
              </Button> */}
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              {/* deactive bisa dinyalakan dan tidak */}
              <Button className="btn btn-reset deactive" onClick={onclick}>
                Reset
              </Button>
            </div>
          </div>
          {/* jangan lupa menambahkan warn */}
          {/* jangan lupa menambahkan list berita yang udah di tambah */}
        </>
      );
    }
  };

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
              placeholder="Masukkan Kata Kunci Pencarian"
            />

            <div className="input-group-append">
              {/* deactive bisa dinyalakan dan tidak */}
              <Button
                className="input-group-text deactive"
                onClick={handleToggleResultScreen}
              >
                Telusuri
              </Button>
            </div>
          </div>

          <div className="search-filter-wrapper">{renderFilterContent()}</div>
        </div>
      </div>

      {showResult && (
        <>
          <div className="result-search">
            <div className="col-auto"></div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 d-none d-md-block mb-3">
              <img src={ICVectorDownBlue} alt="" style={{ width: '100%' }} />
            </div>
            <div className="col-auto"></div>
          </div>
        </>
      )}
    </section>
  );
}

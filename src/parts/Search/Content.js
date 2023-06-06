import React, { useEffect, useRef, useState } from 'react';
import Button from '../../elements/Button';
import ICVectorDownGray from '../../assets/images/vectordowngray.png';
import ICVectorDownBlue from '../../assets/images/vectordown.png';
import ImgExample from '../../assets/images/urlvector.png';

export default function Content() {
  const [vectorDown, setVectorDown] = useState(ICVectorDownBlue);
  const [selectedOption, setSelectedOption] = useState('Portal Berita');
  const [showResult, setShowResult] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [jumlahBerita, setJumlahBerita] = useState('');
  const [nilaiKemiripan, setNilaiKemiripan] = useState('');
  const [url, setURL] = useState('');
  const [urlList, setURLList] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchWarning, setSearchWarning] = useState(false);
  const [jumlahBeritaWarning, setJumlahBeritaWarning] = useState(false);
  const [jumlahBeritaInfo, setJumlahBeritaInfo] = useState(false);
  const [nilaiKemiripanInfo, setNilaiKemiripanInfo] = useState(false);
  const [urlWarning, setUrlWarning] = useState(false);
  const [filesWarning, setFilesWarning] = useState(false);

  const colRef = useRef(null);
  const dividerRef1 = useRef(null);
  const dividerRef2 = useRef(null);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.length === 0) {
      setSearchWarning(true);
    } else {
      setSearchWarning(false);
    }
  };

  const handleJumlahBeritaChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue <= 10) {
      setJumlahBerita(inputValue);
    }

    if (event.target.value.length === 0) {
      setJumlahBeritaWarning(true);
    } else {
      setJumlahBeritaWarning(false);
    }

    if (event.target.value.length !== 0) {
      setJumlahBeritaInfo(true);
    } else {
      setJumlahBeritaInfo(false);
    }
  };

  const handleNilaiKemiripanChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue <= 100) {
      setNilaiKemiripan(inputValue);
    }
    if (event.target.value.length !== 0 || event.target.value.length === 0) {
      setNilaiKemiripanInfo(true);
    } else {
      setNilaiKemiripanInfo(false);
    }
  };

  const handleTambahUrl = () => {
    if (url.trim() !== '') {
      // Store URL in the array
      setURLList((prevURLList) => [...prevURLList, url]);

      // Reset URL input field
      setURL('');
    }
  };

  const handleResetUrl = () => {
    // Clear URL array value
    setURLList([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleResetDokumen = () => {
    // Clear Dokumen array value
    setFiles([]);
  };

  // const calculateDefaultPercentage = () => {};

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setVectorDown(ICVectorDownBlue);
    setJumlahBerita('');
    setNilaiKemiripan('');
    setSearchValue('');
    setURL('');
    setURLList([]);
    setFiles([]);
    setShowResult(false);
    setSearchWarning(false);
    setJumlahBeritaInfo(false);
    setJumlahBeritaWarning(false);
    setNilaiKemiripanInfo(false);
    setUrlWarning(false);
    setFilesWarning(false);
  };

  useEffect(() => {
    if (showResult) {
      const resultComp = document.getElementById('show-result');
      if (resultComp) {
        window.scrollTo({ top: resultComp.offsetTop, behavior: 'smooth' });
      }
    }
  }, [showResult]);

  const handleToggleResultPortal = () => {
    let hasError = false;
    console.log('Ini Portal Berita');

    if (searchValue.length === 0) {
      setSearchWarning(true);
      hasError = true;
    }

    if (jumlahBerita.length === 0) {
      setJumlahBeritaWarning(true);
      hasError = true;
    }

    if (nilaiKemiripan.length === 0) {
      setNilaiKemiripanInfo(true);
    }

    setShowResult(false);
    setVectorDown(ICVectorDownBlue);

    if (!hasError) {
      setVectorDown(ICVectorDownGray);
      console.log('Search Value : ', searchValue, typeof searchValue);
      console.log('Jumlah Berita : ', jumlahBerita, typeof jumlahBerita);
      console.log('Nilai Kemiripan : ', nilaiKemiripan, typeof nilaiKemiripan);
      setShowResult(true);
    }
  };

  const handleToggleResultUrl = () => {
    let hasError = false;
    console.log('Ini URL / Link');

    if (searchValue.length === 0) {
      setSearchWarning(true);
      hasError = true;
    }

    if (nilaiKemiripan.length === 0) {
      setNilaiKemiripanInfo(true);
    }

    if (urlList.length === 0) {
      setUrlWarning(true);
      hasError = true;
    }

    setShowResult(false);
    setVectorDown(ICVectorDownBlue);

    if (!hasError) {
      setVectorDown(ICVectorDownGray);
      console.log('Search Value : ', searchValue, typeof searchValue);
      console.log('Nilai Kemiripan : ', nilaiKemiripan, typeof nilaiKemiripan);
      console.log('List URL : ', urlList, typeof urlList);
      setShowResult(true);
    }
  };

  const handleToggleResultDokumen = () => {
    let hasError = false;
    console.log('Ini Dokumen');

    if (searchValue.length === 0) {
      setSearchWarning(true);
      hasError = true;
    }

    if (nilaiKemiripan.length === 0) {
      setNilaiKemiripanInfo(true);
    }

    if (files.length === 0) {
      setFilesWarning(true);
      hasError = true;
    }

    setShowResult(false);
    setVectorDown(ICVectorDownBlue);

    if (!hasError) {
      setVectorDown(ICVectorDownGray);
      console.log('Search Value : ', searchValue, typeof searchValue);
      console.log('Nilai Kemiripan : ', nilaiKemiripan, typeof nilaiKemiripan);
      console.log('List Dokumen : ', files, typeof files);
      setShowResult(true);
    }
  };

  const handleButtonTelusuri = () => {
    if (selectedOption === 'Portal Berita') {
      handleToggleResultPortal();
    } else if (selectedOption === 'URL / Link') {
      handleToggleResultUrl();
    } else if (selectedOption === 'Dokumen') {
      handleToggleResultDokumen();
    }
  };

  let isButtonDisabled = true;

  if (selectedOption === 'Portal Berita') {
    isButtonDisabled = searchValue.length === 0 || jumlahBerita.length === 0;
  } else if (selectedOption === 'URL / Link') {
    isButtonDisabled = searchValue.length === 0 || urlList.length === 0;
  } else if (selectedOption === 'Dokumen') {
    isButtonDisabled = searchValue.length === 0;
  }

  let pJumlahBerita = '';
  if (selectedOption === 'Portal Berita') {
    pJumlahBerita = jumlahBerita + ' Berita';
  } else if (selectedOption === 'URL / Link') {
    pJumlahBerita = urlList.length + ' URL';
  } else if (selectedOption === 'Dokumen') {
    pJumlahBerita = files.length + ' Dokumen';
  }

  useEffect(() => {
    const colHeight = colRef.current.offsetHeight;
    dividerRef1.current.style.height = `${colHeight}px`;
    dividerRef2.current.style.height = `${colHeight}px`;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderFilterContent = () => {
    if (selectedOption === 'Portal Berita') {
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
                <option value="Portal Berita">Portal Berita</option>
                <option value="URL / Link">URL / Link</option>
                <option value="Dokumen">Dokumen</option>
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
                  className={`form-control ${
                    jumlahBeritaWarning ? 'input-warning' : ''
                  }`}
                  type="number"
                  placeholder="2"
                  value={jumlahBerita}
                  onChange={handleJumlahBeritaChange}
                  max={10}
                  required
                />
              </div>

              {jumlahBeritaWarning && jumlahBerita.length === 0 && (
                <p className="warning">
                  Jumlah berita yang ingin ditampilkan harus diisi
                </p>
              )}

              {jumlahBeritaInfo && jumlahBerita.length !== 0 && (
                <p className="info">
                  Saat ini layanan memiliki kapasitas maksimal sebanyak 10
                </p>
              )}
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
                  value={nilaiKemiripan}
                  onChange={handleNilaiKemiripanChange}
                  max={100}
                />
                <div className="input-group-append">
                  <span className="input-group-text persen">%</span>
                </div>
              </div>

              {nilaiKemiripanInfo && nilaiKemiripan.length === 0 && (
                <p className="info">
                  Jika tidak diisi maka nilai minimum berdasarkan sistem
                </p>
              )}

              {nilaiKemiripanInfo && nilaiKemiripan.length !== 0 && (
                <p className="info">
                  Jika tidak diisi maka nilai minimum berdasarkan sistem
                </p>
              )}
            </div>
          </div>
        </>
      );
    } else if (selectedOption === 'URL / Link') {
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
                <option value="Portal Berita">Portal Berita</option>
                <option value="URL / Link">URL / Link</option>
                <option value="Dokumen">Dokumen</option>
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
                  value={nilaiKemiripan}
                  onChange={handleNilaiKemiripanChange}
                  max={100}
                />
                <div className="input-group-append">
                  <span className="input-group-text persen">%</span>
                </div>
              </div>

              {nilaiKemiripanInfo && nilaiKemiripan.length === 0 && (
                <p className="info">
                  Jika tidak diisi maka nilai minimum berdasarkan sistem
                </p>
              )}

              {nilaiKemiripanInfo && nilaiKemiripan.length !== 0 && (
                <p className="info">
                  Jika tidak diisi maka nilai minimum berdasarkan sistem
                </p>
              )}
            </div>
          </div>

          <div className="horizontal-divider mt-3"></div>
          <p className="mt-3">Masukkan URL / Link Berita</p>
          <div className="row">
            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 mb-2">
              <div className="input-group">
                <input
                  className="form-control"
                  type="url"
                  placeholder="https://contoh.com"
                  value={url}
                  onChange={(e) => setURL(e.target.value)}
                />
              </div>

              {urlWarning && urlList.length === 0 && (
                <p className="warning">
                  Anda harus mengisi daftar URL/Link berita yang ingin dicari
                </p>
              )}

              <div className="row" style={{ marginLeft: '0px' }}>
                {urlList.map((urlItem, index) => (
                  <p className="info" key={index}>
                    {urlItem}
                    {index !== urlList.length - 1 ? ', ' : ''}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mb-2">
              <Button className="btn btn-add" onClick={handleTambahUrl}>
                Tambah
              </Button>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mb-2">
              {/* deactive bisa dinyalakan dan tidak */}
              <Button
                className={`btn btn-reset ${
                  urlList.length === 0 ? 'deactive' : ''
                }`}
                onClick={handleResetUrl}
              >
                Reset
              </Button>
            </div>
          </div>
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
                <option value="Portal Berita">Portal Berita</option>
                <option value="URL / Link">URL / Link</option>
                <option value="Dokumen">Dokumen</option>
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
                  value={nilaiKemiripan}
                  onChange={handleNilaiKemiripanChange}
                  max={100}
                />
                <div className="input-group-append">
                  <span className="input-group-text persen">%</span>
                </div>
              </div>

              {nilaiKemiripanInfo && nilaiKemiripan.length === 0 && (
                <p className="info">
                  Jika tidak diisi maka nilai minimum berdasarkan sistem
                </p>
              )}

              {nilaiKemiripanInfo && nilaiKemiripan.length !== 0 && (
                <p className="info">
                  Jika tidak diisi maka nilai minimum berdasarkan sistem
                </p>
              )}
            </div>
          </div>

          <div className="horizontal-divider mt-3"></div>
          <p className="mt-3">Unggah Dokumen Berita</p>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-2">
              <input
                type="file"
                multiple
                className="btn btn-add"
                onChange={handleFileChange}
              />

              {filesWarning && files.length === 0 && (
                <p className="warning">
                  Anda harus menambahkan daftar Dokumen berita yang ingin dicari
                </p>
              )}

              <div className="row" style={{ marginLeft: '0px' }}>
                {files.map((file, index) => (
                  <p className="info" key={index}>
                    {file.name}
                    {index !== files.length - 1 ? ', ' : ''}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-2">
              {/* deactive bisa dinyalakan dan tidak */}
              <Button
                className={`btn btn-reset ${
                  files.length === 0 ? 'deactive' : ''
                }`}
                onClick={handleResetDokumen}
              >
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
            src={vectorDown}
            alt=""
            style={{ width: '100%', marginBottom: 24 }}
          />
        </div>
        <div className="col-auto"></div>

        <div className="search-menu-wrapper rounded-lg">
          <div className="input-group">
            <input
              className={`form-control ${searchWarning ? 'input-warning' : ''}`}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Masukkan Kata Kunci Pencarian"
              required
            />

            <div className="input-group-append">
              {/* deactive bisa dinyalakan dan tidak */}
              <Button
                className={`input-group-text ${
                  isButtonDisabled ? 'deactive' : ''
                }`}
                onClick={handleButtonTelusuri}
                disabled={isButtonDisabled}
              >
                Telusuri
              </Button>
            </div>
          </div>

          {searchWarning && searchValue.length === 0 && (
            <p className="warning" style={{ marginLeft: '16px' }}>
              Kata kunci pencarian harus diisi
            </p>
          )}

          <div className="search-filter-wrapper">{renderFilterContent()}</div>
        </div>
      </div>

      {showResult && (
        <div id="show-result" className="result-search mb-5">
          <div className="result-title-wrapper">
            <div className="col-auto"></div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 d-none d-md-block mb-3">
              <img
                src={ICVectorDownBlue}
                alt=""
                style={{ width: '100%', marginTop: '-150px' }}
              />
            </div>
            <div className="col-auto"></div>
            <h1>Hasil Pencarian Berita</h1>
          </div>

          <h5 className="half mb-2">
            Sumber Berita : <span>{selectedOption}</span>
          </h5>
          <h5 className="half mb-2">
            Jumlah Berita yang Ditampilkan : <span>{pJumlahBerita}</span>
          </h5>
          <h5 className="half mb-2">
            Minimum Persentase Kemiripan :{' '}
            <span>
              {nilaiKemiripan.length === 0 ? 'Default' : nilaiKemiripan + '%'}
            </span>
          </h5>

          <div className="news-result-wrapper rounded-lg mt-5">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <img
                  className="mb-3"
                  src={ImgExample}
                  alt=""
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <h4 className="mb-3">Judul Berita</h4>
                <h5 className="mb-2">
                  Persentase Kemiripan : <span>hasil %</span>
                </h5>
                <h5 className="mb-2">
                  Kata Kunci Berita : <span>hasil kata kunci</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Stemmer, Tokenizer } from 'sastrawijs';
import numeric from 'numeric';
import axios from 'axios';
import StopwordDictionary from '../../utils/StopwordDictionary';
import Button from '../../elements/Button';
import ICVectorDownGray from '../../assets/images/vectordowngray.png';
import ICVectorDownBlue from '../../assets/images/vectordown.png';

export default function Content() {
  const [vectorDown, setVectorDown] = useState(ICVectorDownBlue);
  const [selectedOption, setSelectedOption] = useState('Portal Berita');
  const [searchValue, setSearchValue] = useState('');
  const [jumlahBerita, setJumlahBerita] = useState('');
  const [nilaiKemiripan, setNilaiKemiripan] = useState('');
  const [url, setURL] = useState('');
  const [tfidf, setTfidf] = useState(null);
  const [tfidfWithZeros, setTfidfWithZeros] = useState(null);
  const [documentSimilarity, setDocumentSimilarity] = useState(null);
  const [urlList, setURLList] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [beforeSastrawi, setBeforeSastrawi] = useState([]);
  const [sastrawi, setSastrawi] = useState([]);
  const [newTerms, setNewTerms] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [allTermsOld, setAllTermsOld] = useState([]);
  const [nonEmptySimilarity, setNonEmptySimilarity] = useState([]);
  const [resultSVD, setResultSVD] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  const [grabKategori, setGrabKategori] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [searchWarning, setSearchWarning] = useState(false);
  const [jumlahBeritaWarning, setJumlahBeritaWarning] = useState(false);
  const [jumlahBeritaInfo, setJumlahBeritaInfo] = useState(false);
  const [nilaiKemiripanInfo, setNilaiKemiripanInfo] = useState(false);
  const [urlWarning, setUrlWarning] = useState(false);
  const [filesWarning, setFilesWarning] = useState(false);
  const [ilNull, setIlNull] = useState(
    'https://dummyimage.com/600x400/e0e0e0/000000.png&text=No+Image'
  );
  const [newsData, setNewsData] = useState([
    { judul: '', isi: '', date: '', imageUrl: '', link: '' },
  ]);
  const [newsContents, setNewsContents] = useState([]);
  const [titlenContent, setTitlenContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);

  const colRef = useRef(null);
  const dividerRef1 = useRef(null);
  const dividerRef2 = useRef(null);

  const stemmer = new Stemmer();
  const tokenizer = new Tokenizer();

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

    const query = searchValue.toLowerCase();

    const filteredIndices = [];
    const results = titlenContent.filter((item, index) => {
      const includesQuery = item.toLowerCase().includes(query);
      if (includesQuery) {
        filteredIndices.push(index);
      }
      return includesQuery;
    });

    console.log(results);
    console.log(filteredIndices);
    setSearchIndex(filteredIndices);

    const filteredNewsData = filteredIndices.map((index) => newsData[index]);

    console.log(filteredNewsData);
    setSearchResults(results);
    // Perform the search based on the searchQuery and your own data

    if (results.length > 0) {
      const updatedNewsContent = [...newsContents];
      const contents = [];
      const newTerms = [];

      //text preprocessing query content
      const queryContentString = searchValue.toString().toLowerCase();

      const queryTokens = tokenizer.tokenize(queryContentString);
      console.log('test token query', queryTokens);

      const queryFilteredWords = queryTokens.filter(
        (word) => !StopwordDictionary.includes(word)
      );

      const queryContent = [];
      for (const word of queryFilteredWords) {
        queryContent.push(stemmer.stem(word));
      }

      console.log('Query Content', queryContent);

      for (let i = 0; i < results.length; i++) {
        const content = results[i];

        updatedNewsContent.push(content);

        const contentString = content.toString().toLowerCase();
        console.log('ini test lowercase:', contentString);

        const tokens = tokenizer.tokenize(contentString);
        console.log('ini test token:', tokens);

        const filteredWords = tokens.filter(
          (word) => !StopwordDictionary.includes(word)
        );
        console.log('ini test filteredWords:', filteredWords);

        const newsContents = [];
        for (const word of filteredWords) {
          newsContents.push(stemmer.stem(word));
        }
        console.log('ini test stemming:', newsContents);
        contents.push(newsContents);
        newTerms.push(tokens);
      }

      const mergedContents = [...queryContent, ...newsContents];
      contents.push(mergedContents);
      console.log('merged content', mergedContents);

      setSastrawi(contents);
      setBeforeSastrawi(newTerms);
      console.log('sastrawi + text ', contents);
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

  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      const selectedFiles = Array.from(files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

      const updatedFileContents = [...fileContents];
      const updatedFileNames = [...fileNames];
      const contents = [];
      const newTerms = [];

      const searchQuery = searchValue;

      //text preprocessing query content
      const queryContentString = searchQuery.toString().toLowerCase();

      const queryTokens = tokenizer.tokenize(queryContentString);
      console.log('test token query', queryTokens);

      const queryFilteredWords = queryTokens.filter(
        (word) => !StopwordDictionary.includes(word)
      );

      const queryContent = [];
      for (const word of queryFilteredWords) {
        queryContent.push(stemmer.stem(word));
      }

      console.log('Query Content', queryContent);

      //text preprocessing files content
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await handleFileContent(file);

        updatedFileContents.push(result.content);
        updatedFileNames.push(result.name);

        // text preprocessing file content
        const content = await handleFileContent(file);
        console.log('ini test before:', content.content);

        const contentString = content.content.toString().toLowerCase();
        console.log('ini test lowercase:', contentString);

        const tokens = tokenizer.tokenize(contentString);
        console.log('ini test token:', tokens);

        const filteredWords = tokens.filter(
          (word) => !StopwordDictionary.includes(word)
        );
        console.log('ini test filteredWords:', filteredWords);

        const fileContents = [];
        for (const word of filteredWords) {
          fileContents.push(stemmer.stem(word));
        }
        console.log('ini test stemming:', fileContents);

        // const mergedContents = [queryContent, ...fileContents]; // Place textFileContents at the first index
        // console.log('merged content', mergedContents);
        // contents.push(mergedContents);

        contents.push(fileContents);
        newTerms.push(tokens);
      }

      const mergedContents = [...queryContent, ...fileContents];
      contents.push(mergedContents);
      console.log('merged content', mergedContents);

      setSastrawi(contents);
      setBeforeSastrawi(newTerms);
      console.log('sastrawi + text ', contents);
      setFileContents(updatedFileContents);
      setFileNames(updatedFileNames);
    }
  };

  useEffect(() => {
    if (sastrawi.length > 0) {
      // Build the term-document matrix
      const { termDocumentMatrix, terms } = buildTermDocumentMatrix(sastrawi);
      const { termDocumentMatrixx, termss } = saveNewTerms(beforeSastrawi);
      setNewTerms(terms);
      setAllTerms([...allTerms, ...terms]);

      // Calculate the TF-IDF weights
      const tfidfWeights = calculateTfidf(termDocumentMatrix);
      setTfidf(tfidfWeights);
    }
  }, [sastrawi, beforeSastrawi]);

  const saveNewTerms = (values) => {
    const termDocumentMatrixx = {};
    const termss = [];

    values.forEach((document, documentIndex) => {
      document.forEach((term) => {
        if (!termDocumentMatrixx.hasOwnProperty(term)) {
          termDocumentMatrixx[term] = {};
          termss.push(term);
        }

        if (!termDocumentMatrixx[term].hasOwnProperty(documentIndex)) {
          termDocumentMatrixx[term][documentIndex] = 0;
        }

        termDocumentMatrixx[term][documentIndex]++;
        // console.log('term document matrix : ', termDocumentMatrix);
      });
    });

    console.log('terms baru: ', termss);
    setAllTermsOld(termss);
    return { termDocumentMatrixx, termss };
  };

  const buildTermDocumentMatrix = (documents) => {
    const termDocumentMatrix = {};
    const terms = [];

    documents.forEach((document, documentIndex) => {
      document.forEach((term) => {
        if (!termDocumentMatrix.hasOwnProperty(term)) {
          termDocumentMatrix[term] = {};
          terms.push(term);
        }

        if (!termDocumentMatrix[term].hasOwnProperty(documentIndex)) {
          termDocumentMatrix[term][documentIndex] = 0;
        }

        termDocumentMatrix[term][documentIndex]++;
        // console.log('term document matrix : ', termDocumentMatrix);
      });
    });

    console.log('terms baru: ', terms);
    return { termDocumentMatrix, terms };
  };

  const calculateTfidf = (termDocumentMatrix) => {
    const tfidfWeights = {};

    const documentCount = sastrawi.length;

    Object.keys(termDocumentMatrix).forEach((term) => {
      const documentFrequency = Object.keys(termDocumentMatrix[term]).length;
      const inverseDocumentFrequency = Math.log10(
        documentCount / documentFrequency
      );

      // console.log(documentFrequency);
      // console.log('n:', documentCount);
      // console.log('idf:', inverseDocumentFrequency);

      Object.keys(termDocumentMatrix[term]).forEach((documentIndex) => {
        const termFrequency = termDocumentMatrix[term][documentIndex];
        const tfidf = termFrequency * inverseDocumentFrequency;

        if (!tfidfWeights.hasOwnProperty(documentIndex)) {
          tfidfWeights[documentIndex] = {};
        }

        tfidfWeights[documentIndex][term] = tfidf;
      });
    });

    return tfidfWeights;
  };

  const calculateTfidfForAllDocuments = () => {
    if (tfidf !== null) {
      const tfidfWithZerosForAllDocuments = {};

      sastrawi.forEach((_, documentIndex) => {
        const tfidfWeightsForDocument = tfidf[documentIndex];
        const tfidfWithZerosForDocument = {};

        allTerms.forEach((term) => {
          if (tfidfWeightsForDocument.hasOwnProperty(term)) {
            tfidfWithZerosForDocument[term] = tfidfWeightsForDocument[term];
          } else {
            tfidfWithZerosForDocument[term] = 0;
          }
        });

        tfidfWithZerosForAllDocuments[documentIndex] =
          tfidfWithZerosForDocument;
      });

      console.log(
        'TF-IDF weights (with zeros) for all documents:',
        tfidfWithZerosForAllDocuments
      );
      setTfidfWithZeros(tfidfWithZerosForAllDocuments);
      // calculateDocumentSimilarity(tfidfWithZerosForAllDocuments);
      handleLSA(tfidfWithZerosForAllDocuments);
    }
  };

  const handleLSA = (values) => {
    // Step 1: Compute TF-IDF weights (Already computed in tfidfWeights)

    // Step 2: Create the Term-Document Matrix
    const terms = Object.keys(values[0]); // Get the terms from the first document
    console.log(terms);
    console.log(values);
    const tfidfLength = Object.keys(values);
    console.log(tfidfLength);
    console.log(tfidfLength.length);
    const termDocumentMatrix = [];

    terms.forEach((term) => {
      const termVector = [];

      for (let i = 0; i < tfidfLength.length; i++) {
        if (values[i].hasOwnProperty(term)) {
          termVector.push(values[i][term]);
        } else {
          termVector.push(0);
        }
        // console.log(termVector);
      }

      termDocumentMatrix.push(termVector);
    });
    console.log(termDocumentMatrix);

    // Step 3: Perform Singular Value Decomposition (SVD)
    const svdResult = numeric.svd(termDocumentMatrix);
    console.log(svdResult);

    const U = svdResult.U; // Left singular vectors (term-topic matrix)
    const S = svdResult.S; // Singular values (diagonal matrix)
    const V = svdResult.V; // Right singular vectors (document-topic matrix)
    const diagSize = S.length;
    const diagMatrix = [];

    for (let i = 0; i < diagSize; i++) {
      const row = [];
      for (let j = 0; j < diagSize; j++) {
        if (i === j) {
          row.push(S[i]); // Diagonal element
        } else {
          row.push(0); // Non-diagonal element
        }
      }
      diagMatrix.push(row);
    }
    console.log('svdU:', U);
    console.log('svdS:', S);
    console.log('diagonal matrix : ', diagMatrix);
    console.log('svdV:', V);

    const transposeV = V[0].map((col, i) => V.map((row) => row[i]));

    const rowsU = U.length;
    const colsU = U[0].length;
    const colsDiag = diagMatrix[0].length;

    const resultMatrixDiag = [];

    for (let i = 0; i < rowsU; i++) {
      resultMatrixDiag[i] = [];
      for (let j = 0; j < colsDiag; j++) {
        resultMatrixDiag[i][j] = 0;
        for (let k = 0; k < colsU; k++) {
          resultMatrixDiag[i][j] += U[i][k] * diagMatrix[k][j];
        }
      }
    }

    console.log('result U x S :', resultMatrixDiag);

    const rowsResultMatrixDiag = resultMatrixDiag.length;
    const colsResultMatrixDiag = resultMatrixDiag[0].length;
    const colsTransposeV = transposeV[0].length;

    const resultDiagxV = [];

    for (let i = 0; i < rowsResultMatrixDiag; i++) {
      resultDiagxV[i] = [];
      for (let j = 0; j < colsTransposeV; j++) {
        resultDiagxV[i][j] = 0;
        for (let k = 0; k < colsResultMatrixDiag; k++) {
          resultDiagxV[i][j] += resultMatrixDiag[i][k] * transposeV[k][j];
        }
      }
    }

    console.log('ini transpose v:', transposeV);
    console.log('result diag x V :', resultDiagxV);
    // setResultSVD(resultDiagxV);

    const maxValues = [];

    for (let i = 0; i < resultDiagxV[0].length; i++) {
      const column = resultDiagxV.map((row, rowIndex) => ({
        value: row[i],
        index: rowIndex,
      }));
      column.sort((a, b) => b.value - a.value);
      const maxTwoValues = column.slice(0, 5);
      maxValues.push(maxTwoValues);
    }

    maxValues.map((values, index) =>
      values.map((values, index) => console.log(allTermsOld[values.index]))
    );

    setMaxValues(maxValues);

    console.log(maxValues);

    const updatedMatrix = resultDiagxV.map((row) =>
      row.map((value) => (value < 0 ? -value : value))
    );

    console.log(updatedMatrix);

    calculateDocumentSimilarity(resultDiagxV);
  };

  const calculateDocumentSimilarity = (values) => {
    if (selectedOption === 'Portal Berita') {
      const documentCount = sastrawi.length;
      const similarityMatrix = [];

      // const tfidfLast = Object.values(values).map(
      //   (obj) => obj[documentCount - 1]
      // ); // Last index of each document

      const tfidfLast = Object.values(values[documentCount - 1]); // Last document
      console.log('Last doc similarity', tfidfLast);

      for (let i = 0; i < documentCount - 1; i++) {
        const similarities = [];
        const tfidf1 = Object.values(values[i]);

        //   const tfidf1 = Object.values(values).map((obj) => obj[i]);

        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        for (let k = 0; k < tfidf1.length; k++) {
          dotProduct += tfidf1[k] * tfidfLast[k];
          magnitude1 += tfidf1[k] ** 2;
          magnitude2 += tfidfLast[k] ** 2;
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        const similarity = Math.round(
          (dotProduct / (magnitude1 * magnitude2)) * 100
        );

        similarities.push(similarity);

        similarityMatrix.push(similarities);
      }

      const maxSimilarity = Math.max(...similarityMatrix.flat());
      const minSimilarity = Math.min(...similarityMatrix.flat());
      const averageSimilarity = (maxSimilarity + minSimilarity) / 2;

      const filteredSimilarityMatrix = similarityMatrix.map((similarities) => {
        return similarities.filter(
          (similarity) => similarity >= averageSimilarity
        );
      });

      const arraySimilarity = filteredSimilarityMatrix.filter(
        (item) => item.length !== 0
      );

      setNonEmptySimilarity(arraySimilarity);

      arraySimilarity.forEach((item, index) => {
        console.log(`Value ${index}: ${item[0]}`);
      });

      console.log('Highest Similarity:', maxSimilarity);
      console.log('Lowest Similarity:', minSimilarity);
      console.log('threshold Similarity:', averageSimilarity);
      console.log('all similarity', similarityMatrix);
      console.log('array similarity', arraySimilarity);
      console.log('news', newsContents);

      setDocumentSimilarity(filteredSimilarityMatrix);
    } else if (selectedOption === 'Dokumen') {
      const documentCount = sastrawi.length;
      const similarityMatrix = [];

      const tfidfLast = Object.values(values).map(
        (obj) => obj[documentCount - 1]
      ); // Last index of each document
      console.log('Last doc similarity', tfidfLast);

      for (let i = 0; i < documentCount - 1; i++) {
        const similarities = [];
        const tfidf1 = Object.values(values).map((obj) => obj[i]);

        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        for (let k = 0; k < tfidf1.length; k++) {
          dotProduct += tfidf1[k] * tfidfLast[k];
          magnitude1 += tfidf1[k] ** 2;
          magnitude2 += tfidfLast[k] ** 2;
        }
        console.log(dotProduct);

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        const similarity = Math.round(
          (dotProduct / (magnitude1 * magnitude2)) * 100
        );

        similarities.push(similarity);

        similarityMatrix.push(similarities);
      }

      const maxSimilarity = Math.max(...similarityMatrix.flat());
      const minSimilarity = Math.min(...similarityMatrix.flat());
      const averageSimilarity = (maxSimilarity + minSimilarity) / 2;

      const filteredSimilarityMatrix = similarityMatrix.map((similarities) => {
        return similarities.filter(
          (similarity) => similarity >= averageSimilarity
        );
      });

      const arraySimilarity = filteredSimilarityMatrix.filter(
        (item) => item.length !== 0
      );

      setNonEmptySimilarity(arraySimilarity);

      console.log('All Similarity', similarityMatrix);
      console.log('Highest Similarity:', maxSimilarity);
      console.log('Lowest Similarity:', minSimilarity);
      console.log('Threshold Similarity:', averageSimilarity);
      console.log('filtered similarity:', filteredSimilarityMatrix);
      console.log('array similarity:', arraySimilarity);

      setDocumentSimilarity(filteredSimilarityMatrix);
    }
  };

  const handleResetDokumen = () => {
    // Clear Dokumen array value
    setFiles([]);
    setSastrawi([]);
  };

  const handleFileContent = async (file) => {
    if (file.name.endsWith('.docx')) {
      const result = await readDocxFile(file);
      return result;
    } else if (file.name.endsWith('.txt')) {
      const result = await readTextFile(file);
      return result;
    } else {
      return { name: file.name, content: '' };
    }
  };

  const readTextFile = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const content = event.target.result;
        resolve({ name: file.name, content });
      };

      reader.onerror = (event) => {
        reject(event.target.error);
      };

      reader.readAsText(file);
    });
  };

  const readDocxFile = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;

        try {
          const zip = await JSZip.loadAsync(arrayBuffer);
          const contentXml = await zip
            .file('word/document.xml')
            .async('string');
          const doc = new DOMParser().parseFromString(contentXml, 'text/xml');
          const textNodes = doc.getElementsByTagName('w:t');
          let text = '';

          for (let i = 0; i < textNodes.length; i++) {
            text += textNodes[i].textContent;
          }

          resolve({ name: file.name, content: text });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (event) => {
        reject(event.target.error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

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
      calculateTfidfForAllDocuments();

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
      calculateTfidfForAllDocuments();
      // handleLSA();
      setVectorDown(ICVectorDownGray);
      console.log('Search Value : ', searchValue, typeof searchValue);
      console.log('Nilai Kemiripan : ', nilaiKemiripan, typeof nilaiKemiripan);
      console.log('List Dokumen : ', files, typeof files);
      console.log('All Terms Before', allTermsOld);
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
    pJumlahBerita = nonEmptySimilarity.length + ' Dokumen';
  }

  useEffect(() => {
    const colHeight = colRef.current.offsetHeight;
    dividerRef1.current.style.height = `${colHeight}px`;
    dividerRef2.current.style.height = `${colHeight}px`;
  }, []);

  const ambilKategori = async () => {
    const response = await axios.get(
      'https://ta-berita-server.up.railway.app/api/v1/list-kategori'
    );
    console.log(response.data.kategori);
    setGrabKategori(response.data.kategori);
  };

  const grabNewsData = async () => {
    const response = await axios.get(
      'https://ta-berita-server.up.railway.app/api/v1/list-berita'
    );

    const collectNewsData = [];
    const judulDanIsi = [];

    console.log(response.data.berita);
    for (let index = 0; index < response.data.berita.length; index++) {
      const dataBerita = {
        judul: response.data.berita[index].judul,
        isi: response.data.berita[index].isi,
        date: response.data.berita[index].date,
        imageUrl: response.data.berita[index].imageUrl,
        link: response.data.berita[index].link,
      };
      //   console.log(dataBerita);
      collectNewsData.push(dataBerita);
      judulDanIsi.push(dataBerita.judul + ' ' + dataBerita.isi);
    }

    setTitlenContent(judulDanIsi);
    setNewsData(collectNewsData);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    ambilKategori();
    grabNewsData();
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
                {grabKategori.map((values, index) => (
                  <option key={index} value={values.jenis}>
                    {values.jenis}
                  </option>
                ))}
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
                  Saat ini layanan masih belum dapat digunakan
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
                  Saat ini layanan masih belum dapat digunakan
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
                {grabKategori.map((values, index) => (
                  <option key={index} value={values.jenis}>
                    {values.jenis}
                  </option>
                ))}
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
            {/* jangan lupa diganti responsive bootstrap nya jika ingin memunculkan nilai minimum kemiripan */}
            <div className="col-xs col-sm col-md col-lg col-xl mb-2">
              <p>Sumber Berita</p>
              <select
                className="custom-select"
                value={selectedOption}
                onChange={handleOptionChange}
              >
                {grabKategori.map((values, index) => (
                  <option key={index} value={values.jenis}>
                    {values.jenis}
                  </option>
                ))}
              </select>
            </div>

            {/* jangan lupa menghapus hidden */}
            <div className="col-auto d-none d-lg-block">
              <div ref={dividerRef1} className="vertical-divider" hidden></div>
            </div>

            {/* jangan lupa menghapus hidden */}
            <div
              ref={colRef}
              className="col-xs-6 col-sm-6 col-md-6 col-lg-5 col-xl-5 mb-2"
              hidden
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
              placeholder="Masukkan Kata Kunci Pencarian Terlebih Dahulu"
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

          {selectedOption === 'Dokumen' && (
            <div>
              {documentSimilarity.length > 0 &&
                documentSimilarity.map((item, index) => {
                  if (item.length > 0) {
                    const fileName = fileNames[index]; // Assuming 'fileNames' is the state containing the file names
                    const keywords = maxValues[index];
                    const similarityPercentage = item[0]; // Assuming the similarity value is at index 0
                    const formattedKeywords = keywords.map(
                      (values, index) => allTermsOld[values.index]
                    );
                    // const keyword = keywords[index]; // Assuming 'keywords' is the state containing the keywords

                    return (
                      <div
                        key={index}
                        className="news-result-wrapper rounded-lg mt-5"
                      >
                        <div className="row">
                          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <img
                              className="mb-3"
                              src={ilNull}
                              alt=""
                              style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <h4 className="mb-3">{fileName}</h4>
                            <h5 className="mb-2">
                              Persentase Kemiripan :{' '}
                              <span>{similarityPercentage}%</span>
                            </h5>
                            <h5 className="mb-2">
                              Kata Kunci Berita :
                              <span>{formattedKeywords.join(', ')}</span>
                            </h5>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          )}

          {selectedOption === 'Portal Berita' && (
            <div>
              {documentSimilarity.length > 0 &&
                documentSimilarity.map((item, index) => {
                  if (item.length > 0) {
                    const keywords = maxValues[index];
                    const sIndex = searchIndex[index];
                    const similarityPercentage = item[0]; // Assuming the similarity value is at index 0
                    const formattedKeywords = keywords.map(
                      (values, index) => allTermsOld[values.index]
                    );
                    const allData = newsData[sIndex];

                    return (
                      <div
                        key={index}
                        className="news-result-wrapper rounded-lg mt-5"
                      >
                        <div className="row">
                          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <img
                              className="mb-3"
                              src={allData.imageUrl}
                              alt=""
                              style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <h4 className="mb-3">
                              <a href={allData.link}>{allData.judul}</a>
                            </h4>
                            <h5 className="mb-2">
                              Persentase Kemiripan :{' '}
                              <span>{similarityPercentage}%</span>
                            </h5>
                            <h5 className="mb-2">
                              Kata Kunci Berita :
                              <span>{formattedKeywords.join(', ')}</span>
                            </h5>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stemmer, Tokenizer } from 'sastrawijs';
import numeric from 'numeric';
import StopwordDictionary from '../utils/StopwordDictionary';

export default function NewsTest() {
  const [searchValue, setSearchValue] = useState('');
  const [kemiripan, setKemiripan] = useState(0);
  const [jumlahBerita, setJumlahBerita] = useState(0);
  const [newsData, setNewsData] = useState([
    { judul: '', isi: '', date: '', imageUrl: '', link: '' },
  ]);
  const [setThresholdSimilarity] = useState(0);
  const [tfidf, setTfidf] = useState(null);
  const [setTfidfWithZeros] = useState(null);
  const [documentSimilarity, setDocumentSimilarity] = useState([]);
  const [sastrawi, setSastrawi] = useState([]);
  const [beforeSastrawi, setBeforeSastrawi] = useState([]);
  const [setNewTerms] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [allTermsOld, setAllTermsOld] = useState([]);
  const [setNonEmptySimilarity] = useState([]);
  const [newsContents] = useState([]);
  const [titlenContent, setTitlenContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);

  const stemmer = new Stemmer();
  const tokenizer = new Tokenizer();

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

    const newsDataWithJudulDanIsi = collectNewsData.map((data, index) => ({
      ...data,
      judulDanIsi: judulDanIsi[index],
    }));
    console.log(newsDataWithJudulDanIsi);
    setNewsData(newsDataWithJudulDanIsi);

    setTitlenContent(judulDanIsi);
    // setNewsData(collectNewsData);
  };

  useEffect(() => {
    grabNewsData();
  }, []);

  const handleQueryChange = (event) => {
    const inputValue = event.target.value;
    setSearchValue(inputValue);
  };

  const handleKemiripanChange = (event) => {
    setKemiripan(event.target.value);
  };

  const handleJumlahBeritaChange = (event) => {
    setJumlahBerita(event.target.value);
  };

  const handleOnClick = () => {
    calculateTfidfForAllDocuments();
  };

  const handleSearch = () => {
    console.log(titlenContent);
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

  useEffect(() => {
    if (sastrawi.length > 0) {
      // Build the term-document matrix
      const { termDocumentMatrix, terms } = buildTermDocumentMatrix(sastrawi);
      saveNewTerms(beforeSastrawi);
      setNewTerms(terms);
      setAllTerms([...allTerms, ...terms]);

      // Calculate the TF-IDF weights
      const tfidfWeights = calculateTfidf(termDocumentMatrix);
      setTfidf(tfidfWeights);
      calculateTfidfForAllDocuments();
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
    console.log(values);
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

    calculateDocumentSimilarity(updatedMatrix);
  };

  const calculateDocumentSimilarity = (values) => {
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
    setThresholdSimilarity(averageSimilarity);

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
  };

  return (
    <div>
      <h1>News Test</h1>
      <input type="text" value={searchValue} onChange={handleQueryChange} />
      <br />
      <input type="text" value={kemiripan} onChange={handleKemiripanChange} />
      <br />
      <input
        type="text"
        value={jumlahBerita}
        onChange={handleJumlahBeritaChange}
      />
      <br />
      <button onClick={handleOnClick}>Telusuri</button>
      {/* <ul>
        {newsData.map((values, index) => (
          <li key={index}>{values.judul}</li>
        ))}
      </ul> */}

      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}

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
              console.log(allData);

              return (
                <div>
                  <a href={allData.link}>{allData.judul}</a>
                  <p>{sIndex}</p>
                  <p>{similarityPercentage}</p>
                  <h5 className="mb-2">
                    Kata Kunci Berita :
                    <span>{formattedKeywords.join(', ')}</span>
                  </h5>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

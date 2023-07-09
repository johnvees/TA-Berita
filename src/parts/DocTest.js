import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Stemmer, Tokenizer } from 'sastrawijs';
import numeric, { div } from 'numeric';
import StopwordDictionary from '../utils/StopwordDictionary';

export default function DocTest() {
  const [fileContents, setFileContents] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [query, setQuery] = useState('');
  const [sastrawi, setSastrawi] = useState([]);
  const [lowerCaseDoc, setlowerCaseDoc] = useState([]);
  const [lowerCaseQuery, setlowerCaseQuery] = useState('');
  const [tokenDoc, setTokenDoc] = useState([]);
  const [tokenQuery, setTokenQuery] = useState([]);
  const [filterDoc, setFilterDoc] = useState([]);
  const [filterQuery, setFilterQuery] = useState([]);
  const [stemmingDoc, setStemmingDoc] = useState([]);
  const [stemmingQuery, setStemmingQuery] = useState([]);
  const [svdU, setSvdU] = useState([]);
  const [svdV, setSvdV] = useState([]);
  const [svdDiag, setSvdDiag] = useState([]);
  const [svdUDiag, setSvdUDiag] = useState([]);
  const [svdDiagV, setSvdDiagV] = useState([]);
  const [allSimilarity, setAllSimilarity] = useState([]);
  const [similarityThreshold, setSimilarityThreshold] = useState(null);
  const [maxValues, setMaxValues] = useState([]);
  const [beforeSastrawi, setBeforeSastrawi] = useState([]);
  const [allTermsOld, setAllTermsOld] = useState([]);
  const [tfidf, setTfidf] = useState(null);
  const [newTerms, setNewTerms] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [nonEmptySimilarity, setNonEmptySimilarity] = useState([]);
  const [setThresholdSimilarity] = useState(0);
  const [tfidfWithZeros, setTfidfWithZeros] = useState(null);
  const [documentSimilarity, setDocumentSimilarity] = useState(null);
  const [similarDocuments] = useState([]);

  const stemmer = new Stemmer();
  const tokenizer = new Tokenizer();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
  };

  const handleFileSelect = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const updatedFileContents = [...fileContents];
      const updatedFileNames = [...fileNames];
      const contents = [];
      const lowercase = [];
      const tokenizing = [];
      const filtering = [];
      const newTerms = [];

      const searchQuery = query;

      //text preprocessing query content
      const queryContentString = searchQuery.toString().toLowerCase();
      setlowerCaseQuery(queryContentString);

      const queryTokens = tokenizer.tokenize(queryContentString);
      console.log('test token query', queryTokens);
      setTokenQuery(queryTokens);

      const queryFilteredWords = queryTokens.filter(
        (word) => !StopwordDictionary.includes(word)
      );
      setFilterQuery(queryFilteredWords);

      const queryContent = [];
      for (const word of queryFilteredWords) {
        queryContent.push(stemmer.stem(word));
      }

      setStemmingQuery(queryContent);

      console.log('Query Content', queryContent);

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
        contents.push(fileContents);
        newTerms.push(tokens);
        lowercase.push(contentString);
        tokenizing.push(tokens);
        filtering.push(filteredWords);
        setlowerCaseDoc(lowercase);
        setTokenDoc(tokenizing);
        setFilterDoc(filtering);
        setStemmingDoc(contents);
      }

      console.log(contents);
      const mergedContents = [...queryContent, ...fileContents];
      contents.push(mergedContents);
      console.log('merged content', mergedContents);

      setSastrawi(contents);
      setBeforeSastrawi(newTerms);
      console.log('sastrawi + text ', contents);
      console.log('file names', updatedFileNames);
      setFileContents(updatedFileContents);
      setFileNames(updatedFileNames);
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

    setSvdU(U);
    setSvdDiag(diagMatrix);
    console.log('svdU:', U);
    console.log('svdS:', S);
    console.log('diagonal matrix : ', diagMatrix);
    console.log('svdV:', V);

    const transposeV = V[0].map((col, i) => V.map((row) => row[i]));
    setSvdV(transposeV);

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

    setSvdUDiag(resultMatrixDiag);

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

    // maxValues.map((values, index) =>
    //   values.map((values, index) => console.log(allTermsOld[values.index]))
    // );

    setMaxValues(maxValues);

    const updatedMatrix = resultDiagxV.map((row) =>
      row.map((value) => (value < 0 ? -value : value))
    );

    setSvdDiagV(updatedMatrix);

    console.log(updatedMatrix);

    calculateDocumentSimilarity(updatedMatrix);
  };

  const calculateDocumentSimilarity = (values) => {
    const documentCount = sastrawi.length;
    const similarityMatrix = [];

    const tfidfLast = Object.values(values).map(
      (obj) => obj[documentCount - 1]
    ); // Last index of each document

    console.log('tfidfLast', tfidfLast);

    for (let i = 0; i < documentCount - 1; i++) {
      const similarities = [];
      const tfidf1 = Object.values(values).map((obj) => obj[i]);
      console.log('tfidf', tfidf1);
      console.log('tfidf length', tfidf1.length);

      let dotProduct = 0;
      let magnitude1 = 0;
      let magnitude2 = 0;

      for (let k = 0; k < tfidf1.length; k++) {
        console.log('tfidf1', tfidf1[k]);
        console.log('tfidflast', tfidfLast[k]);
        dotProduct += (tfidf1[k] * tfidfLast[k]);
        console.log('dot product', dotProduct);
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

    setAllSimilarity(similarityMatrix);

    const maxSimilarity = Math.max(...similarityMatrix.flat());
    const minSimilarity = Math.min(...similarityMatrix.flat());
    const averageSimilarity = (maxSimilarity + minSimilarity) / 2;

    setSimilarityThreshold(averageSimilarity);

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
    console.log('filtered similarity', filteredSimilarityMatrix);
    console.log(' array similarity', arraySimilarity);
    console.log('file name', fileNames);

    setDocumentSimilarity(filteredSimilarityMatrix);
  };

  const handleButtonClick = () => {
    calculateTfidfForAllDocuments();
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} />
      <input
        type="file"
        multiple
        accept=".docx, .txt"
        onChange={handleFileSelect}
      />

      <div>
        <h2>Raw Text Data:</h2>
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Contoh Berita</th>
            </tr>
          </thead>
          <tbody>
            {fileContents.map((content, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{content}</td>
              </tr>
            ))}
            <tr>
              <td>q</td>
              <td>{query}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Case Folding:</h2>
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Contoh Berita</th>
            </tr>
          </thead>
          <tbody>
            {lowerCaseDoc.map((content, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{content}</td>
              </tr>
            ))}
            <tr>
              <td>q</td>
              <td>{lowerCaseQuery}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Tokenizing:</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Sebelum</th>
              <th>Sesudah</th>
            </tr>
          </thead>
          <tbody>
            {tokenDoc.map((content, index) => (
              <tr key={index}>
                {lowerCaseDoc[index] && <td>{lowerCaseDoc[index]}</td>}
                <td>{content}</td>
              </tr>
            ))}
            <tr>
              <td>{lowerCaseQuery}</td>
              <td>{tokenQuery}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Filtering:</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Sebelum</th>
              <th>Sesudah</th>
            </tr>
          </thead>
          <tbody>
            {filterDoc.map((content, index) => (
              <tr key={index}>
                {tokenDoc[index] && <td>{tokenDoc[index]}</td>}
                <td>{content}</td>
              </tr>
            ))}
            <tr>
              <td>{tokenQuery}</td>
              <td>{filterQuery}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>Stemming:</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Sebelum</th>
              <th>Sesudah</th>
            </tr>
          </thead>
          <tbody>
            {stemmingDoc.map((content, index) => (
              <tr key={index}>
                {filterDoc[index] && <td>{filterDoc[index]}</td>}
                <td>{content}</td>
              </tr>
            ))}
            <tr>
              <td>{filterQuery}</td>
              <td>{stemmingQuery}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {tfidfWithZeros && (
        <div>
          <h2>TF-IDF:</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Term</th>
                {Object.keys(tfidfWithZeros).map((documentIndex) => (
                  <th key={documentIndex}>Document {documentIndex}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(tfidfWithZeros[0]).map((term, index) => (
                <tr key={index}>
                  <td>{term}</td>
                  {Object.keys(tfidfWithZeros).map((documentIndex) => (
                    <td key={documentIndex}>
                      {tfidfWithZeros[documentIndex][term]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <h2>Matrix U</h2>
        <table className="table">
          <tbody>
            {svdU.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Matrix Diagonal</h2>
        <table className="table">
          <tbody>
            {svdDiag.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Matrix V</h2>
        <table className="table">
          <tbody>
            {svdV.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Matrix U x Diag</h2>
        <table className="table">
          <tbody>
            {svdUDiag.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Matrix Diag x V</h2>
        <table className="table">
          <tbody>
            {svdDiagV.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>All Similarities</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Documents</th>
              <th>Similarity</th>
            </tr>
          </thead>
          <tbody>
            {allSimilarity.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <>
                    <td>Document : {rowIndex + 1}</td>
                    <td key={cellIndex}>{cell}</td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Similarity Threshold : {similarityThreshold} %</h2>
      </div>

      {documentSimilarity && (
        <div>
          <h2>Passed Documents</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Documents</th>
                <th>Similarity</th>
              </tr>
            </thead>
            <tbody>
              {documentSimilarity
                .filter((content) => content !== 0)
                .map((content, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{content}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {documentSimilarity &&
        documentSimilarity.map((item, index) => {
          if (item.length > 0) {
            const fileName = fileNames[index];
            const keyword = maxValues[index];
            const similarityPercentage = item[0];
            const formattedKeywords = keyword.map(
              (values, index) => allTerms[values.index]
            );

            return (
              <div key={index}>
                <h2>Topic Extraction</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Keywords</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{fileName}</td>
                      <td>{formattedKeywords.join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        })}

      <button onClick={handleButtonClick}>Calculate LSA</button>
    </div>
  );
}

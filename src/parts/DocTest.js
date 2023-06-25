import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Stemmer, Tokenizer } from 'sastrawijs';
import numeric from 'numeric';
import cosineSimilarity from 'cosine-similarity';
import StopwordDictionary from '../utils/StopwordDictionary';

export default function DocTest() {
  const [fileContents, setFileContents] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [query, setQuery] = useState('');
  const [sastrawi, setSastrawi] = useState([]);
  const [tfidf, setTfidf] = useState(null);
  const [newTerms, setNewTerms] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
    const [nonEmptySimilarity, setNonEmptySimilarity] = useState([]);
  const [tfidfWithZeros, setTfidfWithZeros] = useState(null);
  const [documentSimilarity, setDocumentSimilarity] = useState(null);
  const [similarDocuments, setSimilarDocuments] = useState([]);

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

      const searchQuery = query;

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
      }

      const mergedContents = [...queryContent, ...fileContents];
      contents.push(mergedContents);
      console.log('merged content', mergedContents);

      setSastrawi(contents);
      console.log('sastrawi + text ', contents);
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
      setNewTerms(terms);
      setAllTerms([...allTerms, ...terms]);

      // Calculate the TF-IDF weights
      const tfidfWeights = calculateTfidf(termDocumentMatrix);
      setTfidf(tfidfWeights);
    }
  }, [sastrawi]);

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

    const updatedMatrix = resultDiagxV.map((row) =>
      row.map((value) => (value < 0 ? -value : value))
    );

    console.log(updatedMatrix);

    calculateDocumentSimilarity(updatedMatrix);
  };

  const calculateDocumentSimilarity = (values) => {
    const documentCount = sastrawi.length;
    const similarityMatrix = [];

    const tfidfLast = Object.values(values[documentCount - 1]); // Last document

    for (let i = 0; i < documentCount - 1; i++) {
      const similarities = [];
      const tfidf1 = Object.values(values[i]);

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

      // for (let j = 0; j < documentCount; j++) {
      //   if (i === j) {
      //     similarities.push(100); // Self-similarity is 100%
      //     continue;
      //   }

      //   const tfidf1 = Object.values(values[i]);
      //   const tfidf2 = Object.values(values[j]);

      //   // const dotProduct = tfidf1.reduce(
      //   //   (sum, value, index) => sum + value * tfidf2[index],
      //   //   0
      //   // );
      //   // const magnitude1 = Math.sqrt(
      //   //   tfidf1.reduce((sum, value) => sum + value ** 2, 0)
      //   // );
      //   // const magnitude2 = Math.sqrt(
      //   //   tfidf2.reduce((sum, value) => sum + value ** 2, 0)
      //   // );

      //   // similarities.push(
      //   //   Math.round((dotProduct / (magnitude1 * magnitude2)) * 100)
      //   // );

      //   let dotProduct = 0;
      //   let magnitude1 = 0;
      //   let magnitude2 = 0;

      //   for (let k = 0; k < tfidf1.length; k++) {
      //     dotProduct += tfidf1[k] * tfidf2[k];
      //     magnitude1 += tfidf1[k] ** 2;
      //     magnitude2 += tfidf2[k] ** 2;
      //   }

      //   magnitude1 = Math.sqrt(magnitude1);
      //   magnitude2 = Math.sqrt(magnitude2);

      //   const similarity = Math.round(
      //     (dotProduct / (magnitude1 * magnitude2)) * 100
      //   );
      //   similarities.push(similarity);
      // }
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
    console.log('Average Similarity:', averageSimilarity);
    console.log(filteredSimilarityMatrix);
    console.log(filteredSimilarityMatrix.filter((item) => item.length !== 0));

    setDocumentSimilarity(filteredSimilarityMatrix);
  };

  const handleButtonClick = () => {
    calculateTfidfForAllDocuments();
    // handleLSA();
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
        <h2>File Contents:</h2>
        {fileContents.map((content, index) => (
          <div key={index}>
            <h3>{fileNames[index]}</h3>
            <pre>{content}</pre>
          </div>
        ))}
      </div>

      <div>
        <h2>New Terms:</h2>
        {newTerms.map((term, index) => (
          <p key={index}>{term}</p>
        ))}

        <button onClick={() => calculateTfidfForAllDocuments()}>
          Calculate TF-IDF for All Documents
        </button>

        {tfidfWithZeros && (
          <div>
            <h2>TF-IDF with Zeros:</h2>
            {Object.keys(tfidfWithZeros).map((documentIndex) => (
              <div key={documentIndex}>
                <h3>Document {documentIndex}:</h3>
                {Object.keys(tfidfWithZeros[documentIndex]).map(
                  (term, index) => (
                    <p key={index}>
                      {term}: {tfidfWithZeros[documentIndex][term]}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {documentSimilarity && (
          <div>
            <h2>Document Similarity:</h2>
            {documentSimilarity.map((similarities, i) => (
              <div key={i}>
                <h3>Document {i}:</h3>
                {similarities.map((similarity, j) => (
                  <p key={j}>
                    Similarity with Document {j}: {similarity}%
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button onClick={handleLSA}>handle lsa</button>
        <h1>LSA Similar Documents</h1>
        {similarDocuments.length > 0 && (
          <ul>
            {similarDocuments.map((similarity) => (
              <li key={similarity.documentIndex}>
                Document {similarity.documentIndex}: Similarity ={' '}
                {similarity.similarity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleButtonClick}>Calculate LSA</button>
      {nonEmptySimilarity.map((item, index) => (
        <li key={index}>Similarity {item[0]}</li>
      ))}
    </div>
  );
}

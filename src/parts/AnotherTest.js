import React, { useState } from 'react';
import numeric from 'numeric';

const AnotherTest = () => {
  const [matrix, setMatrix] = useState([
    [3, 1],
    [1, 3],
  ]);

  const handleClick = () => {
    const svdResult = numeric.svd(matrix);
    console.log(matrix);

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
  };

  return (
    <div>
      <h1>My Smart Search Engine</h1>
      <button onClick={handleClick}>Test SVD</button>
    </div>
  );

  // const data = [
  //   'Gerindra Gencarkan Serangan Udara dan Darat Demi Menangkan Prabowo Partai Gerindra akan menggencarkan serangan udara dan darat dalam rangka memenangkan Prabowo Subianto di Pilpres 2024.',
  //   'Banana',
  //   'Orange',
  //   'Mango',
  //   'Pineapple',
  // ];
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]);

  // const handleSearch = () => {
  //   const query = searchQuery.toLowerCase(); // Convert query to lowercase for case insensitivity
  //   const results = data.filter(
  //     (item) => item.toLowerCase().includes(query) // Convert each item to lowercase for case insensitivity
  //   );
  //   setSearchResults(results);
  //   console.log(data);
  // };

  // return (
  //   <div>
  //     <h1>My Smart Search Engine</h1>
  //     <input
  //       type="text"
  //       value={searchQuery}
  //       onChange={(event) => setSearchQuery(event.target.value)}
  //     />
  //     <button onClick={handleSearch}>Search</button>

  //     {searchResults.length > 0 ? (
  //       <ul>
  //         {searchResults.map((result, index) => (
  //           <li key={index}>{result}</li>
  //         ))}
  //       </ul>
  //     ) : (
  //       <p>No results found.</p>
  //     )}
  //   </div>
  // );
};

export default AnotherTest;

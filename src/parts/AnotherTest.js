import React, { useState, useEffect } from 'react';

const AnotherTest = () => {
  const matrix = [1, 2, 3, 4, 5];
  const indicesToShow = [1, 3, 4];
  const valuesToShow = indicesToShow.map((index) => matrix[index]);

  return (
    <div>
      {valuesToShow.map((value, index) => (
        <div key={index}>{value}</div>
      ))}
    </div>
  );
};

export default AnotherTest;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import cheerio from 'cheerio';

export default function TestPart() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [titles, setTitles] = useState([]);
  const [content, setContent] = useState([]);

  const handleSearch = async () => {
    const apiKey = 'AIzaSyAt2So-KHqquu50aUPv5TTjFVuM5FPYEqY';
    const cx = '81cf28dfd5cf344f2';

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}&gl=id&sort=date`;

    try {
      const response = await axios.get(url);
      setResults(response.data.items);
      console.log(response.data.items);
      console.log(url);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }

  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://kalsel.prokal.co/read/news/50121-ada-dugaan-pungli-dinas-selisih-harga-bbm-nelayan-itu-karena-biaya-angkut.html',
  //         { mode: 'no-cors' }
  //       );

  //       // Handle the opaque response here since you don't have access to the response data or headers

  //       setTitles(['News title']); // Replace with appropriate value
  //       setContent(['News content']); // Replace with appropriate value
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // var url =
  //   'https://newsapi.org/v2/everything?' +
  //   // 'country=id&' +
  //   'q=bahan bakar minyak&' +
  //   'apiKey=1143d178042e44a49bc3f52e34f40172';
  // var req = new Request(url);
  // fetch(req).then(function (response) {
  //   // console.log(response.json());
  //   var respon = response.json();
  //   console.log(respon);
  // });

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your search query"
      />
      <button onClick={handleSearch}>Search</button>

      {results.length > 0 && (
        <div>
          <h2>Search Results</h2>
          <ul>
            {results.map((item) => (
              <li key={item.link}>
                <a href={item.link}>{item.title}</a>
                <p>{item.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
            </li>
          ))}
        </ul>
      </div> */}

      {/* <div>
        <h1>News Titles:</h1>
        <ul>
          {titles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>

        <h1>News Content:</h1>
        <ul>
          {content.map((content, index) => (
            <li key={index}>{content}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

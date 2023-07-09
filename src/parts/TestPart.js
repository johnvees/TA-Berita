import React, { useState } from 'react';
import axios from 'axios';

export default function TestPart() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [setBerita] = useState([]);
  const [judul, setJudul] = useState([]);
  const [body, setBody] = useState({
    judul: [],
    isi: [],
    date: [],
    imageUrl: [],
    link: [],
  });

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

  const grabNewsData = async () => {
    const response = await axios.get(
      'https://berita-indo-api.vercel.app/v1/cnn-news'
    );
    console.log('grab data', response.data.data);
    console.log('grab image', response.data.data[0].image.small);
    setBerita(response.data.data);
    // setBody({
    //   judul: response.data.data.map((obj) => obj.title),
    //   isi: response.data.data.map((obj) => obj.contentSnippet),
    //   date: response.data.data.map((obj) => obj.isoDate),
    //   imageUrl: response.data.data.map((obj) => obj.image.small),
    //   url: response.data.data.map((obj) => obj.link),
    // });
    setJudul({
      jenis: response.data.data[0].title,
    });
    setBody({
      judul: response.data.data[0].title,
      isi: response.data.data[0].contentSnippet,
      date: response.data.data[0].isoDate,
      imageUrl: response.data.data[0].image.small,
      url: response.data.data[0].link,
    });
    // const body = {
    //   judul: berita.title,
    //   isi: berita.contentSnippet,
    //   date: berita.isoDate,
    //   // imageUrl: berita.image.small,
    //   url: berita.link,
    // };
    // console.log(body);
  };

  const postNewsData = async () => {
    console.log(body);
    // const response = await axios.post(
    //   'https://ta-berita-server.up.railway.app/api/v1/list-berita',
    //   body
    // );
    await axios.post('http://localhost:3001/api/v1/add-kategori', judul);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://ta-berita-server.up.railway.app/api/v1/list-berita'
  //       );

  //       console.log(response.data.berita);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://berita-indo-api.vercel.app/v1/cnn-news',
  //         { mode: 'no-cors' }
  //       );

  //       // Handle the opaque response here since you don't have access to the response data or headers

  //       setTitles(['News title']); // Replace with appropriate value
  //       setContent(['News content']); // Replace with appropriate value
  //       console.log(response.data.data);
  //       console.log(response.data.data[0].title);
  //       console.log(response.data.data[0].contentSnippet);
  //       const isoDate = response.data.data[0].isoDate;
  //       const parsedDate = new Date(isoDate);
  //       const year = parsedDate.getUTCFullYear();
  //       const month = parsedDate.getUTCMonth() + 1; // Adding 1 because month is zero-indexed
  //       const day = parsedDate.getUTCDate();
  //       // console.log(
  //       //   `${year}-${month.toString().padStart(2, '0')}-${day
  //       //     .toString()
  //       //     .padStart(2, '0')}`
  //       // ); // Output: 2023-06-21
  //       const dateConcat = `${year}-${month.toString().padStart(2, '0')}-${day
  //         .toString()
  //         .padStart(2, '0')}`;
  //       console.log(dateConcat);
  //       console.log(response.data.data[0].link);
  //       console.log(response.data.data[0].image.small);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://api.nytimes.com/svc/search/v2/articlesearch.json',
  //         {
  //           params: {
  //             q: 'republican voter fraud eric',
  //             'api-key': 'PpK79TmWkTYpcvWi9NKxp4b8hdgczzFq',
  //           },
  //         }
  //       );

  //       // Handle the response data here
  //       const articles = response.data.response.docs;
  //       const titles = articles.map((article) => article.headline.main);
  //       const content = articles.map((article) => article.abstract);

  //       console.log(articles);
  //       setTitles(titles);
  //       setContent(content);
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
      <button onClick={postNewsData}>Post APi</button>
      <button onClick={grabNewsData}>Grab APi</button>
      {/* {berita.length > 0 && (
        <div>
          {berita.map((item) => (
            <div key={item.link}>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      )} */}

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

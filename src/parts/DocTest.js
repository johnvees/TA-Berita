import React, { useState } from 'react';
import JSZip from 'jszip';
import { Stemmer, Tokenizer } from 'sastrawijs';
import natural from 'natural';
import StopwordDictionary from '../utils/StopwordDictionary';

export default function DocTest() {
  const [fileContents, setFileContents] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [sastrawi, setSastrawi] = useState([]);

  const stemmer = new Stemmer();
  const tokenizer = new Tokenizer();

  const handleFileSelect = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const updatedFileContents = [...fileContents];
      const updatedFileNames = [...fileNames];
      const contents = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await handleFileContent(file);

        updatedFileContents.push(result.content);
        updatedFileNames.push(result.name);

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
      }

      setSastrawi(contents);
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

  const handleButton = () => {
    console.log('List Dokumen : ', fileContents, typeof fileContents);
    console.log(fileNames);
    console.log(sastrawi);
  };

  return (
    <div>
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

      <button onClick={handleButton}>click</button>
    </div>
  );
}

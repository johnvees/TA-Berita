import React, {useState} from 'react'
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import PizZip from 'pizzip';
import { Document, Packer } from 'docx';

export default function DocTest() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileContent, setFileContent] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const result = await readTextFile(file);
      setFileContent(result);
    }
  };

  const readTextFile = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const content = event.target.result;
        resolve(content);
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

          resolve(text);
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
      setFileContent(result);
    } else if (file.name.endsWith('.txt')) {
      const result = await readTextFile(file);
      setFileContent(result);
    } else {
      setFileContent('');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".docx, .txt"
        onChange={(e) => handleFileContent(e.target.files[0])}
      />

      <div>
        <h2>File Content:</h2>
        <pre>{fileContent}</pre>
      </div>
    </div>
  );
}

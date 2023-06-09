import React, {useState} from 'react'
import JSZip from 'jszip';
import { parseString } from 'xml2js';

export default function DocTest() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileContent, setFileContent] = useState('');

 const handleFileSelect = async (event) => {
   const file = event.target.files[0];

   if (file) {
     const result = await convertToText(file);
     setFileContent(result);
   }
 };

 const convertToText = async (file) => {
   const reader = new FileReader();

   return new Promise((resolve, reject) => {
     reader.onload = async (event) => {
       const arrayBuffer = event.target.result;

       try {
         const zip = await JSZip.loadAsync(arrayBuffer);
         const content = await zip.file('word/document.xml').async('string');
         const parsedContent = await parseXml(content);
         const text = extractTextFromXml(parsedContent);

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

 const parseXml = (xml) => {
   return new Promise((resolve, reject) => {
     parseString(xml, (error, result) => {
       if (error) {
         reject(error);
       } else {
         resolve(result);
       }
     });
   });
 };

 const extractTextFromXml = (xml) => {
   // Modify this function to extract the desired text from the parsed XML structure
   // This example simply returns the raw XML content as text
   return JSON.stringify(xml);
 };

 return (
   <div>
     <input type="file" onChange={handleFileSelect} />

     <div>
       <h2>File Content:</h2>
       <pre>{fileContent}</pre>
     </div>
   </div>
 );
}

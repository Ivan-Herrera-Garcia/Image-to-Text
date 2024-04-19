import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const App = () => {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const capture = () => {
    const image = webcamRef.getScreenshot();

    setImageData(image);
  };

  const recognizeText = async () => {
    if (!imageData) return;

    const tesseract = new Tesseract();
    await tesseract.loadLanguage('spa'); // Cargar idioma español

    const { data } = await tesseract.recognize(imageData);
    setExtractedText(data.text);
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      <button onClick={capture}>Capturar imagen</button>
      {
        imageData && 
          <img src={imageData} alt="Imagen capturada" />
      }
       <button onClick={recognizeText}>Extraer texto</button>
      {extractedText && <p>Texto extraído: {extractedText}</p>}
    </div>
  );
};

export default App;
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Button, Segment, Header, Icon, Input } from 'semantic-ui-react';

//Esto es un comentario en visual studio code

const App = () => {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [encender, setEncender] = useState(false);
  const [tipoOpcion, setTipoOpcion] = useState('ambas');

  const capture = () => {
    setEncender(true);
    const image = webcamRef.current.getScreenshot();
    setImageData(image);
    console.log(image);
  };

  const recognizeText = async () => {
    if (!imageData) return;
    Tesseract.recognize(
      imageData,
      'spa', // Especifica el idioma de reconocimiento
      { logger: (m) => console.log(m) } // Opcional: muestra mensajes de registro en la consola
    ).then(({ data: { text } }) => {
      setExtractedText(text);
    });
  }

  const handleFileChange = (e) => {
    setTipoOpcion("archivo");
    const file = e.target.files[0];
    if (file) {
      setImageData(URL.createObjectURL(file));
    }
  };
    
  const limpiar = () => {
    setImageData(null);
    setExtractedText('');
    setTipoOpcion('ambas');
    setEncender(false);
  }

  return (
    <div className='w-full h-screen text-center mt-10'>
      <h1 className='text-4xl font-bold mb-5'>Imagen a texto</h1>
      <p className='text-lg text-black justify-center'>
        Mediante la libreria de <a href='https://www.npmjs.com/package/tesseract.js/v/4.1.1' className='no-underline hover:underline hover:font-semibold'>Tesseract-js</a> 
        &nbsp;se puede obtener el texto de una imagen. <br/> Tesseract.js es una biblioteca de JavaScript que obtiene palabras en casi cualquier idioma de las imágenes.</p>
      <div className='flex justify-center text-center mt-10'>
        {/* Parte de tipo de seleccion de imagen */}
        <div className={`${tipoOpcion === 'archivo' && 'hidden' } w-1/2 text-center`}>
          <h3>Uso de WebCam</h3>
          {!encender ? <button onClick={() => {setEncender(true); setTipoOpcion("webcam")}}>Encender camera</button> : <button onClick={capture}>Capturar imagen</button>}
          {encender && <Webcam ref={webcamRef} />}
          {imageData && <img src={imageData} alt="Imagen seleccionada" style={{ maxWidth: '300px' }} />}
        </div>
        <div className={`${tipoOpcion === 'webcam' && 'hidden' } inline-block w-1/2`}>
          <h3>Explorar archivos</h3>
          {!imageData ?
            <Segment placeholder className='w-auto !m-16'>
                <Header icon>
                  <Icon name='file image' />
                  No hay imagen seleccionada
                </Header>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </Segment>
            :
            <img src={imageData} alt="Imagen seleccionada" style={{ maxWidth: '300px' }}/>
          }
        </div>
      </div>
      {/* Parte de resultados */}
      <div className='mt-5 flex text-center place-content-center '>
        <p className='w-[500px] justify-normal'>{extractedText !== '' ? extractedText : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis augue sit amet sem facilisis porttitor. In pulvinar et dolor non vehicula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi vel dictum mauris. Aenean ac lorem nec metus laoreet aliquet eu sed tellus.'}</p>
        <div className='grid grid-cols-1 gap-2'>
          <Button positive onClick={recognizeText}>Extraer texto</Button>
          <Input
            value={extractedText ? extractedText : 'Sin contenido'}
            disabled={extractedText !== '' ? false : true}
            action={{
              color: 'teal',
              labelPosition: 'right',
              icon: 'copy',
              content: 'Copy',
            }}
          />  
          <Button negative onClick={() => limpiar()}>Limpiar</Button>
        </div>
      </div>
    </div>
  );
};

export default App;
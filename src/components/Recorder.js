import React, { useEffect, useState } from 'react';

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('EN-US');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => playSound(event);
    document.addEventListener('keydown', handleKeyDown);

    return (
      document.removeEventListener('keydown', handleKeyDown)
    )
  })

  const startRecording = () => {
    try {
      // Check if SpeechRecognition API is available
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        throw new Error('SpeechRecognition API is not supported in this browser.');
      }

      // Initialize SpeechRecognition
      const recognition = new SpeechRecognition();
      recognition.lang = language; // Set language (adjust as needed)
      recognition.interimResults = false; // Final results only
      recognition.continuous = true; // Don't Stop after one sentence

      // Handle recognition eventsSpeechRecognition
      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
        //setTranscript('');
      };

      recognition.onresult = (event) => {
        const transcriptResult = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscript( transcriptResult);
      };

      recognition.onerror = (event) => {
        setError(event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      // Start recognition
      recognition.start();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };


  return (
    <div className='recorder'>
      <div className='language-selection'>
        <select name="language" id="language" onChange={(e) => setLanguage(e.target.value)}>
          <option value="EN-US">English</option>
          <option value="BN-IN">Bangla</option>
          <option value="HI-IN">Hindi</option>
          <option value="UR-IN">Urdu</option>
          <option value="MR-IN">Marathi</option>
          <option value="TA-IN">Tamil</option>
          <option value="TE-IN">Telugu</option>
          <option value="KN-IN">Kannada</option>
        </select>
      </div>
      <div className='buttons'>
      <button onClick={startRecording} disabled={isRecording}>
        Start
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
      </div>
      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {transcript && (
        <>
        <div className='transcript'>
          <p>{transcript}</p>
        </div>
        <div className='clear-transcript'>
          <button onClick={() => setTranscript('')}>Clear</button>    
        </div>
        </>
      )}
    </div>
  );
}

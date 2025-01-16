import React, { useEffect, useState } from 'react';

export default function Piano() {
  const [keys] = useState([ 's', 'r', 'g', 'm', 'p', 'd', 'n','a', 'h']);
  const [activeKey, setActiveKey] = useState(null); // Track the active key
  const [audioError, setAudioError] = useState(false); // Track AudioContext errors
  const [scale, setScale] = useState(1); // Scale factor for sound frequencies
  const [chords, setChords] = useState('a$2 d$2 h$1 o$1 n$2 o$1 m$2 p$2 s$1 d$1');
  const [pitch, setPitch] = useState('sine');
  const textareaRef = React.useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      playSound(event);
      setActiveKey(event.key); // Set active key on keydown
    };

    const handleKeyUp = () => {
      setActiveKey(null); // Clear active key on keyup
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [scale]); // Recalculate sound frequencies when scale changes

  const playSound = (event) => {
    try {
      console.log('Key pressed:', event.key);

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = pitch;

      // Define base frequencies
      const baseFrequencies = {
        s: 261.63, // C4
        r: 293.66, // D4
        g: 329.63, // E4
        m: 349.23, // F4
        p: 392.0,  // G4
        d: 440.0,  // A4
        n: 493.88, // B4
        a: 523.25, // C5
        h: 277.18, // C#4
      };

      const frequency = baseFrequencies[event.key];
      if (frequency) {
        // Apply the scale factor
        oscillator.frequency.setValueAtTime(frequency * scale, audioCtx.currentTime);
      } else {
        console.warn('Unhandled key:', event.key);
        return; // Do not proceed for unhandled keys
      }

      oscillator.connect(audioCtx.destination);
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
      }, 300);
    } catch (error) {
      console.error('AudioContext error:', error);
      setAudioError(true); // Set error state to true
    }
  };

  // Reload the component when an error occurs
  if (audioError) {
    return (
      <div className="error">
        <p>Audio context encountered an error. Reloading...</p>
        <button onClick={() => setAudioError(false)}>Reload</button>
      </div>
    );
  }

  const readChordsAndPlay = ()=>{
      // Split chords input into individual notes
      const notes = chords.trim().split(" ");
      
      const baseFrequencies = {
        s: 261.63, // C4
        r: 293.66, // D4
        g: 329.63, // E4
        m: 349.23, // F4
        p: 392.0,  // G4
        d: 440.0,  // A4
        n: 493.88, // B4
        a: 523.25, // C5
        h: 277.18, // C#4
      };
    
      // Play each note in sequence with a delay
      notes.forEach((note, index) => {
        let noteNumber = note.split('$')[0];
        let nodeDuration = note.split('$')[1];
        const frequency = baseFrequencies[noteNumber];
        console.log(frequency);
        if (frequency) {
          setTimeout(() => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            oscillator.type = pitch;
            oscillator.frequency.setValueAtTime(frequency * scale, audioCtx.currentTime);
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            setTimeout(() => {
              oscillator.stop();
              audioCtx.close(); // Properly close the AudioContext
            }, (300 * parseInt(nodeDuration))); // Stop the sound after 300ms
          }, index * 700); // Delay each note by 500ms
        } else {
          console.warn(`Unhandled note: ${noteNumber}`);
        }
      });
        
  }

  return (
    <div className="piano">
      <div className='types'>
      <label>
        <strong>types: &nbsp;&nbsp;</strong> 
        <input
          type="radio"
          value="sine"
          name="pitch"
          onChange={(e) => setPitch(e.target.value)}
          /> &nbsp;
        sine &nbsp;
        <input
          type="radio"
          value="triangle"
          name="pitch"
          onChange={(e) => setPitch(e.target.value)}
          /> &nbsp;
        triangle &nbsp;
        <input
          type="radio"
          value="square"
          name="pitch"
          onChange={(e) => setPitch(e.target.value)}
          /> &nbsp;
         square &nbsp;
        <input
          type="radio"
          value="sawtooth"
          name="pitch"
          onChange={(e) => setPitch(e.target.value)}
          /> &nbsp;
         sawtooth
      </label>
      </div>
      <div className="controls">
        <label>
          Scale: 
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.2"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
          {scale.toFixed(1)}x
        </label>
      </div>
      <div className="piano-buttons">
        {keys.map((key, idx) => (
          <button
            key={idx}
            className={`Btn ${activeKey === key ? 'active' : ''}`} // Add 'active' class if the key is active
            onClick={() => playSound({ key })} // Pass custom event object
          >
            {key}
          </button>
        ))}
      </div>


      <div className='piano-chords'>
        <textarea ref={textareaRef} onChange={(e)=>setChords(e.target.value)} defaultValue={chords}>
        </textarea>
        <button className='Play-Chords' onClick={readChordsAndPlay}>Play</button>
      </div>
    </div>
  );
}

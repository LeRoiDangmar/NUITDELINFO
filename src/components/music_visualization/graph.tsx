import { useEffect, useRef, useState } from 'react';
import "../../style/visualizer.css";
import * as Tone from 'tone';

export function Graph() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Tone.Player | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);

  useEffect(() => {
    // Initialize Tone.js audio nodes
    const player = new Tone.Player().toDestination();
    const analyser = new Tone.Analyser('fft', 256);
    player.connect(analyser);

    playerRef.current = player;
    analyserRef.current = analyser;

    return () => {
      player.dispose();
      analyser.dispose();
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    
    // Create URL for the audio file
    const fileUrl = URL.createObjectURL(file);
    
    // Load the file into Tone.js Player
    if (playerRef.current) {
      await playerRef.current.load(fileUrl);
    }
  };

  const handlePlay = async () => {
    // Start Tone.js audio context if needed
    await Tone.start();
    
    if (playerRef.current) {
      playerRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setIsPlaying(false);
    }
  };

  const getFrequencyData = (): Uint8Array => {
    if (analyserRef.current) {
      const float32Array = analyserRef.current.getValue();
      return new Uint8Array(float32Array instanceof Float32Array ? float32Array : []);
    }
    return new Uint8Array();
  };

  return (
    <div className='visualizer-container'>
      <h2 className='title'>Music Visualization</h2>
      
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        disabled={isPlaying}
      />
      
      {audioFile && (
        <div className='music-controls'>
          <div className='play-stop-buttons'>
            <button onClick={handlePlay} disabled={isPlaying}>
              Play
            </button>
            
            {isPlaying && (
              <button onClick={handleStop}>
                Stop
              </button>
            )}
            
            
          </div>
        <div>
        {playerRef.current && (<div className='volume-control'>
          <label htmlFor="volume-slider">Volume:</label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.8"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              playerRef.current.volume.value = Tone.gainToDb(value);
            }}
          />
        </div>)}
      </div>
        </div>
      )}
      <div className='visualizer'>
        {isPlaying && analyserRef.current && (
          <canvas
        ref={(canvas) => {
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const draw = () => {
            const data = getFrequencyData();
            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, width, height);

            const binCount = 128; // Number of columns to display
            const binSize = Math.floor(data.length / binCount);
            const barWidth = width / binCount;

            // Calculate all bin values first to find max for normalization
            const binValues: number[] = [];
            for (let i = 0; i < binCount; i++) {
              let sum = 0;
              for (let j = 0; j < binSize; j++) {
                sum += data[i * binSize + j];
              }
              const average = sum / binSize;
              binValues.push(average / 255.0);
            }

            // Find max value for dynamic range
            const maxValue = Math.max(...binValues);

            for (let i = 0; i < binCount; i++) {
              const normalizedValue = binValues[i] / Math.max(maxValue, 0.1);
              // Apply exponential scaling for more sensitivity
              const scaledValue = Math.pow(normalizedValue, 0.3);
              const barHeight = scaledValue * height * 0.8;

              // Draw bar with gradient effect
              const hue = (i / binCount) * 360;
              ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
              ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);
            }

            requestAnimationFrame(draw);
          };

          draw();
        }}
          />
        )}
      </div>
    </div>
  );
}
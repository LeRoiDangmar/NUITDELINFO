import { useEffect, useState, useRef } from "react";

// Custom code 'nird'

export const useSecretCode = (code: string[]) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputSequence = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear timeout on each key press
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add key to sequence
      inputSequence.current.push(e.key);

      // Keep only the last N keys where N is the code length
      if (inputSequence.current.length > code.length) {
        inputSequence.current.shift();
      }

      // Check if sequence matches code
      if (inputSequence.current.length === code.length) {
        const matches = inputSequence.current.every(
          (key, index) => key.toLowerCase() === code[index].toLowerCase()
        );

        if (matches) {
          setIsUnlocked(true);
          inputSequence.current = [];
        }
      }

      // Reset sequence after 2 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        inputSequence.current = [];
      }, 2000);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code]);

  const reset = () => {
    setIsUnlocked(false);
    inputSequence.current = [];
  };

  return { isUnlocked, reset };
};

import { useEffect, useState, useRef } from "react";

// Default: Konami code (up, up, down, down, left, right, left, right, b, a)
// Alternative: Custom code like 'snake'
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
const CUSTOM_CODE = ["s", "n", "a", "k", "e"]; // Type "snake"

export const useSecretCode = (code: string[] = CUSTOM_CODE) => {
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

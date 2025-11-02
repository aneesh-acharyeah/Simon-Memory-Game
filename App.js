import React, { useState, useEffect, useRef } from "react";

const COLORS = ["green", "red", "yellow", "blue"];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export default function SimonGame() {
  const [sequence, setSequence] = useState([getRandomColor()]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [message, setMessage] = useState("Watch and repeat the sequence!");
  const [isPlayingBack, setIsPlayingBack] = useState(true);
  const [activeColor, setActiveColor] = useState(null);

  const timeoutRef = useRef();

  // Play sequence animation
  useEffect(() => {
    if (isPlayingBack) {
      let i = 0;
      const playNext = () => {
        setActiveColor(sequence[i]);
        timeoutRef.current = setTimeout(() => {
          setActiveColor(null);
          i++;
          if (i < sequence.length) {
            timeoutRef.current = setTimeout(playNext, 300);
          } else {
            setIsPlayingBack(false);
            setMessage("Your turn!");
            setPlayerIndex(0);
          }
        }, 600);
      };
      playNext();
      return () => clearTimeout(timeoutRef.current);
    }
  }, [sequence, isPlayingBack]);

  // Handle player click
  const handleClick = (color) => {
    if (isPlayingBack) return;
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    if (color === sequence[playerIndex]) {
      if (playerIndex + 1 === sequence.length) {
        // Correct, add next color
        setMessage("Correct! Next round...");
        setTimeout(() => {
          setSequence((seq) => [...seq, getRandomColor()]);
          setIsPlayingBack(true);
        }, 800);
      } else {
        setPlayerIndex(playerIndex + 1);
      }
    } else {
      setMessage(`Game Over! Score: ${sequence.length - 1}`);
      setSequence([getRandomColor()]);
      setIsPlayingBack(true);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "50px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>Simon Memory Game</h2>
      <p>{message}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 120px)", gap: 20, margin: "30px auto" }}>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleClick(color)}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: color === activeColor ? "6px solid black" : "3px solid #555",
              background: color,
              opacity: color === activeColor ? 1 : 0.7,
              cursor: isPlayingBack ? "default" : "pointer",
              transition: "border 0.2s, opacity 0.2s"
            }}
            disabled={isPlayingBack}
          />
        ))}
      </div>
      <div style={{ fontWeight: "bold", marginTop: 16 }}>Score: {sequence.length - (message.startsWith("Game Over") ? 1 : 0)}</div>
    </div>
  );
}

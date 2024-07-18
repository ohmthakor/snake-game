import React, { useEffect, useRef, useState } from 'react';

const scale = 20;
const rows = 20;
const columns = 20;

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: scale, y: 0 });
  const [speed, setSpeed] = useState(250);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameInterval, setGameInterval] = useState(null);

  useEffect(() => {
    placeFood();
  }, []);

  useEffect(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    const interval = setInterval(() => {
      update();
    }, speed);
    setGameInterval(interval);

    return () => clearInterval(interval);
  }, [speed]);

  const placeFood = () => {
    const x = Math.floor(Math.random() * rows) * scale;
    const y = Math.floor(Math.random() * columns) * scale;
    setFood({ x, y });
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection((prev) => (prev.y === scale ? prev : { x: 0, y: -scale }));
        break;
      case 'ArrowDown':
        setDirection((prev) => (prev.y === -scale ? prev : { x: 0, y: scale }));
        break;
      case 'ArrowLeft':
        setDirection((prev) => (prev.x === scale ? prev : { x: -scale, y: 0 }));
        break;
      case 'ArrowRight':
        setDirection((prev) => (prev.x === -scale ? prev : { x: scale, y: 0 }));
        break;
      default:
        break;
    }
  };

  const update = () => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[newSnake.length - 1] };
      head.x += direction.x;
      head.y += direction.y;

      if (head.x === food.x && head.y === food.y) {
        newSnake.push(head);
        placeFood();
      } else {
        newSnake.shift();
        newSnake.push(head);
      }

      if (checkCollision(newSnake)) {
        gameOver();
        return prevSnake;
      }

      return newSnake;
    });
  };

  const checkCollision = (newSnake) => {
    const head = newSnake[newSnake.length - 1];
    for (let i = 0; i < newSnake.length - 1; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
        return true;
      }
    }
    if (difficulty === 'hard') {
      if (head.x >= rows * scale || head.y >= columns * scale || head.x < 0 || head.y < 0) {
        return true;
      }
    }
    return false;
  };

  const gameOver = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    setGameInterval(null);
    setSnake([{ x: 0, y: 0 }]);
    setDirection({ x: scale, y: 0 });
  };

  const handleStartGame = () => {
    switch (difficulty) {
      case 'easy':
        setSpeed(250);
        break;
      case 'medium':
        setSpeed(150);
        break;
      case 'hard':
        setSpeed(100);
        break;
      default:
        break;
    }
    setSnake([{ x: 0, y: 0 }]);
    setDirection({ x: scale, y: 0 });
    placeFood();
  };

  return (
    <div onKeyDown={handleKeyPress} tabIndex="0" style={{ outline: 'none' }}>
      <div className="menu">
        <label htmlFor="difficulty">Choose Difficulty:</label>
        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
      <canvas
        ref={canvasRef}
        width={rows * scale}
        height={columns * scale}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default SnakeGame;

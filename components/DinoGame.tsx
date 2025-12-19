"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

export default function DinoGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dinoY, setDinoY] = useState(0);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastObstacleTimeRef = useRef<number>(0);
  const isJumpingRef = useRef(false);
  const currentDinoYRef = useRef(0);

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const GROUND_Y = 150;
  const DINO_SIZE = 30;
  const OBSTACLE_MIN_GAP = 150;

  const jump = useCallback(() => {
    if (currentDinoYRef.current === 0 && !isJumpingRef.current) {
      setDinoVelocity(JUMP_STRENGTH);
      isJumpingRef.current = true;
    }
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setDinoY(0);
    setDinoVelocity(0);
    setObstacles([]);
    setGameSpeed(2);
    lastObstacleTimeRef.current = 0;
    isJumpingRef.current = false;
    currentDinoYRef.current = 0;
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setDinoY(0);
    setDinoVelocity(0);
    setObstacles([]);
    setGameSpeed(2);
    lastObstacleTimeRef.current = 0;
    isJumpingRef.current = false;
    currentDinoYRef.current = 0;
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentDinoY = dinoY;
    let currentDinoVelocity = dinoVelocity;
    let currentObstacles = [...obstacles];
    let currentScore = score;
    let currentSpeed = gameSpeed;
    let lastTime = performance.now();
    let lastObstacleTime = lastObstacleTimeRef.current || 0;

    const gameLoop = (currentTime: number) => {
      if (!isPlaying || gameOver) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      const deltaTime = Math.min((currentTime - lastTime) / 16, 2); // Cap delta time
      lastTime = currentTime;

      // Update dino physics
      if (currentDinoY > 0 || currentDinoVelocity < 0) {
        currentDinoVelocity += GRAVITY;
        currentDinoY += currentDinoVelocity;
        if (currentDinoY <= 0) {
          currentDinoY = 0;
          currentDinoVelocity = 0;
          isJumpingRef.current = false;
        }
        currentDinoYRef.current = currentDinoY;
        setDinoY(currentDinoY);
        setDinoVelocity(currentDinoVelocity);
      }

      // Update obstacles
      currentObstacles = currentObstacles
        .map((obs) => ({ ...obs, x: obs.x - currentSpeed }))
        .filter((obs) => obs.x > -obs.width);

      // Add new obstacles
      if (currentTime - lastObstacleTime > OBSTACLE_MIN_GAP * (1000 / currentSpeed)) {
        const obstacleHeight = 20 + Math.random() * 15;
        currentObstacles.push({
          x: canvas.width,
          width: 15,
          height: obstacleHeight,
        });
        lastObstacleTime = currentTime;
        lastObstacleTimeRef.current = lastObstacleTime;
      }
      setObstacles([...currentObstacles]);

      // Check collisions
      const dinoX = 50;
      const dinoBottom = GROUND_Y - currentDinoY;
      const dinoTop = dinoBottom - DINO_SIZE;

      for (const obs of currentObstacles) {
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;
        const obsTop = GROUND_Y - obs.height;
        const obsBottom = GROUND_Y;

        if (
          dinoX + DINO_SIZE > obsLeft &&
          dinoX < obsRight &&
          dinoTop < obsBottom &&
          dinoBottom > obsTop
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      // Update score
      currentScore += 1;
      setScore(currentScore);

      // Increase speed gradually
      if (currentScore % 100 === 0 && currentScore > 0) {
        currentSpeed = Math.min(currentSpeed + 0.1, 8);
        setGameSpeed(currentSpeed);
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#535353";
      ctx.fillRect(0, GROUND_Y, canvas.width, 5);

      // Draw dino
      ctx.fillStyle = "#535353";
      ctx.fillRect(dinoX, GROUND_Y - DINO_SIZE - currentDinoY, DINO_SIZE, DINO_SIZE);

      // Draw obstacles
      ctx.fillStyle = "#535353";
      currentObstacles.forEach((obs) => {
        ctx.fillRect(obs.x, GROUND_Y - obs.height, obs.width, obs.height);
      });

      // Draw score
      ctx.fillStyle = "#535353";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${Math.floor(currentScore / 10)}`, 10, 20);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        if (gameOver) {
          resetGame();
          startGame();
        } else if (isPlaying) {
          jump();
        } else {
          startGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, gameOver, jump]);

  const handleCanvasClick = () => {
    if (gameOver) {
      resetGame();
      startGame();
    } else if (!isPlaying) {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        onClick={handleCanvasClick}
        className="cursor-pointer border border-border rounded-lg bg-background"
        style={{ imageRendering: "pixelated" }}
      />
      {!isPlaying && !gameOver && (
        <p className="text-sm text-muted mt-2">Click to start</p>
      )}
      {isPlaying && !gameOver && (
        <p className="text-sm text-muted mt-2">Space/Up to jump</p>
      )}
    </div>
  );
}


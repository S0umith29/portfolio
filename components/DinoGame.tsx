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
  const [gameStartTime, setGameStartTime] = useState(0);
  const [skyOffset, setSkyOffset] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastObstacleTimeRef = useRef<number>(0);
  const isJumpingRef = useRef(false);
  const currentDinoYRef = useRef(0);
  const jumpRequestedRef = useRef(false);

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const GROUND_Y = 150;
  const DINO_SIZE = 30;
  const DINO_WIDTH = 30;
  const DINO_HEIGHT = 30;
  const OBSTACLE_MIN_GAP = 150;
  const GAME_START_DELAY = 5000; // 5 seconds

  const jump = useCallback(() => {
    if (isPlaying && !gameOver) {
      // Check if dino is on ground
      if (currentDinoYRef.current === 0 && !isJumpingRef.current) {
        jumpRequestedRef.current = true;
      }
    }
  }, [isPlaying, gameOver]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setDinoY(0);
    setDinoVelocity(0);
    setObstacles([]);
    setGameSpeed(2);
    setGameStartTime(performance.now());
    setSkyOffset(0);
    lastObstacleTimeRef.current = 0;
    isJumpingRef.current = false;
    currentDinoYRef.current = 0;
    jumpRequestedRef.current = false;
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setDinoY(0);
    setDinoVelocity(0);
    setObstacles([]);
    setGameSpeed(2);
    setSkyOffset(0);
    lastObstacleTimeRef.current = 0;
    isJumpingRef.current = false;
    currentDinoYRef.current = 0;
    jumpRequestedRef.current = false;
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentDinoY = currentDinoYRef.current;
    let currentDinoVelocity = dinoVelocity;
    let currentObstacles = [...obstacles];
    let currentScore = score;
    let currentSpeed = gameSpeed;
    let currentSkyOffset = skyOffset;
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

      // Sync currentDinoY with ref at start of each frame
      currentDinoY = currentDinoYRef.current;

      // Update sky offset for parallax effect
      currentSkyOffset += currentSpeed * 0.5;
      if (currentSkyOffset > 320) {
        currentSkyOffset = 0;
      }
      setSkyOffset(currentSkyOffset);

      // Handle jump request - check ref directly
      if (jumpRequestedRef.current) {
        if (currentDinoYRef.current === 0 && !isJumpingRef.current) {
          currentDinoVelocity = JUMP_STRENGTH;
          currentDinoY = 0.1; // Small value to start the jump
          isJumpingRef.current = true;
          jumpRequestedRef.current = false;
          // Immediately update ref and state
          currentDinoYRef.current = currentDinoY;
          setDinoY(currentDinoY);
          setDinoVelocity(currentDinoVelocity);
        } else {
          jumpRequestedRef.current = false; // Clear if can't jump
        }
      }

      // Update dino physics (always check, even if velocity was just set)
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
      } else {
        // Keep ref in sync even when not jumping
        currentDinoYRef.current = currentDinoY;
      }

      // Update obstacles
      currentObstacles = currentObstacles
        .map((obs) => ({ ...obs, x: obs.x - currentSpeed }))
        .filter((obs) => obs.x > -obs.width);

      // Add new obstacles (only after 5 seconds)
      const timeSinceStart = currentTime - gameStartTime;
      if (timeSinceStart >= GAME_START_DELAY && currentTime - lastObstacleTime > OBSTACLE_MIN_GAP * (1000 / currentSpeed)) {
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

      // Draw sky with moving dots (parallax effect)
      ctx.fillStyle = "#f7f7f7";
      const dotPositions = [
        { x: 50, y: 30 },
        { x: 120, y: 25 },
        { x: 180, y: 35 },
        { x: 250, y: 28 },
        { x: 80, y: 50 },
        { x: 150, y: 55 },
        { x: 220, y: 48 },
        { x: 280, y: 52 },
        { x: 40, y: 70 },
        { x: 110, y: 65 },
        { x: 200, y: 75 },
        { x: 270, y: 68 },
        // Duplicate set for seamless scrolling
        { x: 370, y: 30 },
        { x: 440, y: 25 },
        { x: 500, y: 35 },
        { x: 570, y: 28 },
        { x: 400, y: 50 },
        { x: 470, y: 55 },
        { x: 540, y: 48 },
        { x: 600, y: 52 },
        { x: 360, y: 70 },
        { x: 430, y: 65 },
        { x: 520, y: 75 },
        { x: 590, y: 68 },
      ];
      dotPositions.forEach((dot) => {
        const x = (dot.x - currentSkyOffset) % (canvas.width + 100);
        const adjustedX = x < 0 ? x + canvas.width + 100 : x;
        ctx.beginPath();
        ctx.arc(adjustedX, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ground
      ctx.fillStyle = "#535353";
      ctx.fillRect(0, GROUND_Y, canvas.width, 5);

      // Draw dino (proper dino shape)
      const dinoXPos = dinoX;
      const dinoYPos = GROUND_Y - DINO_HEIGHT - currentDinoY;
      
      ctx.fillStyle = "#535353";
      
      // Dino body (main rectangle)
      ctx.fillRect(dinoXPos + 5, dinoYPos + 10, DINO_WIDTH - 10, DINO_HEIGHT - 15);
      
      // Dino head
      ctx.fillRect(dinoXPos + 15, dinoYPos, 12, 12);
      
      // Dino eye
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(dinoXPos + 18, dinoYPos + 3, 3, 3);
      
      // Dino leg (front)
      ctx.fillStyle = "#535353";
      ctx.fillRect(dinoXPos + 8, dinoYPos + DINO_HEIGHT - 10, 6, 8);
      
      // Dino leg (back)
      ctx.fillRect(dinoXPos + 18, dinoYPos + DINO_HEIGHT - 10, 6, 8);
      
      // Dino tail
      ctx.fillRect(dinoXPos, dinoYPos + 15, 5, 8);

      // Draw obstacles
      ctx.fillStyle = "#535353";
      currentObstacles.forEach((obs) => {
        ctx.fillRect(obs.x, GROUND_Y - obs.height, obs.width, obs.height);
      });

      // Draw score
      ctx.fillStyle = "#535353";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${Math.floor(currentScore / 10)}`, 10, 20);
      
      // Show countdown if obstacles haven't started
      if (timeSinceStart < GAME_START_DELAY) {
        const remaining = Math.ceil((GAME_START_DELAY - timeSinceStart) / 1000);
        ctx.fillStyle = "#535353";
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`Get ready... ${remaining}`, canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "left";
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameOver, gameStartTime, skyOffset]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
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
  }, [isPlaying, gameOver, jump, startGame, resetGame]);

  const handleCanvasClick = useCallback(() => {
    if (gameOver) {
      resetGame();
      startGame();
    } else if (!isPlaying) {
      startGame();
    } else {
      jump();
    }
  }, [gameOver, isPlaying, jump, startGame, resetGame]);

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


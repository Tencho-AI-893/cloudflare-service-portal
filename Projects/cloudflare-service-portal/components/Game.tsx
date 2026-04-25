'use client';

import React, { useRef, useEffect } from 'react';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game variables
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 50,
      width: 32,
      height: 32,
      speed: 5,
      bullets: [] as Bullet[],
    };

    const enemies = [] as Enemy[];
    const clouds = [] as Cloud[];
    const crystals = [] as Crystal[];

    // Classes
    class Bullet {
      x: number;
      y: number;
      speed: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.speed = 7;
      }
      update() {
        this.y -= this.speed;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, 4, 10);
      }
    }

    class Enemy {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 2;
      }
      update() {
        this.y += this.speed;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    class Cloud {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      canvasHeight: number;
      constructor(x: number, y: number, canvasHeight: number) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 32;
        this.speed = 1;
        this.canvasHeight = canvasHeight;
      }
      update() {
        this.y += this.speed;
        if (this.y > this.canvasHeight) this.y = -this.height;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    class Crystal {
      x: number;
      y: number;
      color: string;
      hits: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.color = 'yellow';
        this.hits = 0;
      }
      update() {
        // Crystals float
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 16, 16);
      }
      hit() {
        this.hits++;
        if (this.hits === 3) this.color = 'cyan';
        else if (this.hits === 6) this.color = 'green';
        else if (this.hits === 9) this.color = 'pink';
        else if (this.hits > 10) {
          // Shatter and spawn enemy
          const index = crystals.indexOf(this);
          crystals.splice(index, 1);
          enemies.push(new Enemy(this.x, this.y));
        }
      }
    }

    // Controls
    const keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      shoot: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w') keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's') keys.down = true;
      if (e.key === 'z' || e.key === 'k') keys.shoot = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
      if (e.key === 'z' || e.key === 'k') keys.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = 'skyblue';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update player
      if (keys.left && player.x > 0) player.x -= player.speed;
      if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;
      if (keys.up && player.y > 0) player.y -= player.speed;
      if (keys.down && player.y < canvas.height - player.height) player.y += player.speed;

      // Shoot
      if (keys.shoot) {
        player.bullets.push(new Bullet(player.x + player.width / 2 - 2, player.y));
        keys.shoot = false; // Prevent continuous shooting
      }

      // Update bullets
      player.bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw(ctx);
        if (bullet.y < 0) player.bullets.splice(index, 1);
      });

      // Update clouds
      clouds.forEach(cloud => {
        cloud.update();
        cloud.draw(ctx);
      });

      // Update crystals
      crystals.forEach(crystal => {
        crystal.update();
        crystal.draw(ctx);
      });

      // Update enemies
      enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw(ctx);
        if (enemy.y > canvas.height) enemies.splice(index, 1);
      });

      // Collision detection
      player.bullets.forEach((bullet, bIndex) => {
        clouds.forEach((cloud, cIndex) => {
          if (
            bullet.x < cloud.x + cloud.width &&
            bullet.x + 4 > cloud.x &&
            bullet.y < cloud.y + cloud.height &&
            bullet.y + 10 > cloud.y
          ) {
            // Hit cloud, reveal crystal
            clouds.splice(cIndex, 1);
            crystals.push(new Crystal(cloud.x + cloud.width / 2 - 8, cloud.y + cloud.height / 2 - 8));
            player.bullets.splice(bIndex, 1);
          }
        });
        crystals.forEach((crystal) => {
          if (
            bullet.x < crystal.x + 16 &&
            bullet.x + 4 > crystal.x &&
            bullet.y < crystal.y + 16 &&
            bullet.y + 10 > crystal.y
          ) {
            crystal.hit();
            player.bullets.splice(bIndex, 1);
          }
        });
      });

      // Draw player
      ctx.fillStyle = 'blue';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      requestAnimationFrame(gameLoop);
    };

    // Initialize clouds
    for (let i = 0; i < 10; i++) {
      clouds.push(new Cloud(Math.random() * canvas.width, Math.random() * canvas.height, canvas.height));
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas ref={canvasRef} width={800} height={600} className="border" />
    </div>
  );
};

export default Game;
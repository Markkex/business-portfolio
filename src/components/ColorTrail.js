import React, { useRef, useEffect, useState } from "react";

function LightTrail() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rays, setRays] = useState([]);
  let animationFrameId;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    function draw(ray) {
      rays.map((ray, index) => {
        if (mousePosition.x === ray.x && mousePosition.y === ray.y) {
          ray.splice(index);
          rays.shift();
          return;
        }
      });

      // Add the current ray to the array of rays
      setRays([
        ...rays,
        {
          x: mousePosition.x + 50,
          y: mousePosition.y - 50,
          angle: ray.angle,
          createdAt: new Date(),
        },
      ]);

      // Remove rays that were created more than 0.5 seconds ago
      setRays((rays) => {
        return rays.filter((ray) => {
          const ageInSeconds = (new Date() - ray.createdAt) / 1000;
          return ageInSeconds < 0.5;
        });
      });

      // Draw all remaining rays on the canvas
      rays.forEach((ray) => {
        const gradient = context.createRadialGradient(
          ray.x,
          ray.y + 25,
          25,
          ray.x,
          ray.y + 25,
          50
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0.0)`);

        context.beginPath();
        context.moveTo(ray.x, ray.y);
        const x = ray.x + 200 * Math.cos(ray.angle);
        const y = ray.y + 200 * Math.sin(ray.angle);
        context.lineTo(x, y);
        context.strokeStyle = gradient;
        context.lineWidth = 2;
        context.lineCap = "round";
        context.stroke();
      });
    }

    function animate() {
      // Only draw the light trail if the mouse has moved

      // Clear the canvas to remove the shadow of the previous frame
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the current light trail
      const angle = Math.atan2(
        mousePosition.y - canvas.height / 2,
        mousePosition.x - canvas.width / 2
      );
      draw({ angle });

      // Call animate function recursively to create a loop
      animationFrameId = window.requestAnimationFrame(animate);
    }

    function handleMouseMove(event) {
      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      setMousePosition({ x, y });
    }

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    handleResize();
    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
export default LightTrail;

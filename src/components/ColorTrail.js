import React, { useRef, useEffect, useState } from "react";

function ColorTrail() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [circles, setCircles] = useState([]);
  let animationFrameId;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    function draw(color) {
      // Add the current mouse position to the array of circles
      setCircles([
        ...circles,
        {
          x: mousePosition.x,
          y: mousePosition.y,
          color: color,
          createdAt: new Date(),
        },
      ]);

      // Remove circles that were created more than 3 seconds ago
      setCircles((circles) => {
        return circles.filter((circle) => {
          const ageInSeconds = (new Date() - circle.createdAt) / 1000;
          return ageInSeconds < 0.5;
        });
      });

      // Draw all remaining circles on the canvas
      circles.forEach((circle) => {
        context.beginPath();
        context.arc(circle.x, circle.y, 20, 0, Math.PI * 2);
        context.fillStyle = circle.color;
        context.fill();
      });
    }

    function animate() {
      // Clear the canvas to remove the shadow of the previous frame
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the current color trail with semi-transparent fill color
      draw(getRandomColor());

      // Call animate function recursively to create a loop
      animationFrameId = window.requestAnimationFrame(animate);
    }

    function getMousePosition(event) {
      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      setMousePosition({ x, y });
    }

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    canvas.addEventListener("mousemove", getMousePosition);
    window.addEventListener("resize", handleResize);

    handleResize();
    animate();

    return () => {
      canvas.removeEventListener("mousemove", getMousePosition);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [circles]);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

export default ColorTrail;

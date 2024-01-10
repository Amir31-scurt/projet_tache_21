import React, { useState, useEffect } from 'react';

const CourseTimer = ({ start, stop }) => {
  const [time, setTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    // Start the timer
    if (start && !timerId) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerId(id);
    }

    // Stop the timer
    if (stop && timerId) {
      clearInterval(timerId);
      setTimerId(null);
      setTime(0); // Reset the time
    }

    // Clean up
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [start, stop]); // Removed timerId from the dependency array

  return <div>Time elapsed: {time} seconds</div>;
};

export default CourseTimer;

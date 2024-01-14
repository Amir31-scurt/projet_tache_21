// ProgressBar.jsx
function ProgressBar({ progress }) {
  const progressBarStyle = {
    width: `${progress}%`,
    backgroundColor: progress === 100 ? 'green' : 'orange',
    height: '20px',
    color: 'white',
    textAlign: 'center',
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#ddd' }}>
      <div style={progressBarStyle}>{progress}%</div>
    </div>
  );
}

export default ProgressBar;

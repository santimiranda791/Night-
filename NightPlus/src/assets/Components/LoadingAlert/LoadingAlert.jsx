import React from 'react';
import '../../../Styles//LoadingAlert.css'; // Adjust the path as necessary

export const LoadingAlert = () => {
  return (
    <div className="loader-container" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div className="loader">
        <div className="child"></div>
      </div>
      <div className="text"></div>
    </div>
  );
};

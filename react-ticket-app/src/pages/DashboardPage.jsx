import React from 'react';

const DashboardPage = () => (
  <div className="main-content app-container">
    <h2>Dashboard</h2>
    <p>Welcome back! Here's your summary.</p>
    <div className="deco-circle deco-circle-2"></div>
    <div className="grid-3" style={{marginTop: '2rem'}}>
      <div className="box">
        <h3>Total Tickets</h3>
        <p style={{fontSize: '2rem', fontWeight: 700}}>12</p>
      </div>
      <div className="box">
        <h3>Open Tickets</h3>
        <p style={{fontSize: '2rem', fontWeight: 700}}>3</p>
      </div>
       <div className="box">
        <h3>Resolved</h3>
        <p style={{fontSize: '2rem', fontWeight: 700}}>9</p>
      </div>
    </div>
  </div>
);

export default DashboardPage;
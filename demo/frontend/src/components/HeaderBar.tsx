import React from "react";

export const HeaderBar: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-mark">
          <div className="logo-s1" />
          <div className="logo-s2" />
          <div className="logo-badge" />
        </div>
        <div>
          <div className="header-title">Statuta</div>
          <div className="header-tagline">Form &amp; Process Linter for Swiss Statutes</div>
        </div>
      </div>
      <div className="header-right">
        <div className="header-pill">Demo mode · mock data only</div>
      </div>
    </header>
  );
};

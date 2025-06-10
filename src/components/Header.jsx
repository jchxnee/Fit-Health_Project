import React from 'react';

function Header() {
  return (
    <header className="header">
      <img src="/assets/header_bg.png" alt="header-bg" className="header-bg" />
      <div className="header-content">
        <div className="header-left">
          <img src="/assets/header_icon.png" alt="icon" className="header-icon" />
          <nav className="header-nav">
            <span>핏코치 매칭</span>
            <span>추천 운동</span>
            <span>커뮤니티</span>
            <span>공지사항</span>
          </nav>
        </div>
        <div className="header-right">로그인/회원가입</div>
      </div>
    </header>
  );
}

export default Header; 
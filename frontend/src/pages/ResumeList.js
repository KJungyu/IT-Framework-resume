import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeList() {
    const navigate = useNavigate();

    return (
        <div>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="brand">PassProfile</a>
                    <ul className="nav-links">
                        <li><a href="/">홈</a></li>
                        <li><a href="/resumes">이력서 작성</a></li>
                    </ul>
                </div>
            </nav>

            <main className="container">
                <h2 className="section-title">이력서 목록</h2>
                <div className="grid">
                    <div className="card" onClick={() => navigate('/editor')}>
                        <h3>1. 우리FIS 이력서 내용</h3>
                        <p>GPT 기반 이력서 평가 기능 포함</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ResumeList;

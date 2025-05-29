import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero-illustration.png';
import '../App.css';

function ResumeList() {
    const navigate = useNavigate();
    const [resumeList, setResumeList] = useState([]);

    // 🧠 컴포넌트 마운트 시 이력서 목록 불러오기
    useEffect(() => {
        axios.get("/api/resume/list")
            .then(res => setResumeList(res.data))
            .catch(err => console.error("이력서 목록 불러오기 실패:", err));
    }, []);

    return (
        <div>
            {/* ✅ 상단 네비게이션 바 */}
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="brand">Fit4Job</a>
                    <ul className="nav-links">
                        <li><a href="/">홈</a></li>
                        <li><a href="/resume/new">이력서 작성</a></li>
                    </ul>
                    <div className="auth-buttons">
                        <button className="signup-btn">회원가입</button>
                        <button className="login-btn">로그인(하기)</button>
                    </div>
                </div>
            </nav>

            {/* 📄 본문: 이력서 리스트 */}
            <div className="template-page">
                <h2 className="template-title">이력서 리스트</h2>
                <div className="template-grid">
                    {resumeList.map((resume, idx) => (
                        <div key={idx} className="template-card" onClick={() => navigate('/editor')}>
                            <h3 className="template-name">{resume.title}</h3>
                            <img src={heroImage} alt="이력서 썸네일" className="template-image" />
                            <p className="template-description">
                                {resume.rawText ? resume.rawText.slice(0, 50) + '...' : '내용 없음'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ResumeList;

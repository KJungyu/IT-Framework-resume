import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import heroImg from '../assets/hero-illustration.png';

function Home() {
    return (
        <div>
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-left">
                        <Link to="/" className="brand">Fit4Job</Link>
                        <ul className="nav-links">
                            <li><Link to="/">홈</Link></li>
                            <li><Link to="/resumes">이력서 작성</Link></li>
                        </ul>
                    </div>
                    <div className="auth-buttons">
                        <button className="btn signup">회원가입</button>
                        <button className="btn login">로그인(하기)</button>
                    </div>
                </div>
            </nav>


            <header className="hero-section">
                <div className="hero-text">
                    <span className="badge">Fit4Job에 오신 것을 환영합니다.</span>
                    <h1>회사 이력서 생성</h1>
                    <p>손쉽게 이력서를 작성하고 다양하게 활용해보세요</p>
                    <Link to="/editor" className="btn primary">지금 바로 시작하기</Link>
                </div>
                <div className="hero-image">
                    <img src={heroImg} alt="hero-illustration" />
                </div>
            </header>

            <section className="features">
                <div className="feature">
                    <h3>손쉬운 이력서 작성</h3>
                    <p>여러 템플릿 예시가 있어 회사명을 조합하여 쉽게 작성할 수 있습니다.</p>
                    <ul>
                        <li>이력서에 자주 사용되는 구성요소</li>
                        <li>실시간으로 이력서를 보면서 수정</li>
                    </ul>
                </div>
                <div className="feature">
                    <h3>다양하게 배포</h3>
                    <p>종이로 된 이력서뿐만 아니라 나만의 이력서 사이트를 만들어보세요.</p>
                    <ul>
                        <li>여러 개의 이력서를 만들 수 있어요</li>
                        <li>인터넷 주소로 된 이력서를 만들어요</li>
                    </ul>
                </div>
                <div className="feature">
                    <h3>멋진 이력서를 만들어요</h3>
                    <p>회원가입 한 번으로 어느 기기에서든지 이력서를 교환할 수 있어요.</p>
                    <ul>
                        <li>여러 이력서를 상황에 맞게 사용해요</li>
                        <li>다양한 예시 템플릿을 활용해요</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default Home;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResumeList from './pages/ResumeList';
import Editor from './pages/Editor';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resumes" element={<ResumeList />} />
                <Route path="/editor" element={<Editor />} />
            </Routes>
        </Router>
    );
}

export default App;
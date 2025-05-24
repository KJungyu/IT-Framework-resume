import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import font from '../NanumGothicCoding-normal.js';
import '../App.css';

function Editor() {
    const [resume, setResume] = useState('');
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [previewText, setPreviewText] = useState('');
    const [result, setResult] = useState(null); // { analysis, refined }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile);
        setFilename(selectedFile?.name || '');
    };

    const handleUpload = async () => {
        if (!file) return alert('파일을 선택하세요.');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { analysis, rawText, refined } = res.data;
            setResult({ analysis, refined });
            setPreviewText(rawText);
        } catch (err) {
            alert('분석 실패: ' + err.message);
            console.error(err);
        }
    };

    const handleAnalyze = async () => {
        try {
            const res = await axios.post('/api/resume/analyze', { content: resume });
            const { analysis, rawText, refined } = res.data;
            setResult({ analysis, refined });
            setPreviewText(rawText);
            setFilename('텍스트 직접 입력');
        } catch (error) {
            alert('분석 실패: ' + error.message);
            console.error(error);
        }
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        doc.addFileToVFS("NanumGothicCoding.ttf", font);
        doc.addFont("NanumGothicCoding.ttf", "NanumGothic", "normal");
        doc.setFont("NanumGothic");
        doc.setFontSize(14);

        let y = 20;

        // 페이지 1: 분석 결과
        doc.text("📊 자기소개서 분석 결과", 20, y);
        y += 10;

        const analysis = result?.analysis || {};
        const analysisText = [
            `• 문장력: ${analysis.문장력 || '없음'}`,
            `• 구체성: ${analysis.구체성 || '없음'}`,
            `• 지원동기: ${analysis.지원동기 || '없음'}`,
            `• 성장과정: ${analysis.성장과정 || '없음'}`
        ];

        analysisText.forEach((line) => {
            const wrapped = doc.splitTextToSize(line, 180);
            wrapped.forEach(w => {
                doc.text(w, 20, y);
                y += 8;
            });
        });

        // 페이지 2: 보완된 자기소개서
        doc.addPage();
        y = 20;

        doc.text("📝 보완된 자기소개서", 20, y);
        y += 10;

        if (result?.refined) {
            const refinedLines = doc.splitTextToSize(result.refined, 180);
            refinedLines.forEach((line) => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 20, y);
                y += 8;
            });
        }

        doc.save("분석결과.pdf");
    };




    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1>자기소개서 분석기</h1>

            {/* 텍스트 입력 */}
            <h3>📝 텍스트 입력</h3>
            <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                rows={10}
                cols={80}
                placeholder="자기소개서를 입력하세요..."
            />
            <br />
            <button onClick={handleAnalyze}>분석 요청</button>

            <hr />

            {/* 파일 업로드 */}
            <h3>📁 파일 업로드 (.pdf, .docx)</h3>
            <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
            <button onClick={handleUpload}>분석 요청</button>
            {filename && <p>📄 선택된 파일: {filename}</p>}

            {/* 분석 결과 */}
            {result && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>📊 분석 결과</h2>
                    <ul>
                        <li><b>문장력:</b> {result.analysis?.문장력 || '없음'}</li>
                        <li><b>구체성:</b> {result.analysis?.구체성 || '없음'}</li>
                        <li><b>지원동기:</b> {result.analysis?.지원동기 || '없음'}</li>
                        <li><b>성장과정:</b> {result.analysis?.성장과정 || '없음'}</li>
                    </ul>

                    {/* 보완된 자기소개서 */}
                    {result.refined && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3>📝 보완된 자기소개서</h3>
                            <pre style={{ background: '#f4f4f4', padding: '1rem', whiteSpace: 'pre-wrap' }}>
                {result.refined}
              </pre>
                        </div>
                    )}

                    <button onClick={handleDownloadPdf}>📥 분석 결과 PDF 저장</button>
                </div>
            )}

            {/* 원문 미리보기 */}
            {previewText && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>📎 자기소개서 원문</h3>
                    <pre style={{ background: '#f9f9f9', padding: '1rem', whiteSpace: 'pre-wrap' }}>
            {previewText}
          </pre>
                </div>
            )}
        </div>
    );
}

export default Editor;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResumeForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        phone: '',
        email: '',
        intro: '',
        timeline: [
            { date: '', title: '', description: '' }
        ]
    });

    const handleChange = (e, index, field) => {
        if (field) {
            const newTimeline = [...formData.timeline];
            newTimeline[index][field] = e.target.value;
            setFormData({ ...formData, timeline: newTimeline });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addTimelineBlock = () => {
        setFormData({
            ...formData,
            timeline: [...formData.timeline, { date: '', title: '', description: '' }]
        });
    };

    const handleSubmit = async () => {
        try {
            const result = await axios.post('/api/resume/save', formData);
            console.log('✅ 저장 성공:', result.data);
            navigate('/resumes');
        } catch (error) {
            console.error('❌ 저장 실패:', error);
        }
    };

    return (
        <div className="resume-editor">
            <h2>이력서 작성</h2>
            <div className="resume-section">
                <label>이름</label>
                <input name="name" value={formData.name} onChange={handleChange} />

                <label>직무</label>
                <input name="position" value={formData.position} onChange={handleChange} />

                <label>연락처</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />

                <label>이메일</label>
                <input name="email" value={formData.email} onChange={handleChange} />

                <label>한 줄 자기소개</label>
                <input name="intro" value={formData.intro} onChange={handleChange} />
            </div>

            <h3>📘 타임라인</h3>
            {formData.timeline.map((item, index) => (
                <div key={index} className="timeline-block">
                    <input
                        placeholder="날짜"
                        value={item.date}
                        onChange={e => handleChange(e, index, 'date')}
                    />
                    <input
                        placeholder="제목"
                        value={item.title}
                        onChange={e => handleChange(e, index, 'title')}
                    />
                    <input
                        placeholder="내용"
                        value={item.description}
                        onChange={e => handleChange(e, index, 'description')}
                    />
                </div>
            ))}
            <button onClick={addTimelineBlock}>+ 내용 추가하기</button>
            <button onClick={handleSubmit}>이력서 저장</button>
        </div>
    );
}

export default ResumeForm;

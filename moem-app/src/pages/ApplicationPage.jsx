import React, { useState } from 'react';


const MBTI_TYPES = [
    "ENFP", "INFP", "ESFP", "ENTP", "ENFJ", "ESFJ", "ESTP", "ENTJ",
    "ISFP", "INTP", "INFJ", "INTJ", "ISTJ", "ISTP", "ISFJ", "ESTJ"
];

const STRENGTHS = [
    "책임감이 강해요", "성실함이 강해요", "추진력이 강해요", "커뮤니케이션이 강해요", "분석력이 강해요"
];

const  ApplicationPage = () => {
    // 폼 상태 관리
    const [formData, setFormData] = useState({
        nameNickname: '',
        email: '',
        motiveIntro: '',
        selfIntroduction: '',
        qualification: '',
    });
    const [selectedStrengths, setSelectedStrengths] = useState([]);
    const [selectedMBTI, setSelectedMBTI] = useState('');
    const [qualificationsList, setQualificationsList] = useState([]); 
    const [newQualification, setNewQualification] = useState('');

    // 일반 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 강점 선택/해제 핸들러
    const handleStrengthToggle = (strength) => {
        setSelectedStrengths(prev => 
            prev.includes(strength)
                ? prev.filter(s => s !== strength)
                : [...prev, strength]
        );
    };

    const handleMBTISet = (mbti) => {
        setSelectedMBTI(prev => 
            prev.includes(mbti)
                ? prev.filter(s => s !== mbti)
                : [...prev, mbti]
        );
    };

    // 자격증 추가 핸들러
    const handleAddQualification = (e) => {
        if (e.key === 'Enter' && newQualification.trim() !== '') {
            e.preventDefault(); // 폼 제출 방지
            setQualificationsList(prev => [...prev, newQualification.trim().toLowerCase()]);
            setNewQualification('');
        }
    };

    // 자격증 삭제 핸들러
    const handleRemoveQualification = (qualToRemove) => {
        setQualificationsList(prev => prev.filter(q => q !== qualToRemove));
    };

    // 임시 저장 및 저장 버튼 핸들러
    const handleSave = (type) => {
        console.log(`${type} 버튼 클릭됨`);
        const dataToSave = {
            ...formData,
            strengths: selectedStrengths,
            mbti: selectedMBTI,
            qualifications: qualificationsList,
        };
        console.log('저장할 데이터:', dataToSave);
        // 여기에 실제 서버로 데이터를 전송하는 로직을 구현합니다.
    };

    return (
        <div className="mypage-container">
            <form onSubmit={(e) => e.preventDefault()} className="mypage-form">
                
                
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="nameNickname">이름 / 닉네임</label>
                        <input
                            type="text"
                            id="nameNickname"
                            name="nameNickname"
                            value={formData.nameNickname}
                            onChange={handleChange}
                            className="text-input"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-input"
                        />
                    </div>
                </div>

              
                <div className="input-group full-width">
                    <label htmlFor="motiveIntro">나의 강점*나의 자기 소개</label>
                    <input
                        type="text"
                        id="motiveIntro"
                        name="motiveIntro"
                        value={formData.motiveIntro}
                        onChange={handleChange}
                        className="text-input"
                    />
                </div>
                
               
                <div className="input-group full-width">
                    <label>나의 강점(선택)</label>
                    <div className="button-group strength-group">
                        {STRENGTHS.map(strength => (
                            <button
                                key={strength}
                                type="button"
                                className={selectedStrengths.includes(strength) ? 'tag-button selected' : 'tag-button'}
                                onClick={() => handleStrengthToggle(strength)}
                            >
                                {strength}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="input-group full-width">
                    <label>나의 MBTI(선택)</label>
                    <div className="button-group mbti-group">
                        {MBTI_TYPES.map(mbti => (
                            <button
                                key={mbti}
                                type="button"
                                className={selectedMBTI.includes(mbti) ? 'tag-button selected' : 'tag-button mbti-button'}
                                onClick={() => handleMBTISet(mbti)}
                            >
                                {mbti}
                            </button>
                        ))}
                    </div>
                </div>

                
                <div className="input-group full-width self-intro-section">
                    <label htmlFor="selfIntroduction">자기소개서</label>
                    <textarea
                        id="selfIntroduction"
                        name="selfIntroduction"
                        rows="10"
                        value={formData.selfIntroduction}
                        onChange={handleChange}
                        className="textarea-input"
                    ></textarea>
                </div>

                
                <div className="input-group full-width qualification-section">
                    <label htmlFor="newQualification">자격증</label>
                    <input
                        type="text"
                        id="newQualification"
                        placeholder="자격증을 입력하고 Enter를 누르세요"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        onKeyPress={handleAddQualification}
                        className="text-input"
                    />
                    <div className="qualification-tags">
                        {qualificationsList.map(qual => (
                            <div key={qual} className="qual-tag">
                                {qual}
                                <button type="button" onClick={() => handleRemoveQualification(qual)} className="remove-qual-btn">
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

               
                <div className="button-footer">
                    <button type="button" className="action-button temp-save" onClick={() => handleSave('임시 저장')}>
                        임시 저장
                    </button>
                    <button type="submit" className="action-button save" onClick={() => handleSave('저장')}>
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationPage;
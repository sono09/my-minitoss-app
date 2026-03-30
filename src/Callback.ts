import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    // 토스 redirect로 들어온 쿼리스트링을 확인합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      console.log('토스 인증 코드 획득!', code);
      alert('토스 연결에 성공했습니다!');
      window.location.href = '/';
    }
  }, []);

  return React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
      },
    },
    React.createElement('div', { style: { fontSize: '40px' } }, '🔄'),
    React.createElement('h2', { style: { marginTop: '20px' } }, '로그인 처리 중입니다...'),
    React.createElement('p', null, '잠시만 기다려 주세요!')
  );
};

export default Callback;


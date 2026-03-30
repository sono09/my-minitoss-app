import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    // 토스 redirect로 들어온 쿼리스트링을 확인합니다.
    // 1. 주소창에서 토스가 보낸 '인증 코드'를 쏙 뽑아옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 2. 코드를 잘 가져왔는지 확인용 창을 띄웁니다.
      console.log('토스 인증 코드 획득!', code);
      alert('토스 연결에 성공했습니다!');

      // 3. 확인 버튼을 누르면 다시 메인 화면으로 돌아가게 합니다.
      window.location.href = '/';
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: '40px' }}>🔄</div>
      <h2 style={{ marginTop: '20px' }}>로그인 처리 중입니다...</h2>
      <p>잠시만 기다려 주세요!</p>
    </div>
  );
};

export default Callback;


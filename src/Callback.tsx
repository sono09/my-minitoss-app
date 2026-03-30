import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const search = window.location.search.toLowerCase();
    const shouldDisconnect = search.includes('uninstall') || search.includes('disconnect');

    if (!shouldDisconnect) return;

    const t = window.setTimeout(() => {
      window.location.href = '/';
    }, 1000);

    return () => window.clearTimeout(t);
  }, []);

  const search = window.location.search.toLowerCase();
  const shouldDisconnect = search.includes('uninstall') || search.includes('disconnect');
  const code = new URLSearchParams(window.location.search).get('code');

  const message = shouldDisconnect ? '연결 해제 중...' : code ? '로그인 중...' : '로그인 처리 중입니다...';

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
      <h2 style={{ marginTop: '20px' }}>{message}</h2>
      <p>잠시만 기다려 주세요!</p>
    </div>
  );
};

export default Callback;


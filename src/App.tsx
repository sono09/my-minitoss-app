import React, { useState } from "react";
import { calculateFortune, FortuneResult } from "./fortuneLogic";

export const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [touched, setTouched] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const r = calculateFortune(birthDate);
    setResult(r);
  };

  const showError = touched && !result;

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo-dot" />
        <div className="logo-text">동서양 종합 운세</div>
      </header>

      <main className="app-main">
        <section className="card hero-card">
          <h1>나의 오늘 운, 한 번에 보기</h1>
          <p className="hero-sub">
            사주, 주역, 서양 점성술의 관점을 한 화면에 정리했어요.
            <br />
            생일만 입력하면 지금 나에게 필요한 키워드를 알려 드릴게요.
          </p>

          <form className="form" onSubmit={onSubmit}>
            <label className="field-label" htmlFor="birth">
              생년월일
            </label>
            <input
              id="birth"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className={`field-input ${showError ? "field-input-error" : ""}`}
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setTouched(false);
              }}
            />
            {showError && (
              <p className="field-error">정확한 생년월일을 선택해 주세요.</p>
            )}

            <button type="submit" className="primary-button">
              운세 보기
            </button>

            <p className="helper-text">
              입력하신 정보는 브라우저 안에서만 사용되며,
              <br />
              서버로 전송되지 않습니다.
            </p>
          </form>
        </section>

        {result && (
          <section className="card result-card">
            <div className="result-header">
              <span className="chip">오늘의 키워드</span>
              <h2>{result.keyword}</h2>
            </div>

            <div className="result-grid">
              <div className="pill-list">
                <div className="pill">
                  서양 별자리 <span>{result.westernZodiac}</span>
                </div>
                <div className="pill">
                  띠 <span>{result.chineseZodiac}띠</span>
                </div>
                <div className="pill">
                  오행 <span>{result.element}</span>
                </div>
              </div>

              <div className="result-body">
                <p className="result-summary">{result.summary}</p>
                <pre className="result-detail">{result.detail}</pre>

                <div className="lucky-box">
                  <div className="lucky-item">
                    <span className="lucky-label">오늘의 행운 컬러</span>
                    <span className="lucky-value">{result.luckyColor}</span>
                  </div>
                  <div className="lucky-item">
                    <span className="lucky-label">오늘의 행운 음식</span>
                    <span className="lucky-value">{result.luckyFood}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="share-button"
                onClick={async () => {
                  const text = [
                    "오늘의 동서양 종합 운세 ✨",
                    `키워드: ${result.keyword}`,
                    `서양 별자리: ${result.westernZodiac}`,
                    `띠: ${result.chineseZodiac}띠`,
                    `오행: ${result.element}`,
                    `행운 컬러: ${result.luckyColor}`,
                    `행운 음식: ${result.luckyFood}`,
                  ].join("\n");

                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: "오늘의 동서양 종합 운세",
                        text,
                      });
                    } catch {
                      // 사용자가 취소한 경우 등은 조용히 무시
                    }
                  } else if (navigator.clipboard) {
                    try {
                      await navigator.clipboard.writeText(text);
                      alert("결과를 클립보드에 복사했어요. 친구에게 바로 붙여넣기 해 보세요!");
                    } catch {
                      alert("공유 기능을 사용할 수 없어요. 직접 캡처해서 공유해 주세요!");
                    }
                  } else {
                    alert("공유 기능을 사용할 수 없어요. 직접 캡처해서 공유해 주세요!");
                  }
                }}
              >
                결과 공유하기
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <span>이 앱의 운세는 참고용이며, 중요한 결정은 항상 스스로의 판단으로 해 주세요.</span>
      </footer>
    </div>
  );
};


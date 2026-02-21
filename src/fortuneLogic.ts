export type FortuneResult = {
  westernZodiac: string;
  chineseZodiac: string;
  element: string;
  summary: string;
  detail: string;
  keyword: string;
  luckyColor: string;
  luckyFood: string;
};

const westernZodiacs = [
  { name: "물병자리", start: [1, 20], end: [2, 18] },
  { name: "물고기자리", start: [2, 19], end: [3, 20] },
  { name: "양자리", start: [3, 21], end: [4, 19] },
  { name: "황소자리", start: [4, 20], end: [5, 20] },
  { name: "쌍둥이자리", start: [5, 21], end: [6, 21] },
  { name: "게자리", start: [6, 22], end: [7, 22] },
  { name: "사자자리", start: [7, 23], end: [8, 22] },
  { name: "처녀자리", start: [8, 23], end: [9, 23] },
  { name: "천칭자리", start: [9, 24], end: [10, 22] },
  { name: "전갈자리", start: [10, 23], end: [11, 22] },
  { name: "사수자리", start: [11, 23], end: [12, 21] },
  { name: "염소자리", start: [12, 22], end: [1, 19] },
] as const;

const chineseAnimals = [
  "쥐",
  "소",
  "호랑이",
  "토끼",
  "용",
  "뱀",
  "말",
  "양",
  "원숭이",
  "닭",
  "개",
  "돼지",
] as const;

const elements = ["목", "화", "토", "금", "수"] as const;

function getWesternZodiac(month: number, day: number): string {
  for (const z of westernZodiacs) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;

    if (sm < em || (sm === em && sd <= ed)) {
      if (
        (month === sm && day >= sd) ||
        (month === em && day <= ed) ||
        (month > sm && month < em)
      ) {
        return z.name;
      }
    } else {
      // Capricorn (연말-연초 구간)
      if (
        (month === sm && day >= sd) ||
        (month === em && day <= ed) ||
        month > sm ||
        month < em
      ) {
        return z.name;
      }
    }
  }
  return "알 수 없음";
}

function getChineseZodiac(year: number): string {
  // 2020년(쥐띠)을 기준으로 12간지 순환
  const baseYear = 2020;
  const index = (year - baseYear) % 12;
  const normalizedIndex = index < 0 ? index + 12 : index;
  return chineseAnimals[normalizedIndex];
}

function getElementFromYear(year: number): string {
  // 매우 단순화된 오행 매핑 (십간 기준이 아닌 year % 10 활용)
  const idx = year % 10;
  if (idx === 0 || idx === 1) return "금";
  if (idx === 2 || idx === 3) return "수";
  if (idx === 4 || idx === 5) return "목";
  if (idx === 6 || idx === 7) return "화";
  return "토";
}

function buildStory(
  westernZodiac: string,
  chineseZodiac: string,
  element: string,
  birth: Date
): { summary: string; detail: string; keyword: string; luckyColor: string; luckyFood: string } {
  // 날짜 기반 의사난수로 오늘 테마 선택 (재현 가능)
  const seed =
    birth.getFullYear() * 10000 +
    (birth.getMonth() + 1) * 100 +
    birth.getDate();
  const moodIndex = seed % 4;

  const base =
    element === "목"
      ? "오늘은 성장 곡선 올라가는 날이에요. 잠깐만 힘줘도 쑥쑥 올라가는 느낌!"
      : element === "화"
      ? "불꽃 모드 ON. 열정 뿜뿜이라서 가만히 있기 아까운 날이에요."
      : element === "토"
      ? "루즈해 보이지만 은근 텐션 좋은 날. 안정감 있게 밀어붙이기 딱 좋아요."
      : element === "금"
      ? "갓생 챙기기 좋은 날이에요. 정리·정돈, 인간관계 정비하기 딱 좋음."
      : "감성 수치 살짝 높아진 상태. 촉이 좋아서 눈치 싸움에 강한 날이에요.";

  const mood =
    moodIndex === 0
      ? "새로 뭐든 시작해 보기 좋은 타이밍! 괜히 미루던 거 오늘 한 번 건드려봐요."
      : moodIndex === 1
      ? "지금은 속도보단 방향 체크가 중요한 날. 잠깐 멈춰서 판 다시 짜 보자구요."
      : moodIndex === 2
      ? "관계 운이 살짝 올라와 있어요. 사람 만나는 자리에서 힌트 하나 챙길 수 있어요."
      : "혼자만의 시간 필수. 머릿속 리셋하면 생각보다 빨리 답이 튀어나올 수 있어요.";

  const keyword =
    moodIndex === 0
      ? "시작 / 도전 / 직진"
      : moodIndex === 1
      ? "점검 / 정리 / 리셋"
      : moodIndex === 2
      ? "관계 / 인사이트 / 썰"
      : "휴식 / 머리비우기 / 감성";

  // 간단한 행운 컬러 / 음식 추천 (요소 + 분위기 기반)
  const colorPool =
    element === "목"
      ? ["민트", "라임 그린", "파스텔 그린"]
      : element === "화"
      ? ["코랄", "선셋 오렌지", "딥 레드"]
      : element === "토"
      ? ["베이지", "카멜 브라운", "올리브"]
      : element === "금"
      ? ["실버", "샴페인 골드", "아이보리"]
      : ["네이비", "코발트 블루", "딥 블루"];

  const foodPool =
    moodIndex === 0
      ? ["떡볶이", "버블티", "치킨", "마라샹궈"]
      : moodIndex === 1
      ? ["따뜻한 국밥", "순두부찌개", "죽", "우동"]
      : moodIndex === 2
      ? ["피자", "파스타", "샤브샤브", "연어초밥"]
      : ["아메리카노", "그린티 라떼", "초콜릿", "편의점 디저트"];

  const luckyColor = colorPool[seed % colorPool.length];
  const luckyFood = foodPool[(seed >> 2) % foodPool.length];

  const summary = `${westernZodiac} + ${chineseZodiac}띠 + ${element}의 조합으로, 전체 무드가 꽤 괜찮게 깔려 있는 날이에요.`;

  const detail = [
    `오늘의 분위기 한 줄 요약:`,
    `👉 ${base}`,
    "",
    mood,
    "",
    `서양 별자리(${westernZodiac})는 겉으로 보이는 캐릭터와 기질,`,
    `띠(${chineseZodiac}띠)는 장기적인 흐름과 인연,`,
    `오행(${element})은 에너지 방향과 텐션을 보여줘요.`,
    "",
    "세 가지가 섞여서 오늘 주는 메시지는 이거예요:",
    "▶ 지금 머릿속에 스친 그 생각, 한 번만 더 믿고 움직여 보기.",
    "",
    "너무 진지하게 모든 걸 결정하려고 애쓰지 말고,",
    "‘오늘 이 정도면 나 꽤 괜찮은데?’ 하는 느낌으로 가볍게 밀고 가 봐요.",
  ].join("\n");

  return { summary, detail, keyword, luckyColor, luckyFood };
}

export function calculateFortune(birthDate: string): FortuneResult | null {
  if (!birthDate) return null;

  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!year || !month || !day) return null;

  const westernZodiac = getWesternZodiac(month, day);
  const chineseZodiac = getChineseZodiac(year);
  const element = getElementFromYear(year);

  const story = buildStory(
    westernZodiac,
    chineseZodiac,
    element,
    new Date(year, month - 1, day)
  );

  return {
    westernZodiac,
    chineseZodiac,
    element,
    summary: story.summary,
    detail: story.detail,
    keyword: story.keyword,
    luckyColor: story.luckyColor,
    luckyFood: story.luckyFood,
  };
}


// ========== Utilities ==========

export const now = () => Date.now();
export const uid = () => Math.random().toString(36).slice(2, 10);

export function timeAgo(ts: number) {
  const s = Math.floor((now() - ts) / 1000);
  if (s < 60) return `${s}초 전`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

export function sampleText(paragraphs = 3) {
  const p = `작품의 장면 전환과 타이밍, 그리고 사운드 연출이 서로 얽히며 만들어내는 리듬이 인상적입니다.\n\n원작 대비 일부 컷 구성이 변경되었지만, 애니메이션 문법에 맞게 재배열된 지점들이 호평을 받는 듯합니다. 액션 파트의 모션 블러와 이펙트 레이어 겹침이 과하지 않으면서도 탄력을 살려 줍니다.`;
  return Array.from({ length: paragraphs })
    .map(() => p)
    .join("\n\n");
}

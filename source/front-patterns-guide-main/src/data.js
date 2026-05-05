export const sampleRows = [
  { id: "DOC-0001", title: "RFI-001 토목 옹벽 철근 간격 문의", type: "RFI", status: "결재중", priority: "High" },
  { id: "DOC-0002", title: "Submittal 콘크리트 배합설계 승인서", type: "Submittal", status: "승인", priority: "Normal" },
  { id: "DOC-0003", title: "Drawing A-101 평면도 Rev.B", type: "Drawing", status: "발송완료", priority: "Normal" },
  { id: "DOC-0004", title: "Inspection Report 거푸집 검측 결과", type: "Inspection", status: "검토중", priority: "High" },
  { id: "DOC-0005", title: "Test Report 콘크리트 28일 강도시험", type: "Test", status: "승인", priority: "Normal" },
  { id: "DOC-0006", title: "NCR 슬래브 균열 부적합 보고서", type: "NCR", status: "작성중", priority: "Critical" },
  { id: "DOC-0007", title: "Method Statement 양생 작업절차서", type: "Method", status: "결재중", priority: "Normal" },
  { id: "DOC-0008", title: "Daily Report 2026-04-30", type: "Daily", status: "발송완료", priority: "Low" },
  { id: "DOC-0009", title: "Material Receiving 철근 입고 검사", type: "MR", status: "승인", priority: "Normal" },
  { id: "DOC-0010", title: "RFI-002 건축 도장 색상 확정 요청", type: "RFI", status: "검토중", priority: "Normal" },
  { id: "DOC-0011", title: "Drawing S-201 구조도 Rev.A", type: "Drawing", status: "승인", priority: "High" },
  { id: "DOC-0012", title: "Punch List 마감 검측 지적사항", type: "Punch", status: "작성중", priority: "Normal" }
];

export const recipients = [
  "현대건설 - 김철수 PM",
  "현대건설 - 이영희 공무",
  "삼성물산 - 박민수 소장",
  "GS건설 - 최지영 품질팀장",
  "DL이앤씨 - 정태호 토목팀",
  "포스코이앤씨 - 한수진 안전팀",
  "SK에코플랜트 - 윤재석 설계",
  "롯데건설 - 강민호 시공",
  "한화건설 - 임수빈 기계",
  "두산건설 - 송하늘 전기"
];

export const documentTypes = [
  { code: "RFI", name: "Request for Information" },
  { code: "Submittal", name: "Submittal" },
  { code: "Drawing", name: "Drawing" },
  { code: "Inspection", name: "Inspection Report" },
  { code: "Test", name: "Test Report" },
  { code: "NCR", name: "Non-Conformance Report" },
  { code: "Method", name: "Method Statement" },
  { code: "Daily", name: "Daily Report" },
  { code: "MR", name: "Material Receiving" },
  { code: "Punch", name: "Punch List" },
  { code: "MoM", name: "Minutes of Meeting" },
  { code: "PR", name: "Progress Report" }
];


export const players = [
  {
    id: 1,
    name: "김민준",
    position: "단식",
    age: 24,
    number: 1,
    status: "good",       // good | caution | danger
    condition: 88,
    stats: {
      smashRate: 82,
      serveAccuracy: 75,
      netPlay: 70,
      defense: 78,
      stamina: 85,
      mental: 80,
    },
    conditionHistory: [
      { week: "3/24", score: 75 },
      { week: "3/31", score: 80 },
      { week: "4/7",  score: 72 },
      { week: "4/14", score: 88 },
    ],
    recentMatches: [
      { date: "4/14", opponent: "한국체대", result: "승", score: "21-15, 21-18" },
      { date: "4/7",  opponent: "연세대",   result: "패", score: "18-21, 19-21" },
      { date: "3/31", opponent: "고려대",   result: "승", score: "21-12, 21-16" },
    ],
  },
  {
    id: 2,
    name: "이서연",
    position: "복식",
    age: 22,
    number: 2,
    status: "caution",
    condition: 65,
    stats: {
      smashRate: 68,
      serveAccuracy: 80,
      netPlay: 85,
      defense: 72,
      stamina: 60,
      mental: 75,
    },
    conditionHistory: [
      { week: "3/24", score: 80 },
      { week: "3/31", score: 74 },
      { week: "4/7",  score: 68 },
      { week: "4/14", score: 65 },
    ],
    recentMatches: [
      { date: "4/14", opponent: "한국체대", result: "승", score: "21-19, 21-17" },
      { date: "4/7",  opponent: "연세대",   result: "승", score: "21-16, 21-13" },
      { date: "3/31", opponent: "고려대",   result: "패", score: "19-21, 21-18, 18-21" },
    ],
  },
  {
    id: 3,
    name: "박지훈",
    position: "혼합복식",
    age: 26,
    number: 3,
    status: "danger",
    condition: 42,
    stats: {
      smashRate: 78,
      serveAccuracy: 65,
      netPlay: 60,
      defense: 55,
      stamina: 40,
      mental: 58,
    },
    conditionHistory: [
      { week: "3/24", score: 78 },
      { week: "3/31", score: 65 },
      { week: "4/7",  score: 52 },
      { week: "4/14", score: 42 },
    ],
    recentMatches: [
      { date: "4/14", opponent: "한국체대", result: "패", score: "15-21, 18-21" },
      { date: "4/7",  opponent: "연세대",   result: "패", score: "14-21, 16-21" },
      { date: "3/31", opponent: "고려대",   result: "승", score: "21-18, 21-19" },
    ],
  },
  {
    id: 4,
    name: "최유나",
    position: "단식",
    age: 23,
    number: 4,
    status: "good",
    condition: 92,
    stats: {
      smashRate: 88,
      serveAccuracy: 85,
      netPlay: 78,
      defense: 82,
      stamina: 90,
      mental: 88,
    },
    conditionHistory: [
      { week: "3/24", score: 82 },
      { week: "3/31", score: 85 },
      { week: "4/7",  score: 88 },
      { week: "4/14", score: 92 },
    ],
    recentMatches: [
      { date: "4/14", opponent: "한국체대", result: "승", score: "21-10, 21-14" },
      { date: "4/7",  opponent: "연세대",   result: "승", score: "21-13, 21-15" },
      { date: "3/31", opponent: "고려대",   result: "승", score: "21-16, 21-18" },
    ],
  },
];

export const upcomingMatches = [
  { date: "4/21 (월)", opponent: "성균관대", location: "홈", type: "리그전" },
  { date: "4/28 (월)", opponent: "중앙대",   location: "원정", type: "리그전" },
  { date: "5/5 (월)",  opponent: "경희대",   location: "홈", type: "플레이오프" },
];

export const teamStats = {
  season: "2025 봄 시즌",
  wins: 8,
  losses: 3,
  winRate: 73,
  rank: 2,
  totalTeams: 10,
};

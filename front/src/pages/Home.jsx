// 기존: front/app/page.tsx + components/HomeClient.tsx
// 이전 완료 후 HomeClient 로직을 이 파일로 통합할 것
import HomeClient from '../components/HomeClient';
import eventsData from '../../public/data/events.json';
import siteData from '../../public/data/site.json';

export default function Home() {
  return <HomeClient events={eventsData} site={siteData} />;
}

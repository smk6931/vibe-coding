import HomeClient from '../components/home/HomeClient';
import siteData from '@/data/site.json';
import { useEvents } from '../lib/useEvents';

export default function Home() {
  const events = useEvents();
  return <HomeClient events={events} kakaoOpenChatUrl={siteData.kakaoOpenChatUrl} />;
}

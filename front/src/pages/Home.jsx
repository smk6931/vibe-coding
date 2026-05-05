import HomeClient from '../components/HomeClient';
import siteData from '../../public/data/site.json';
import { useEvents } from '../lib/useEvents';

export default function Home() {
  const events = useEvents();
  return <HomeClient events={events} kakaoOpenChatUrl={siteData.kakaoOpenChatUrl} />;
}

import { getGreetingText } from '../utils/greeting';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <p className="home__greeting">{getGreetingText()}</p>
    </div>
  );
}

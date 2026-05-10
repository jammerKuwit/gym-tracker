import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
  {
    to: '/',
    label: 'Home',
    end: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/log',
    label: (
      <>
        <span className="bottom-nav__label-line">Log</span>
        <span className="bottom-nav__label-line">Workout</span>
      </>
    ),
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 7h10M7 12h10M7 17h6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    ),
  },
  {
    to: '/calendar',
    label: 'Calendar',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path d="M8 3v4M16 3v4M4 11h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5M4 19h16M8 15l3-3 3 2 4-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="bottom-nav__inner">
        {tabs.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
            }
          >
            {icon}
            <span className="bottom-nav__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const homeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  </svg>
);

const exercisesIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 10h2v4H5V10zm12 0h2v4h-2V10z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M7 12h10"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <rect
      x="2"
      y="9"
      width="4"
      height="6"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <rect
      x="18"
      y="9"
      width="4"
      height="6"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.75"
    />
  </svg>
);

const progressIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 19V5M4 19h16M8 15l3-3 3 2 4-5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const logIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
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
);

const pillTabs = [
  { to: '/', end: true, label: 'Home', icon: homeIcon },
  { to: '/exercises', end: true, label: 'Add exercises', icon: exercisesIcon },
  { to: '/progress', end: true, label: 'Progress', icon: progressIcon },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="bottom-nav__cluster">
        <div className="bottom-nav__pill">
          {pillTabs.map(({ to, end, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                `bottom-nav__pill-link${isActive ? ' bottom-nav__pill-link--active' : ''}`
              }
            >
              {icon}
            </NavLink>
          ))}
        </div>
        <NavLink
          to="/log"
          end={false}
          aria-label="Log workout"
          className={({ isActive }) =>
            `bottom-nav__log${isActive ? ' bottom-nav__log--active' : ''}`
          }
        >
          {logIcon}
        </NavLink>
      </div>
    </nav>
  );
}

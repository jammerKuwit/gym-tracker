import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Calendar from './pages/Calendar';
import Home from './pages/Home';
import LogWorkout from './pages/LogWorkout';
import Progress from './pages/Progress';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="log" element={<LogWorkout />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

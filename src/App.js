import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import { ExercisesProvider } from './context/ExercisesContext';
import Exercises from './pages/Exercises';
import Home from './pages/Home';
import LogSession from './pages/LogSession';
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
      <ExercisesProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="log" element={<LogWorkout />} />
            <Route path="log/:categorySlug" element={<LogSession />} />
            <Route path="progress" element={<Progress />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ExercisesProvider>
    </BrowserRouter>
  );
}

export default App;

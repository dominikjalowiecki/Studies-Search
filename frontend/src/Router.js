import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './components/App';
import MainPage from './routes/MainPage';
import Posts from './routes/Posts';
import Post from './routes/Post';
import NotFound from './routes/NotFound';
import Profile from './routes/Profile';
import Login from './routes/Login';
import ForgotPassword from './routes/ForgotPassword';
import Register from './routes/Register';
import Activate from './routes/Activate';
import ResetPasswordConfirm from './routes/ResetPasswordConfirm';

import { RequireAuthRoute, RequireNotAuthRoute } from './utils/auth';

import { useRef } from 'react';

export default function Router() {
  const searchParamsValidated = useRef(false);

  return (
    <BrowserRouter
      basename={
        process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_BASENAME
          : '/'
      }
    >
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<MainPage />} />
          <Route path='faculties'>
            <Route
              index
              element={<Posts searchParamsValidated={searchParamsValidated} />}
            />
            <Route path=':postId' element={<Post />} />
          </Route>
          <Route
            path='activate/:uid/:token'
            element={
              <RequireNotAuthRoute>
                <Activate />
              </RequireNotAuthRoute>
            }
          />
          <Route
            path='reset-password-confirm/:uid/:token'
            element={
              <RequireNotAuthRoute>
                <ResetPasswordConfirm />
              </RequireNotAuthRoute>
            }
          />
          <Route
            path='profile'
            element={
              <RequireAuthRoute>
                <Profile />
              </RequireAuthRoute>
            }
          />
          <Route
            path='login'
            element={
              <RequireNotAuthRoute>
                <Login />
              </RequireNotAuthRoute>
            }
          />
          <Route
            path='forgot-password'
            element={
              <RequireNotAuthRoute>
                <ForgotPassword />
              </RequireNotAuthRoute>
            }
          />
          <Route
            path='register'
            element={
              <RequireNotAuthRoute>
                <Register />
              </RequireNotAuthRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

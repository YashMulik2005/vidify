import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { AuthProvider } from './components/Context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/home/Layout';
import Home from './components/home/Home';
import Auth from './components/Auth/Auth';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import InterestedArea from './components/Auth/InterestedArea';
import ChannelList from './components/channel/ChannelList';
import Test from './components/home/Test';
import ChannelIndex from './components/channel/ChannelIndex';
import YourChannel from './components/channel/YourChannel';
import VideoIndex from './components/videos/VideoIndex';
import useMain from './components/Context/MainContext';


function App() {
  const { darkstate } = useMain();
  useEffect(() => {
    const htmlTag = document.documentElement;
    if (darkstate) {
      htmlTag.classList.add('dark');
    } else {
      htmlTag.classList.remove('dark');
    }
  }, [darkstate]);


  NProgress.configure({ showSpinner: false });

  const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
      NProgress.start();

      const timeout = setTimeout(() => {
        NProgress.done();
      }, 500);

      return () => clearTimeout(timeout);
    }, [location]);

    return null;
  };

  return (
    <div className='App font-poppins'>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path='/auth' element={<Auth />}>
              <Route index element={<Login />} />
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
              <Route path='area' element={<InterestedArea />} />
            </Route>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='channel' element={<ChannelList />} />
              <Route path='channel/:id' element={<ChannelIndex />} />
              <Route path='yourchannel' element={<YourChannel />} />
              <Route path='video/:id' element={<VideoIndex />} />
              <Route path='test' element={<Test />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;

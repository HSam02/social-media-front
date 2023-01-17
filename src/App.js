import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components';
import { CreatePost, EditPost, FullPost, Home, Login, Register } from './pages';
import { fetchUser } from './redux/slices/user';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/posts/:id' element={<FullPost />} />
        <Route path='/posts/edit/:id' element={<EditPost />} />
        <Route path='/create-post' element={<CreatePost />} />
      </Routes>
    </>
  );
}

export default App;

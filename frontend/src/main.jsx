import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup.jsx'
import Signin from './components/signin.jsx'
import AddBlog from './components/AddBlog.jsx'
import BlogPage from './components/BlogPage.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/user/signup" element={<Signup />} />
      <Route path="/user/signin" element={<Signin />} />
      <Route path='/blog/add-new' element={<AddBlog/>}/>
      <Route path='/blog/:blogId' element={<BlogPage/>}/>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

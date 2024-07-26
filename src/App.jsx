
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar_compo from "./components/Navbar_compo";
import UserAuthPage from "./pages/UserAuthPage";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";
import EditorPages from "./pages/EditorPages";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import UserProfile from "./pages/UserProfile";
import BlogPage from "./pages/BlogPage";
import SideNav from "./components/SideNav";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import Notification from "./pages/Notification";
import ManageBlog from "./pages/ManageBlog";
// import { BrowserRouter } from 'react-router-dom'

 export const UserContext=createContext({})
 export const ThemeContext=createContext({});
  
function App() {

  const [userAuth,setUserAuth]=useState({})
  const [theme,setTheme]=useState('light')
  useEffect(()=>{
     let userInSession=lookInSession("user")
     let themeInsession=lookInSession("theme")

     userInSession ? setUserAuth(JSON.parse(userInSession)): setUserAuth({access_token:null})

    //  console.log(userAuth)
    if(themeInsession){
      setTheme(()=>{
        document.body.setAttribute('data-theme',themeInsession)
        return themeInsession

      })
    }else{

      document.body.setAttribute('data-theme',theme)
    }
  },[])
  
  return (
    <ThemeContext.Provider value={{theme,setTheme}}> 
    <UserContext.Provider value={{userAuth,setUserAuth}}>
     <Routes>
      <Route path="/editor" element={<EditorPages/>}/>
      <Route path="/editor/:blog_id" element={<EditorPages/>}/>
      <Route path="/" element={<Navbar_compo/>}>
      <Route index element={<HomePage/>}/>
      <Route path="dashboard" element={<SideNav/>}>
      {/* <Route path="edit-profile" element={<EditProfile/>}/> */}
      <Route path="blog" element={<ManageBlog/>}/>
      <Route path="notification" element={<Notification/>}/>
      </Route>
      <Route path="setting" element={<SideNav/>}>
      <Route path="edit-profile" element={<EditProfile/>}/>
      <Route path="change-password" element={<ChangePassword/>}/>
      </Route>
      <Route path="signin" element={<UserAuthPage type="sign-in"/>}/>
      <Route path="signup" element={<UserAuthPage type="sign-up"/>}/>
      <Route path="search/:query" element={<SearchPage/>}/>
      <Route path="/user/:id" element={<UserProfile/>}/>
      <Route path="/blog/:blog_id" element={<BlogPage/>}/>
      <Route path="*" element={<PageNotFound/>}/>

     </Route>

     </Routes>

    </UserContext.Provider>
    </ThemeContext.Provider>
     
   
  );
}

export default App;

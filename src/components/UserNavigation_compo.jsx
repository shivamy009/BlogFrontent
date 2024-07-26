import React, { useContext } from 'react'
import Page_Animation from '../common/Page_Animation'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { removeFromSession } from '../common/Session'

const UserNavigation_compo = () => {

    const {userAuth:{username},setUserAuth}=useContext(UserContext)
    const signOut=()=>{
     removeFromSession("user");
     setUserAuth({access_token:null})
    }
  return (
    <Page_Animation className=" absolute right-0 z-50" transition={{duration:0.2}}>
           <div className=' bg-white absolute right-0 border border-grey w-60  duration-200'>
            <Link to='/editor' className=' flex gap-2 link md:hidden pl-8 py-4'>

            <i className='fi fi-rr-file-edit '></i>
             <p>Write</p>
      
            </Link>

            <Link to={`/user/${username}`} className=' link pl-8 py-4'>
                  Profile
            </Link>
            <Link to='/dashboard/blog' className=' link pl-8 py-4'>
                  Dashboard
            </Link>
            <Link to='/setting/edit-profile' className=' link pl-8 py-4'>
                  Setting
            </Link>
            <span className=' absolute border-t border-grey  w-[100%]'></span>
            <button className=' text-left p-4 hover:bg-grey w-full pl-8 py-4' onClick={signOut}>
                <h1 className=' font-bold text-xl mg-1'>Sign Out</h1>
                <p className=' text-dark-grey'>@{username}</p>

            </button>

           </div>
    </Page_Animation>
  )
}

export default UserNavigation_compo
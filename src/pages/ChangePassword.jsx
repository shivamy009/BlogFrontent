import React, { useContext, useRef } from 'react'
import Page_Animation from '../common/Page_Animation'
import Input_Compo from '../components/Input_Compo'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { UserContext } from '../App'

const ChangePassword = () => {
    let {userAuth:{access_token}}=useContext(UserContext)
    let changePasswordForm=useRef()
    const handleSubmit=(e)=>{

        e.preventDefault()
        let form =new FormData(changePasswordForm.current)

        let formData={};
        for(let [key,value] of form.entries()){
            formData[key]=value
        }
        let {currentPassword,newPassword}=formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("fill all the input")
        }
       
        e.target.setAttribute("disabled",true)

        let loadingToast=toast.loading("Updating...")

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/change-password',{currentPassword:currentPassword,newPassword:newPassword},{
            headers:{
                'authorization': `${access_token}`
              }
        })
        .then(()=>{
            toast.dismiss(loadingToast)
            e.target.removeAttribute("disabled")
            return toast.success("Possword updated")
        })
        .catch(({response})=>{
            toast.dismiss(loadingToast)
            e.target.removeAttribute("disabled")
            return toast.error(response.data.error)
            // console.log(response)
        })
        
        
    }
  return (
   <Page_Animation>
    <Toaster/>
    <form ref={changePasswordForm} >
        <h1 className=' max-md:hidden'>Change Password</h1>
        <div className=' py-10 w-full md:max-w-[400px] '>
            <Input_Compo name="currentPassword" type="password" className="profile-edit-input" placeholder="current Password" icon="fi-rr-unlock"/>
            <Input_Compo name="newPassword" type="password" className="profile-edit-input" placeholder="new Password" icon="fi-rr-unlock"/>
            <button onClick={handleSubmit} className=' btn-dark px-10' type='submit'>
                Change Password
            </button>
        </div>
    </form>
   </Page_Animation>
  )
}

export default ChangePassword
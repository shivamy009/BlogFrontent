import { useContext, useRef } from 'react'
import Input_Compo from '../components/Input_Compo'
import { Link, Navigate } from 'react-router-dom'
import Page_Animation from '../common/Page_Animation'
import {Toaster,toast} from "react-hot-toast"
import axios from "axios"
import { storeInsession } from '../common/Session'
import { UserContext } from '../App'

const UserAuthPage = ({type}) => {
   // const authForm=useRef();
   let {userAuth:{access_token},setUserAuth}=useContext(UserContext)
   // console.log(access_token)

   const userauthThroughServer =async(serverRoute,formData)=>{
      // console.log(formData)
       await axios.post(import.meta.env.VITE_SERVER_DOMAIN+serverRoute,{
         fullname:formData.fullname,
         email:formData.email,
         password:formData.password
         // formData,
        }).then(({data})=>{
         // console.log(data.sendData)
         storeInsession("user",JSON.stringify(data.sendData))
         setUserAuth(data.sendData)
         toast.success(data.message)
         // console.log(sessionStorage)
         
        })
        .catch(({response})=>{
         // console.log(response)
         return toast.error(response.data.message)
        })
   }
   
   const handleSubmit=(e)=>{
      e.preventDefault()
      let serverRoute=type=="sign-in" ? "/signin" :"/signup"
   
      let  form= new FormData(formElement)
      let formData={};
   
      for(let [key,value] of form.entries()){
         formData[key]=value;
      }
   
      // console.log(formData)

      let {fullname,email,password}=formData
      // console.log(fullname,email,password)
      if(fullname){
         if(fullname.length<3){
            return toast.error("Full name must contain atleast 3 digit")
         }
      }
      if(!email.length){
         return toast.error("Enter your email")
      }

      userauthThroughServer(serverRoute,formData)
   }
  return (
   access_token ?
   <Navigate to='/'/>:

    <Page_Animation keyValue={type}>
     <section className=' h-cover flex items-center justify-center'>
      <Toaster/>
        <form id='formElement' action="" className=' w-[80%] max-w-[400px]'>
            <h1 className=' text-4xl font-gelasio capitalize text-center mb-24'>{type =='sign-in'?"Welcomebach":"Join us today"}</h1>
           
           {
            type !="sign-in" ?
            <Input_Compo name="fullname" type="text" placeholder="Full Name" icon='fi-rr-user'/>:""
           }
           <Input_Compo 
           name="email" 
           type="email"
            placeholder="Email"
             icon='fi-rr-envelope'/>
           <Input_Compo 
           name="password"
           type="password"
            placeholder="Password"
             icon='fi-rr-key'/>

             <button className='btn-dark center mt-14'
             
             type='submit'
             onClick={handleSubmit}
             >
               {
                type.replace('-'," ")
               }
             </button>
             <div className=' relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                <hr className=' w-1/2 border-black' />
                <p>or</p>
                <hr className=' w-1/2 border-black' />
                {/* <hr className='' /> */}

             </div>

             <button className=' btn-dark flex items-center justify-center gap-4 w-[90%] center'>
                {/* <img src="" alt="" /> */}
                continue With Google
             </button>
             {
                type=='sign-in'?
                <p className=' mt-6 text-dark-grey text-xl text-center'>
                    Don't have account?
                    <Link to='/signup' className=' underline text-black text-xl ml-1'>
                     Join us today
                    </Link>
                </p>
                :
                <p className=' mt-6 text-dark-grey text-xl text-center'>
                    Already a member ?
                    <Link to='/signin' className=' underline text-black text-xl ml-1'>
                    Sign In here
                    </Link>
                </p>
             }

        </form>

     </section>

    </Page_Animation>
  )
}

export default UserAuthPage
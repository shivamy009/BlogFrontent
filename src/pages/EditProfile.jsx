import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios'
import { profileDataStructure } from './UserProfile'
import Page_Animation from '../common/Page_Animation'
import Loader from '../components/Loader'
import toast, { Toaster } from 'react-hot-toast'
import Input_Compo from '../components/Input_Compo'
import { Link } from 'react-router-dom'
import uploadImage from '../utils/ImageUploader'
import { storeInsession } from '../common/Session'

const EditProfile = () => {
    let {userAuth,userAuth:{access_token},setUserAuth}=useContext(UserContext)
    let bioLimit=150;
    let profileImgEle=useRef()
    let EditprofileForm=useRef()
    let [profile,setProfile]=useState(profileDataStructure)
    let [loading,setLoading]=useState(true)
    let [characterleft,setCharacterLeft]=useState(bioLimit)
    let [updatedProfileimg,setUpdateedProfileimg]=useState(null)
    let {personal_info:{fullname,username:profile_username,profile_img,email,bio},social_links}=profile
    useEffect(()=>{
       if(access_token){
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-profile',{username:userAuth.username})
        .then(({data})=>{
           setProfile(data[0])
           setLoading(false)
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[access_token])
    const handleCharacterchange=(e)=>{
        setCharacterLeft(bioLimit-e.target.value.length)
    }
    const handleImagePreview=(e)=>{
        let img=(e.target.files[0])
        profileImgEle.current.src=URL.createObjectURL(img);
        setUpdateedProfileimg(img)
        

    }
    const handleImgUpload=async(e)=>{
        e.preventDefault();
        if(updatedProfileimg){
            // let loadingToast=toast.loading("Uploading...")
            e.target.setAttribute("disabled",true)
            // uploadImage(updatedProfileimg)
            // let imageUploadurl= await uploadImage(updatedProfileimg)
            // console.log(imageUploadurl)
            try{
               
                let imageUploadurl= await uploadImage(updatedProfileimg)
                // console.log(imageUploadurl)
                
                
                if(imageUploadurl){
                  axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/update-profile-img',{url:imageUploadurl},{
                    headers:{
                        'authorization': `${access_token}`
                      }
                  })
                  .then(({data})=>{
                    let newUserAuth={...userAuth,profile_img:data.profile_img}
                    storeInsession("user",JSON.stringify(newUserAuth))
                    setUserAuth(newUserAuth)
                    setUpdateedProfileimg(null)
                    e.target.removeAttribute("disabled")
                    toast.success("uploaded")
                  })
                  .catch(({response})=>{
                    // setUpdateedProfileimg(null)
                    e.target.removeAttribute("disabled")
                    toast.error(response.data.error)
                  })
                  
                }
                
              }
              catch(err){
              return toast.error("Error while uploading image")
              }


        }
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        let form =new FormData(EditprofileForm.current)
        let formData={};
        for(let [key,value] of form.entries()){
            formData[key]=value
        }
        let {username,bio,youtube,facebook,twitter,github,instagram,website}=formData

        if(username.length<3){
            return toast.error("Username must be 3 letter long")
        }
        if(bio.length>bioLimit){
            return toast.error("Bio should be under 150 word")

        }

        let loadingtoast=toast.loading("Updating...")
        e.target.setAttribute("disabled",true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/update-profile',{username,bio,social_links:{youtube,facebook,twitter,github,instagram,website}
        },{
            headers:{
                'authorization': `${access_token}`
              }
        })
        .then(({data})=>{
            if(userAuth.username !=data.username){
                let newUserAuth={...userAuth,username:data.username}

                storeInsession("user",JSON.stringify(newUserAuth))
                setUserAuth(newUserAuth)
 
            }
            toast.dismiss(loadingtoast)
            e.target.removeAttribute("disabled")
            toast.success("Profile updated")
        })
        .catch(({response})=>{
            console.log(response)
            toast.dismiss(loadingtoast)
            e.target.removeAttribute("disabled")
            toast.error(response.data.error)

        })
 
    }
  return (
//    access_token ? ===
   <Page_Animation>
    {
        loading ? <Loader/> :
        <form ref={EditprofileForm} >
         <Toaster/>
         <h1 className=' max-md:hidden'>Edit Profile</h1>
         <div className=' flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
            <div className=' max-lg:center mb-5'>
                <label htmlFor="uploadImg" id='profileImgLable' className=' relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                    <div className=' w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                        Upload Image
                    </div>
                    <img ref={profileImgEle} src={profile_img}  className=' ' />
                </label>
                <input type="file" id='uploadImg' accept='.jpeg, .png, .jpg' hidden onChange={handleImagePreview} />
                <button className='btn-light mt-5 max-lg:center lg:w-full px-10' onClick={handleImgUpload}>
                    Upload
                </button>

            </div>

            <div className=' w-full'>
                <div className=' grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                    <div>
                        <Input_Compo name="fullname" type="text" value={fullname} placeholder="FullName" disable={true} icon="fi-rr-user"/>
                    </div>
                    <div>
                        <Input_Compo name="email" type="email" value={email} placeholder="Email" disable={true} icon="fi-rr-envelope"/>
                    </div>

                </div>
                 <Input_Compo name="username" type="text" value={profile_username} placeholder="UserName" icon="fi-rr-at"/>
                 <p className=' text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>
                 <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className=' input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' placeholder='Bio' onChange={handleCharacterchange} id="">

                 </textarea>
                 <p className=' mt-1 text-dark-grey'>{characterleft} character left</p>
                 <p className=' my-6 text-dark-grey'>Add Your Social handle below</p>
                 <div className=' md:grid md:grid-cols-2 gap-x-6'>
                    {
                         Object.keys(social_links).map((key,i)=>{
                            let link=social_links[key];
                            // <i className={' fi '+(key!='website'  ? "fi-brands-"+key :"fi-rr-globe")+ " text-2xl hover:text-black"}></i>
                            return  <Input_Compo key={i} name={key} type="text" value={link} placeholder="https://" icon={' fi '+(key!='website'  ? "fi-brands-"+key :"fi-rr-globe")}/>
                        })
                    }

                 </div>

                 <button className='btn-dark w-auto px-10' type='submit' onClick={handleSubmit}>Update</button>

            </div>

         </div>
        </form>
    }
   </Page_Animation>
  )
}

export default EditProfile
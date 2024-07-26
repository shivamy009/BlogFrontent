import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import  Lightlogo from '../imgs/logo-light.png'
import  Darklogo from '../imgs/logo-dark.png'
import lightBanner from '../imgs/blog banner.png'
import darkBanner from '../imgs/blog banner dark.png'
import Page_Animation from '../common/Page_Animation'
import { EditorContext } from '../pages/EditorPages'
import EditorJS from '@editorjs/editorjs'
import {Toaster,toast} from "react-hot-toast"
import { tools } from './Tools_Copmo'
import uploadImage from '../utils/ImageUploader'
import axios from 'axios'
import { ThemeContext, UserContext } from '../App'
// import toast from 'react-hot-toast'


const BlogEditor_Compo = () => {
   const [image,setImage]=useState(null)
   const [url,setUrl]=useState('')
   const navigate=useNavigate()
   let {userAuth:{access_token} }=useContext(UserContext)
   let {theme} =useContext(ThemeContext)
   let {blog_id}=useParams();

  let {blog,blog:{title,banner,content,tags,des},setBlog,textEditor,setTextEditor,setEditorState,}=useContext(EditorContext)
  // console.log(blog)
  // const blogBanner=useRef()
  useEffect(()=>{
    if(!textEditor.isReady){
      setTextEditor(new EditorJS({
         holder:"textEditor",
         data:Array.isArray(content) ? content[0]:content,
         tools:tools,
         placeholder:"Lets write a awesome story"
       })
     )

    }
  },[])

  const handleBannerUpload=async(e)=>{
    try{
      // console.log(e)
      let image=e.target.files[0]
      setImage(image)
      // console.log(image)
      let imageUploadurl= await uploadImage(image)
      // console.log(imageUploadurl)
      setUrl(imageUploadurl)
      // banner=imageUploadurl
      
      if(imageUploadurl){
        toast.success("Image uploaded ")
        // console.log(banner)
        setBlog({...blog,banner:imageUploadurl})
      }
      
    }
    catch(err){
     toast.error("Error while uploading image")
    }
  }
  const handleTitleKeyDown=(e)=>{
    // console.log(e)
    if(e.keyCode==13){
      e.preventDefault()
    }

    
  }
  const handleTitleChange=(e)=>{
  // console.log(e)
  let input=e.target;
  // console.log(input.scrollHeight)
   input.style.height='auto';
   input.style.height=input.scrollHeight+'px';
   setBlog({...blog,title:input.value})

  }
  const handlePublish =()=>{
      if(!banner.length){
         return toast.error("Upload Blog Banner to Publish")
        }

        if(!title.length){
        return toast.error("Wright blog title to upload it")

      }

      if(textEditor.isReady){
        textEditor.save().then(data=>{
          if(data.blocks.length){
              setBlog({...blog,content:data});
              setEditorState("publish")
          }else{
            return toast.error("Write something in your blog to publish")
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      }
  }
  const handleError=(e)=>{
    let img=e.target;

    img.src=theme =='light' ? lightBanner :darkBanner;
  }
  const handleSaveDraft=(e)=>{
    if(e.target.className.includes("disable")){
      return;
    }
    if(!title.length){
      toast.error("Write Title before save draft")
    }
    // if(!des.length || des.length>characterlimit){
    //   toast.error(`write a description about your blog within ${characterlimit} character to publish`)
    // }
    // if(!tags.length){
    //   toast.error( "Add atleast 1 tags to publish")
    // }
    let loadingToast=toast.loading("Publishing...")
    e.target.classList.add('disable')
    if(textEditor.isReady){
      textEditor.save().then(content=>{

        let blogObj={
            title,banner,content,tags,des,draft:true
        }
        axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/create-blog',
          {...blogObj,id:blog_id},{
            headers:{
              'authorization': `${access_token}`
            }
          }
        ).then(()=>{
          e.target.classList.remove('disable')
          toast.dismiss(loadingToast);
          toast.success("Saved")
          
          setTimeout(() => {
            navigate('/')
          }, 500);
          
        })
        .catch(({response})=>{
          e.target.classList.remove('disable')
          toast.dismiss(loadingToast);
          return toast.error("Something wenti wrong")
          
        })
      })
    }


  }
  return (
    <>
    <Toaster/>
    <nav className='navbar'>
      <Link to='/' className=' flex-none w-10'>
      <img src={theme=='light' ? Darklogo : Lightlogo} alt="" />

      </Link>
      <p className=' max-md:hidden text-black line-clamp-1 w-full'>
        {
          title.length ?title:" New Blog"
        }
        
      </p>
      <div className=' flex gap-4 ml-auto'>
        <button className=' btn-dark py-2' onClick={handlePublish}>
          Publish
        </button>
        <button className=' btn-light py-2' onClick={handleSaveDraft}>
          Save Draft
        </button>
      </div>


    </nav>
    
    <Page_Animation>
      <section>
        <div className=' mx-auto max-w-[900px] w-full'>
         <div className=' relative aspect-video bg-white border-4 border-grey hover:opacity-80'>
          <label htmlFor='uploadBanner' >
            {/* {
              image ?
              <img src={image? URL.createObjectURL(image):""}  className=' z-20' />:

              <img src={defaultBanner}  className=' z-20' />
              
            } */}
            <img src={banner} onError={handleError}  className=' z-20' />

             
            <input 
            type="file"
            id='uploadBanner'
            accept='.png,.jpg,.jpeg'
            hidden
            
            onChange={handleBannerUpload}
             />

          </label>

         </div>
         <textarea 
        defaultValue={title}
         placeholder='Blog Title'
         className=' text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white '
         onKeyDown={handleTitleKeyDown}
         onChange={handleTitleChange}
         >


         </textarea>
         <hr className=' w-full opacity-10 my-5' />
         <div id='textEditor' className=' font-gelasio'>

         </div>
        </div>
      </section>
    </Page_Animation>
    </>
  )
}

export default BlogEditor_Compo
import React, { useContext } from 'react'
import Page_Animation from '../common/Page_Animation'
import toast, { Toaster } from 'react-hot-toast'
import { EditorContext } from '../pages/EditorPages'
import Tag_compo from './Tag_compo'
import axios from 'axios'
import { UserContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'

const PublishForm_compo = () => {
   let characterlimit=200;
   let taglimit=10;
   let {blog_id}=useParams()
   const navigate=useNavigate()
  let {blog,blog:{banner,title,tags,des,content},setEditorState,setBlog}=useContext(EditorContext)
  let {userAuth:{access_token} }=useContext(UserContext)
  const handleClose=()=>{
       setEditorState("editor")
  }
  // console.log(title,content.blocks[0].data.text)
  const handleBlogTitlechange=(e)=>{
    let input = e.target;
  setBlog({...blog,title:input.value})

  }
  const handleBlogDescriptionchange=(e)=>{
        let input =e.target
        setBlog({...blog,des:input.value})
  }
  const handleTitleKeyDown=(e)=>{
    // console.log(e)
    if(e.keyCode==13){
      e.preventDefault()
    }

    
  }
  const handleKeyDown=(e)=>{
    if(e.keyCode==13 || e.keyCode==138){
      e.preventDefault()
      let tag=e.target.value;
      // console.log(tag)
      if(tags.length<taglimit){
         if(!tags.includes(tag) && tag.length){
          setBlog({...blog,tags:[...tags,tag]})
         }
      }else{
        toast.error(`You can add max ${taglimit} Tags `)
      }
      e.target.value=" "
    }
  }
  const publishBlog=(e)=>{

    if(e.target.className.includes("disable")){
      return;
    }
    if(!title.length){
      return toast.error("Write Title before publish")
    }
    if(!des.length || des.length>characterlimit){
      return toast.error(`write a description about your blog within ${characterlimit} character to publish`)
    }
    if(!tags.length){
     return toast.error( "Add atleast 1 tags to publish")
    }
   
    let loadingToast=toast.loading("Publishing...")
    e.target.classList.add('disable')
    let blogObj={
        title,banner,content,tags,des,draft:false
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
      toast.success("Blog published")
      
      setTimeout(() => {
        navigate('/dashboard/blog')
      }, 500);
      
    })
    .catch(({response})=>{
      e.target.classList.remove('disable')
      toast.dismiss(loadingToast);
      return toast.error("Something went wrong")
      
    })

  }
  return (
   <Page_Animation>
    <section className=' w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
      <Toaster/>

  <button className=' w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]' onClick={handleClose}>
    <i className=' fi fi-br-cross'></i>
  </button>
  <div className=' max-w-[550px] center '>
    <p className=' text-dark-grey mb-1'>Preview</p>
    <div className=' w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
      {/* <img src={banner} alt="" /> */}
      <img src={banner} alt="" />
    </div>

    <h1 className=' text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
    <p className=' font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
    {/* <p className=' font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{content.data}</p> */}
  </div>
<div className=' border-grey lg:border-1 lg:pl-8'>
  <p className=' text-dark-grey mb-2 mt-9'>Blog Title</p>
  <input type="text" placeholder='Blog Title ' defaultValue={title} className=' input-box pl-4' onChange={handleBlogTitlechange} />
  <p className=' text-dark-grey mb-2 mt-9'>Short Description about your blog</p>
  <textarea name="" id="" maxLength={characterlimit} defaultValue={des} className=' h-40 resize-none leading-7 input-box pl-4' onChange={handleBlogDescriptionchange} onKeyDown={handleTitleKeyDown}></textarea>
  <p className=' mt-1 text-dark-grey text-sm text-right'>{characterlimit-des.length} character left</p>
  <p className=' text-dark-grey mb-2 mt-9'>Topics -(help in searching and ranking your blog)</p>
  <div className=' relative input-box pl-2 py-2 pb-4'>
    <input 
    type="text"
    placeholder='Topic'
    className=' sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white' onKeyDown={handleKeyDown}
    />

   {
    tags.map((tag,index)=>{
       return <Tag_compo tag={tag} tagindex={index} key={index}/>
    })
   }

  </div>
   <p className=' mt-1 mb-4 text-dark-grey text-right'>{taglimit-tags.length} Tags left</p>

   <button className=' btn-dark px-8' onClick={publishBlog}>
    Publish
   </button>

</div>

    </section>
   </Page_Animation>
  )
}

export default PublishForm_compo
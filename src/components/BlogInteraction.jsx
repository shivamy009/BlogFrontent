import React, { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// const

const BlogInteraction = () => {
  let {blogs,
    blogs: {_id,
        title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlogs,islikebyuser,setIslikebyuser,setCommentWrapper
  } = useContext(BlogContext);
  // console.log(blogs)
  let {userAuth:{username,access_token}}=useContext(UserContext)
  // let {blog}=useContext(BlogContext)
  // console.log(blog)
  useEffect(()=>{
       if(access_token){
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/isliked-by-user',{_id},{
          headers:{
            'authorization': `${access_token}`
          }
        })
        .then(({data:{result}})=>{
         setIslikebyuser(Boolean(result))
        })
        .catch(err=>{
          console.log(err)
        })

       }
  },[])
  const handleLike=()=>{
       if(access_token){
       setIslikebyuser(prevVal=>!prevVal)
       !islikebyuser ? total_likes++:total_likes--;
       setBlogs({...blogs,activity:{...activity,total_likes}})
       axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/like-blog',{_id,islikebyuser},{
        headers:{
          'authorization': `${access_token}`
        }
      }
       )
       .then(({data})=>{
        // console.log(data)
       })
       .catch(err=>{
        console.log(err)
       })
      //  console.log(islikebyuser)
       }else{
        toast.error("Please login to like")
        // console.log("Not loged")
       }
  }
  return (
    
      <>
      <Toaster/>
        <hr className=" border-grey my-2" />
        <div className=" flex gap-6 justify-between">
          <div className=" flex gap-3 items-center">
            <button className={"w-10 h-10 rounded-full flex items-center justify-center "+(islikebyuser ? "bg-red/20 text-red":"bg-grey/80")} onClick={handleLike}>
              <i className={"fi "+(islikebyuser ? "fi-sr-heart":"fi-rr-heart")}></i>
            </button>
            <p className=" text-xl text-dark-grey">{total_likes}</p>

            <button className=" w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={()=>setCommentWrapper(prevVal=>!prevVal)} >
              <i className="fi fi-rr-comment-dots"></i>
            </button>
            <p className=" text-xl text-dark-grey">{total_comments}</p>
          </div>

          <div className=" flex gap-6 items-center">
            {
                username==author_username ?
                <Link to={`/editor/${blog_id}`} className=" underline hover:text-purple">Edit</Link>:''
            }

            <Link to={`https//twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}>
              <i className="fi fi-brands-twitter text-2xl hover:text-twitter"></i>
            </Link>
          </div>
        </div>
        <hr className=" border-grey my-2" />
      </>
     
  );
};

export default BlogInteraction;

import React, { useContext, useState } from 'react'
import { UserContext } from '../App'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { BlogContext } from '../pages/BlogPage'

const CommentField = ({action,index=undefined,replyingTo=undefined,setReplying}) => {
  let {blogs,blogs:{_id,author:{_id:blog_author},comments,comments:{results:commentsArr},activity,activity:{total_comments,total_parent_comments}},setBlogs,setTotalparentCommentLoaded}=useContext(BlogContext)
    const [comment,setComment]=useState("")
    let {userAuth:{access_token,username,fullname,profile_img}}=useContext(UserContext)
    const handleComment=()=>{
      if(!access_token){
        return toast.error("Login first to leave comment")
      }
      if(!comment.length){
        return toast.error("write someting to leave comment")
      }
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/add-comment',{
         _id,blog_author,comment,replying_to:replyingTo
        },{
          headers:{
            'authorization': `${access_token}`
          }
        })
        .then(({data})=>{
          // console.log(data)
          setComment("");
          data.commented_by={personal_info:{username,profile_img,fullname}}
          let newCommentArr;
          if(replyingTo){
             commentsArr[index].children.push(data._id);
             data.childrenLevel=commentsArr[index].childrenLevel+1;
             data.parentIndex=index;
             commentsArr[index].isReplyLoaded=true;
             commentsArr.splice(index+1,0,data)

             newCommentArr=commentsArr
             setReplying(false)

          }else{

            data.childrenLevel=0;
            newCommentArr=[data,...commentsArr]
          }
          let parenCommentIncrementVal= replyingTo ? 0: 1;
          setBlogs({...blogs,comments:{...comments,results:newCommentArr},activity:{...activity,total_comments:total_comments+1,total_parent_comments:total_parent_comments + parenCommentIncrementVal}})

          setTotalparentCommentLoaded(prevVal=>prevVal+parenCommentIncrementVal)
          

        })
        .catch(err=>{
          console.log(err)
        })
      
    }
  return (
     <>
     <Toaster/>
     <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder='Leave a comment' className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'></textarea>
     <button className='btn-dark mt-5 px-10 ' onClick={handleComment}>
       {action}
     </button>
     </>
  )
}

export default CommentField
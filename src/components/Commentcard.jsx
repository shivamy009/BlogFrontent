import React, { useContext, useState } from 'react'
import { getDay } from '../common/Date'
import { UserContext } from '../App'
import toast, { Toaster } from 'react-hot-toast'
import CommentField from './CommentField'
import { BlogContext } from '../pages/BlogPage'
import axios from 'axios'

const Commentcard = ({index,leftVal,commentData}) => {
  // let {userAuth:{access_token,username}}=useContext(UserContext)
    // const [isReply,setReply]=useState(false)
    // let {commented_by:{personal_info:{profile_img,fullname,username:commented_by_username}},commentedAt,comment,_id,children}=commentData
    // let {blogs,blogs:{comments,activity,activity:{total_parent_comments},comments:{results:commentsArr},author:{personal_info:{username:blog_author}}},setBlogs,setTotalparentCommentLoaded}=useContext(BlogContext)
    let { userAuth: { access_token, username } } = useContext(UserContext);

const [isReply, setReply] = useState(false);

// Check if commentData exists and commented_by is not null or undefined
let profile_img = "";
let fullname = "";
let commented_by_username = "";
let commentedAt = "";
let comment = "";
let _id = "";
let children = [];

if (commentData && commentData.commented_by && commentData.commented_by.personal_info) {
  profile_img = commentData.commented_by.personal_info.profile_img || "";
  fullname = commentData.commented_by.personal_info.fullname || "";
  commented_by_username = commentData.commented_by.personal_info.username || "";
  commentedAt = commentData.commentedAt || "";
  comment = commentData.comment || "";
  _id = commentData._id || "";
  children = commentData.children || [];
}

let {
  blogs,
  blogs: {
    comments,
    activity = {},
    activity: { total_parent_comments = 0 } = {},
    comments: { results: commentsArr = [] } = {},
    author: { personal_info: { username: blog_author = "" } = {} } = {},
  } = {},
  setBlogs,
  setTotalparentCommentLoaded,
} = useContext(BlogContext);

    const getParentIndex=()=>{
        let startingPoint=index-1;
        try{
           while(commentsArr[startingPoint].childrenLevel>=commentData.childrenLevel){
            startingPoint--;
           }
        }
        catch{
              startingPoint=undefined 
        }

        return startingPoint

    }
    const removeCommentsCars=(startingPoint,isDelete=false)=>{
          if(commentsArr[startingPoint]){
            while(commentsArr[startingPoint].childrenLevel >commentData.childrenLevel){
                   commentsArr.splice(startingPoint,1)
                   if(!commentsArr[startingPoint]){
                            break;
                   }
            }
          }
          if(isDelete){
            let parentIndex=getParentIndex();
            if(parentIndex !=undefined){
                commentsArr[parentIndex].children=commentsArr[parentIndex].children.filter(child=> child !=_id)

                if(commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isReplyLoaded=false;
                }
            }
            commentsArr.splice(index,1)

          }
          if(commentData.childrenLevel==0 && isDelete){
            setTotalparentCommentLoaded(prevVal=>prevVal-1)
          }

          setBlogs({...blogs,comments:{results:commentsArr},activity:{...activity,total_parent_comments:total_parent_comments-(commentData.childrenLevel==0  && isDelete ? 1:0)}})

    }
    const loadReplies=({skip=0,currentIndex=index})=>{
        if(commentsArr[currentIndex].children.length){
            hideReplies();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-replies',{_id:commentsArr[currentIndex]._id,skip})
            .then(({data:{replies}})=>{
                // console.log(replies)
                commentsArr[currentIndex].isReplyLoaded=true;
                for(let i=0;i<replies.length;i++){
                    replies[i].childrenLevel=commentsArr[currentIndex].childrenLevel+1;

                    commentsArr.splice(currentIndex+1+i+skip,0,replies[i])
                }
                setBlogs({...blogs,comments:{...comments,results:commentsArr}})
            })
            .catch(err=>{
                console.log(err)
            })
        }
            
    }

    const deleteComments=(e)=>{
        e.target.setAttribute("disabled",true)
        // console.log("click")
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/delete-comment',{_id},{
            headers:{
                'authorization': `${access_token}`
              }
        })
        .then(()=>{
            e.target.removeAttribute("disable")
            removeCommentsCars(index+1,true)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const hideReplies =()=>{
        commentData.isReplyLoaded=false;
        removeCommentsCars(index+1)
    }
    const handleReply=()=>{
        if(!access_token){
            return toast.error("Login first")
        }
        setReply(prevVal=>!prevVal)
    }

    const LoadMoreRepliesbutton=()=>{
        let parentIndex=getParentIndex();
        let button =<button className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={()=>loadReplies({skip:index-parentIndex,currentIndex:parentIndex})}>
        Load More reply
    </button>
        if(commentsArr[index+1]){
            if(commentsArr[index+1].childrenLevel < commentsArr[index].childrenLevel){
         if(index-parentIndex <commentsArr[parentIndex].children.length){
        return button

         }

            }
        }else{
            if(parentIndex){
                if(index-parentIndex <commentsArr[parentIndex].children.length){
                     return button;
            
                     }
            }
        }
    }

  return (
    <div className=' w-full ' style={{paddingLeft:`${leftVal*10}px`}}>
        {/* <Toaster/> */}
        <div className=' my-5 p-6 rounded-md border border-grey'>
            <div className=' flex gap-3 items-center mb-8'>
                <img src={profile_img} alt="" className=' w-6 h-6 rounded-full' />
                <p className=' line-clamp-1'>{fullname} @{commented_by_username}</p>
                <p>{getDay(commentedAt)}</p>

            </div>
            <p className=' font-gelasio text-xl ml-3'>{comment}</p>
            <div className=' flex gap-5 items-center mt-5'>
                {
                    commentData.isReplyLoaded ? 
                    <button className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={hideReplies}>
                   <i className='fi fi-rs-comment-dots'></i> Hide reply
                    </button>:
                    <button className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={loadReplies}>
                     <i className='fi fi-rs-comment-dots'></i> {children.length}
                    </button>
                }
            <button className=' underline' onClick={handleReply}>
            Reply
            </button>
            {
                username==commented_by_username  ||  username== blog_author ?
                <button className=' p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex  items-center' onClick={deleteComments}>
           <i className='fi fi-rr-trash pointer-events-none'></i>
                </button>
                :""
            }

            </div>
            {
                isReply ?
                <div className=' mt-8 '>
                    <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReply}/>
                </div>
                :""
            }

        </div>
        <LoadMoreRepliesbutton/>
        
    </div>
  )
}

export default Commentcard

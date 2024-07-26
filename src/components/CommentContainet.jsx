import React, { useContext } from 'react'
import { BlogContext } from '../pages/BlogPage'
import CommentField from './CommentField'
import axios from 'axios';
import NodataMessage from './NodataMessage';
import Page_Animation from '../common/Page_Animation';
import Commentcard from './Commentcard';
// import e from 'cors';

export const fetchComments=async({skip=0,blog_id,setparentCoummentfun,comment_array=null})=>{
    let res;
    await  axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-blog-comment',{blog_id,skip})
    .then(({data})=>{
        data.map(comment=>{
            comment.childrenLevel=0;

        })

        setparentCoummentfun(prevVal=>prevVal+data.length)
        if(comment_array==null){
            res={results:data}
            
        }else{
            res={results:[...comment_array,...data]}
        }
    })


    return res;


    
}

const CommentContainet = () => {
    let {blogs,setBlogs,blogs:{_id,title,comments:{results:commetsArr},activity:{total_parent_comments}},commentwrapper,setCommentWrapper,totalparentCommentLoaded,setTotalparentCommentLoaded}=useContext(BlogContext)
    // console.log(commetsArr)
    // console.log("j",blogs)
    const loadMoreComment=async()=>{
        let newcommentArr= await fetchComments({skip:totalparentCommentLoaded,blog_id:_id,setparentCoummentfun:setTotalparentCommentLoaded,comment_array:commetsArr})
        setBlogs({...blogs,comments:newcommentArr})
        
    }
  return (
    <div className={' max-sm:w-full fixed '+ (commentwrapper ? 'top-0 sm:right-0':' top-[100%] sm:right-[-100%]') +' duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden'}>
        <div className=' relative '>
            <h1 className=' text-xl font-medium'>
                Comments
            </h1>
            <p className=' text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>{title}</p>
            <button className=' absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey' onClick={()=>setCommentWrapper(prevVal=>!prevVal)}>
                <i className='fi fi-br-cross text-2xl mt-1 '></i>
            </button>

        </div>
        <hr className=' border-grey my-8 w-[120%] -ml-10 ' />
        <CommentField action='comment'/>
        {
        commetsArr && commetsArr.length ?
        commetsArr.map((comment,i)=>{
            return <Page_Animation key={i}>
                <Commentcard index={i} leftVal={comment.childrenLevel*4} commentData={comment}/>

            </Page_Animation>
        }):<NodataMessage Message="No comments"/>
        }
        {
           total_parent_comments >totalparentCommentLoaded ?
           <button className=' text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={loadMoreComment}>
            Load More
           </button>:
           ""
        }
    </div>
  )
}

export default CommentContainet
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Page_Animation from '../common/Page_Animation';
import Loader from '../components/Loader';
import { getDay } from '../common/Date';
import BlogInteraction from '../components/BlogInteraction';
import BlogPostCard from '../components/BlogPostCard';
import BlogContent from '../components/BlogContent';
import CommentContainet, { fetchComments } from '../components/CommentContainet';

export const blogStructure={
    title:'',
    des:'',
    content:[],
    
    author:{personal_info:{}},
    banner:'',
    publishedAt:''

}
export const BlogContext=createContext({})
const BlogPage = () => {
    let {blog_id}=useParams();
    let [blogs,setBlogs]=useState(blogStructure)
    let [similarblog,setSimilarBlog]=useState(null)
    const [loading,setLoading]=useState(true)
    const [islikebyuser,setIslikebyuser]=useState(false)
    const [commentwrapper,setCommentWrapper]=useState(false)
    const [totalparentCommentLoaded,setTotalparentCommentLoaded]=useState(0)


    let {title,content,banner,author:{personal_info:{fullname,username:author_userame,profile_img}},publishedAt}=blogs
    // console.log("y",tags[0])
    
    const fetchBlog=async()=>{
       await axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-blog',{blog_id})
       .then(async({data:{blog}})=>{
        //    console.log("before",blog)

         blog.comments=await fetchComments({blog_id:blog._id,setparentCoummentfun:setTotalparentCommentLoaded})

        //  console.log("after",blog)
           setBlogs(blog)

             axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/search-blogs',{tag:blog.tags[0],limit:6,eliminate_blog:blog_id})
            .then(({data})=>{
                setSimilarBlog(data.blog)
                // console.log("firsti",data.blog)
            })
             
            setLoading(false)
            
        })
        .catch(err=>{
            console.log(err)
            setLoading(false)
        })
    }
    
    useEffect(()=>{
        resetState()
            fetchBlog()

            
    },[blog_id])
    // console.log("first",tags)
    const resetState=()=>{
        setBlogs(blogStructure)
        setSimilarBlog(null)
        setLoading(true)
        setIslikebyuser(false)
        setCommentWrapper(false)
        setTotalparentCommentLoaded(0)
    }
    // console.log("firsti",content)

    return (
        <Page_Animation>
        {
            loading ? <Loader/>:
            <BlogContext.Provider value={{blogs,setBlogs,islikebyuser,setIslikebyuser,commentwrapper,setCommentWrapper,totalparentCommentLoaded,setTotalparentCommentLoaded}}> 
            <CommentContainet/>
            <div className=' max-w-[900px] center py-10 max-lg:px-[5vw]'>
                <img src={banner} className=' aspect-video ' alt="" />
                <div className=' mt-12'>
                    <h2>{title}</h2>
                    <div className=' flex max-sm:flex-col justify-between my-8 '>
                        <div className=' flex gap-5 items-start'>
                        <img src={profile_img} className=' w-12 h-12 rounded-full' alt="" />
                        <p className=' capitalize'>
                            {fullname}
                            <br />
                            @
                            <Link to={`/user/${author_userame}`} className=' underline'>{author_userame}</Link>
                        </p>

                        </div>
                        <p className=' text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {getDay(publishedAt)}</p>
                    </div>

                </div>
                
                <BlogInteraction/>
               <div className=' my-12 font-gelasio blog-page-content'>
                    {
                        content[0]?.blocks?.map((block,i)=>{
                            return <div key={i} className=' my-4 md:my-8'>
                               <BlogContent block={block}/>
                            </div>
                        })
                    }
               </div>

                <BlogInteraction/>
                {
                    similarblog !=null && similarblog.length ?
                    <>
                    <h1 className=' mt-14 text-2xl mb-10 font-medium'>Similar Blog</h1>
                    {
                        similarblog?.map((blog,i)=>{
                            let {author:{personal_info}}=blog;
                            return <Page_Animation key={i} transition={{duration:1,delay:i*0.08}}>
                                <BlogPostCard content={blog} author={personal_info}/>
                            </Page_Animation>
                        })
                    }
                    </>
                    :""
                }

            </div>
            </BlogContext.Provider>
        }
    </Page_Animation>
  )
}

export default BlogPage

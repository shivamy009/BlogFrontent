import React from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../common/Date'

const MiniMalBlogPost_compo = ({blog,index}) => {
    // let {title,blog_id:id,author:{personal_info:{fullname,username,profile_img}},publishedAt}=blog
      const {
      title,
      blog_id: id,
      author = {}, // Default to empty object in case author is null/undefined
      publishedAt
    } = blog || {};
  
    // Check if author and personal_info exist before destructuring
    const { personal_info = {} } = author || {};
    const { fullname = 'Unknown', username = 'unknown', profile_img = '' } = personal_info;
  return (
   <Link to={`/blog/${id}`} className=' flex gap-5 mb-8'>
    <h1 className='blog-index'>{index <10 ? "0"+(index+1):index}</h1>
   <div>
   <div className=' flex gap-2 items-center mb-7'>
        <img src={profile_img} alt="" className=' w-6 h-6 rounded-full' />
        <p className=' line-clamp-1'>{fullname} @{username}</p>
        <p className=' min-w-fit'>{getDay(publishedAt)}</p>
    </div>
    <h1 className='blog-title'>{title}</h1>
   </div>
   </Link>
  )
}

export default MiniMalBlogPost_compo

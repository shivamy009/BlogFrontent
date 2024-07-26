import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { UserContext } from '../App'
import { filterPageInation } from '../common/FilterPagination'
import { Toaster } from 'react-hot-toast'
import InpageNavigation_compo from '../components/InpageNavigation_compo'
import Loader from '../components/Loader'
import NodataMessage from '../components/NodataMessage'
import Page_Animation from '../common/Page_Animation'
import { ManageBlogCard, ManagedraftBlogPost } from '../components/ManageBlogCard'
import LoadMore_compo from '../components/LoadMore_compo'
// import ManageBlogCard, { ManagedraftBlogPost } from '../components/ManageBlogCard'

const ManageBlog = () => {
  let [blogs,setBlogs]=useState(null)
  let [drafts,setDrafts]=useState(null)
  let [query,setQuery]=useState("")
  let {userAuth:{access_token}}=useContext(UserContext)

  const getBlogs=({page,draft,deletedDocCount=0})=>{
    
    axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/user-written-blog',{page,draft,deletedDocCount,query},{
      headers:{
        'authorization': `${access_token}`
      }
    })
    .then(async({data})=>{
      let formatedData=await filterPageInation({
        state:draft ? drafts:blogs,
        data:data.blogs,
        page,
        user:access_token,
        countRoute:'/user-written-blog-count',
        data_to_send:{draft,query}
      })
      // console.log("draft=>"+draft,formatedData)

      if(draft){
        setDrafts(formatedData)

      }else{
        setBlogs(formatedData)
      }
    })
    .catch(err=>{
      console.log(err)
    })

  }
  const handleSearch=(e)=>{

    let searchQuery=e.target.value
    setQuery(searchQuery)
    if(e.keyCode==13 && searchQuery.length){
      setBlogs(null)
      setDrafts(null)
      
      
      
    }
    
  }
  const handleChange=(e)=>{
    if(!e.target.value.length){
      setQuery('')
      setBlogs(null)
      setDrafts(null)


    }
          
  }
  useEffect(()=>{
        if(access_token){
          if(blogs==null){
            getBlogs({page:1,draft:false})
          }
          if(drafts==null){
            getBlogs({page:1,draft:true})
          }
        }
  },[access_token,blogs,drafts,query])
  return (
     <>
     <h1 className=' max-md:hidden'>Manage Blog</h1>
     <Toaster/>
     <div className=' relative max-md:mt-5 md:mt-8 mb-10'>
      <input 
      type="search"
      className=' w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey '
      placeholder='Search Blogs'
      onChange={handleChange}
      onKeyDown={handleSearch}
      
      />
      <i className=' fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>


     </div>
     <InpageNavigation_compo routes={["Published Blogs","Drafts"]}>
             {//publishdeblog
             blogs==null ?<Loader/>:
             blogs.results.length ? 
             <>
             {
               blogs.results.map((blog,i)=>{
                return <Page_Animation key={i} transition={{delay:i*0.04}}>
                   <ManageBlogCard blog={{...blog,index:i,setStateFun:setBlogs}}/>


                </Page_Animation>
               })
             }
            
            <LoadMore_compo state={blogs} fetchDatafun={getBlogs} additionalParams={{draft:false,deletedDocCount:blogs.deletedDocCount}}/>
              </>
             :<NodataMessage Message="No published blog"/>

              
             }

             {//draft
             drafts==null ?<Loader/>:
             drafts.results.length ? 
             <>
             {
               drafts.results.map((blog,i)=>{
                return <Page_Animation key={i} transition={{delay:i*0.04}}>

                   {/* <ManageBlogCard blog={blog}/> */}
                   <ManagedraftBlogPost blog={{...blog,index:i,setStateFun:setDrafts}}  />

                </Page_Animation>
               })
             }
              <LoadMore_compo state={drafts} fetchDatafun={getBlogs} additionalParams={{draft:true,deletedDocCount:drafts.deletedDocCount}}/>
              </>
             :<NodataMessage Message="No published blog"/>

              
             }

             {/* <h1>This is draft blog</h1> */}
     </InpageNavigation_compo>
     </>
  )
}

export default ManageBlog
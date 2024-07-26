import React, { useEffect, useState } from 'react'
import Page_Animation from '../common/Page_Animation'
import InpageNavigation_compo, { activeTabRef } from '../components/InpageNavigation_compo'
import axios from 'axios'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPostCard'
import MiniMalBlogPost_compo from '../components/MiniMalBlogPost_compo'
import NodataMessage from '../components/NodataMessage'
import { filterPageInation } from '../common/FilterPagination'
import LoadMore_compo from '../components/LoadMore_compo'

const HomePage = () => {
  let [blogs,setBlogs]=useState(null)
    
  let [trandingblogs,setTrandingblog]=useState(null)
  let [pagestate,setPagestate]=useState("home")
  let categories=["Programming","Travel","Photography","Social Media","Politics","Finance","Organic Garden","Food"]
  const fetchlatestBlog=({page=1})=>{
     axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/latest-blogs',{page})
     .then(async({data})=>{

      // console.log(data.blog)
      let formatedData= await filterPageInation({
        state:blogs,
        data:data.blog,
        page:page,
        countRoute:"/all-latest-blogs-count"

      })
      setBlogs(formatedData)
      // console.log(formatedData)
     })
     .catch(e=>{
      console.log(e)
     })
  }
  const fetchTrandingBlog=()=>{
     axios.get(import.meta.env.VITE_SERVER_DOMAIN +'/tranding-blogs')

     .then(({data})=>{
      // console.log(data)
      setTrandingblog(data.blog)
     })
     .catch(e=>{
      console.log(e)
     })
    }
    // console.log(trandingblogs)
    const fetchBlogBycategory= ({page=1})=>{
    axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/search-blogs',{tag:pagestate,page})

    .then(async({data})=>{
      let formatedData= await filterPageInation({
        state:blogs,
        data:data.blog,
        page,
        countRoute:"/search-blogs-count",
        data_to_send:{tag:pagestate}

      })
      setBlogs(formatedData)
     // console.log(data)
    //  setBlogs(data.blog)
    })
    .catch(e=>{
     console.log(e)
    })


  }
  const loadBycategory=(e)=>{
    let category=e.target.innerText;
    // console.log(category)
    setBlogs(null)
    if(pagestate==category){
      setPagestate("home")
      return;
    }
    setPagestate(category)
    // console.log(pagestate)
    // console.log(category==pagestate)
  }

  useEffect(()=>{
    activeTabRef.current.click()
    if(pagestate=="home"){
      fetchlatestBlog({page:1})
    }else{
      fetchBlogBycategory({page:1});
    }
    if(!trandingblogs){
      fetchTrandingBlog()
    }
  },[pagestate])
  return (
    <Page_Animation>
        <section className='h-cover flex justify-center gap-10'>
                {/* letest blog */}
            <div className=' w-full'>
          <InpageNavigation_compo routes={[pagestate,"trending blogs"]} defaultHidden={["trending blogs"]}>

       <>
       {
        blogs==null ?(<Loader/>):
        (
          blogs.results.length ?
       blogs.results.map((blog,i)=>{
        return <Page_Animation key={i} transition={{duration:1,delay:i*.1}}>
            <BlogPostCard content={blog} author={blog.author.personal_info}/>
        </Page_Animation>
       })
       :<NodataMessage Message={"No blogs Published"}/>
      )
      }
      <LoadMore_compo state={blogs} fetchDatafun={(pagestate=="home" ? fetchlatestBlog :fetchBlogBycategory)}/>
       </>
     
     {
      trandingblogs==null ?(<Loader/>):
      (
        trandingblogs.length ?
     trandingblogs.map((blog,i)=>{
      return <Page_Animation key={i} transition={{duration:1,delay:i*.1}}>
           <MiniMalBlogPost_compo blog={blog} index={i}/>
      </Page_Animation>
     })
     :<NodataMessage Message={"No trending blogs Published"}/>
    )

     }
          </InpageNavigation_compo>


            </div>
                {/* field and trending blog */}
            <div className=' min-w-[40%] lg:min-w-[400px] max-w-min border border-1 border-grey pl-8 pt-3 max-md:hidden'>
              <div className=' flex flex-col gap-10'>
                <div>

                 
                <h1>Stories from all interests</h1>
                <div className=' flex gap-3 flex-wrap'>
                  {
categories.map((category,i)=>{
  return <button key={i} className={'tag text-purple ' + (pagestate==category ? 'bg-black text-white ':' ' )} onClick={loadBycategory}>
    {category}
  </button>
})
                  }

                </div>

                </div>
                {/* <LoadMore_compo state={blogs} fetchDatafun={fetchBlogBycategory}/> */}

             
              <div className=''>
                <h1 className=' font-medium text-xl mb-8'>Trending<i className=' fi fi-rr-arrow-trend-up'></i></h1>
                {
      trandingblogs==null ?(<Loader/>):
      (
        trandingblogs.length ?
     trandingblogs.map((blog,i)=>{
      return <Page_Animation key={i} transition={{duration:1,delay:i*.1}}>
           <MiniMalBlogPost_compo blog={blog} index={i}/>
      </Page_Animation>
     })
     :
     <NodataMessage Message={"No blogs Published"}/>
    )

     }
              </div>

            </div>
            </div>

        </section>
    </Page_Animation>
  )
}

export default HomePage
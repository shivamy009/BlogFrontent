import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InpageNavigation_compo from '../components/InpageNavigation_compo';
import Loader from '../components/Loader';
import Page_Animation from '../common/Page_Animation';
import BlogPostCard from '../components/BlogPostCard';
import NodataMessage from '../components/NodataMessage';
import LoadMore_compo from '../components/LoadMore_compo';
import axios from 'axios';
import { filterPageInation } from '../common/FilterPagination';
import UserCard from '../components/UserCard';

const SearchPage = () => {
    let {query}=useParams();
   let [blogs,setBlogs]=useState(null)
   let [users,setUsers]=useState(null)

   const SearchBlogs=({page=1,create_new_arr=false})=>{
    axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blogs",{query,page})
    .then(async({data})=>{

        console.log(data.blog)
        let formatedData= await filterPageInation({
          state:blogs,
          data:data.blog,
          page:page,
          countRoute:"/search-blogs-count",
          data_to_send:{query},
          create_new_arr
  
        })
        setBlogs(formatedData)
        // console.log(formatedData)
       })
       .catch(e=>{
        console.log(e)
       })

           
   }
   const fetchUsers=()=>{
    axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-users",{query})
    .then(({data:{users}})=>{
      // console.log("HI",users)
        setUsers(users);
    })

   }

   useEffect(()=>{
    resetState()
    SearchBlogs({page:1,create_new_arr:true});
    fetchUsers()
   },[query])
   const resetState=()=>{
    setBlogs(null);
    setUsers(null)
   }

   const UsercardWrapper=()=>{
    return(
      <>
      {
        users ==null ?<Loader/> :
        users.length ?
        users.map((user,i)=>{
          return <Page_Animation key={i} transition={{duration:1,delay:i*0.08}}><UserCard user={user}/></Page_Animation>
        })
        :<NodataMessage Message={"No user Found"}/>
      }
      </>
    )
   }
   

  return (
     <section className='h-cover flex justify-center gap-10'>
        <div className=' w-full '>
            <InpageNavigation_compo routes={[`Search Results from ${query}`,"Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
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
            <LoadMore_compo state={blogs} fetchDatafun={SearchBlogs}/>
           </>

  <UsercardWrapper/>

           
            </InpageNavigation_compo>

        </div>

        <div className=' min-w-[40%] lg:min-w-[350px] max-w-min border-1  border-grey pl-8 pt-3  max-md:hidden'>
          <h1 className=' font-medium text-xl mb-8'>
            User related to search
          <i className=' fi fi-rr-user mt-1'></i>

          </h1>
          <UsercardWrapper/>

        </div>

     </section>
  )
}

export default SearchPage
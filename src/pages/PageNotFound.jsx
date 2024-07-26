import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
   <section className=' h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
    <h1 className=' flex justify-center items-center text-center font-bold text-4xl font-gelasio'>Sorry Page Not Found</h1>
     <p>This page does not exist.Click here to back <Link to='/' className=' text-black underline'>Home Page</Link></p>
   </section>
  )
}

export default PageNotFound
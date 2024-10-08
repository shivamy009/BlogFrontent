import React, { useState } from 'react'

const Input_Compo = ({name,type,id,value,placeholder,icon,disable=false}) => {
    const[passwordVisible,setpasswordVisible]=useState(false)
  return (
    <div className=' relative w-[100%] mb-4'>
     <input
      type={ type=='password'? passwordVisible ? "text" : "password":type}
     name={name}
     placeholder={placeholder}
     defaultValue={value}
     id={id}
     disabled={disable}

     className=' input-box'
     
     />
     <i className={'fi ' + icon + ' input-icon'}></i>
     {
         type=='password'?
         <i className={'fi fi-rr-eye' +(!passwordVisible ? '-crossed':"")+ ' input-icon left-[auto] right-4 cursor-pointer'}
         onClick={()=>setpasswordVisible(currentVal=>!currentVal)}

         ></i>:""
     }
        
    </div>
  )
}

export default Input_Compo
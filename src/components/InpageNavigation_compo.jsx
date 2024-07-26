import React, { useEffect, useRef, useState } from 'react'

export let activeTabRef;
export let activeTabrefLine

const InpageNavigation_compo = ({routes,defaultHidden=[],defaultActiveIndex=0,children}) => {
     activeTabrefLine=useRef()
     activeTabRef=useRef()

    let [inpageNavIndex,setInpageNavIndex]=useState(defaultActiveIndex)
    let [isResizeEventEdit,setResizeEventedit]=useState(false)
    let [width,setWidth]=useState(window.innerWidth)
    const changePageState=(btn,i)=>{
         let { offsetWidth,offsetLeft}=btn
         activeTabrefLine.current.style.width=offsetWidth +'px';
         activeTabrefLine.current.style.left=offsetLeft +'px';
         setInpageNavIndex(i)
    }
    useEffect(()=>{
        if(width>766 && inpageNavIndex !=defaultActiveIndex){
            changePageState(activeTabRef.current,defaultActiveIndex)

        }
        if(!isResizeEventEdit){
            window.addEventListener('resize',()=>{
                if(!isResizeEventEdit){
                    setResizeEventedit(true)
                }

                setWidth(window.innerWidth)
            })
        }

    },[width])
    // console.log(width)
  return (
     
        <>
        <div className=' relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
    {
        routes.map((route,i)=>{
            return (
                <button ref={i==defaultActiveIndex ? activeTabRef:null} key={i} className={' p-4 px-5 capitalize '+(inpageNavIndex==i ? " text-black":" text-dark-grey "+(defaultHidden.includes(route)? " md:hidden":" "))} onClick={(e)=>{changePageState(e.target,i)}}>
                    {route}
                </button>
            )
        })
    }

    <hr ref={activeTabrefLine} className=' absolute bottom-0 duration-300'/>
        </div>
        {
        Array.isArray(children) ? children[inpageNavIndex] :children
        }

        </>
     
  )
}

export default InpageNavigation_compo
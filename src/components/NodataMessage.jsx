import React from 'react'

const NodataMessage = ({Message}) => {
  return (
    <div className=' text-center w-full p-4 rounded-full bg-grey/50 mt-4'>
        <p>{Message}</p>
    </div>
  )
}

export default NodataMessage
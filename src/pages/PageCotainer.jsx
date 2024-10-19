import React from 'react'

function PageCotainer({children}) {
  return (
    
    <div className='ml-[80px]'>  
        <div className=' px-36 py-10'>{children}</div>
    </div>
  )
}

export default PageCotainer
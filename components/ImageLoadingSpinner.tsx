'use client'

import React from 'react'

const loadingImages = '/mark.png'

const ImageLoadingSpinner = () => {
  return (
    <div className="flex h-full justify-center items-center w-full">
      <img
        src={loadingImages}
        alt="Loading..."
        className="w-32 h-32 object-contain transition-all duration-300"
      />
    </div>
  )
}

export default ImageLoadingSpinner

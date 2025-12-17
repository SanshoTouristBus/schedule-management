import React from 'react'

export default function Label({htmlFor = undefined, children, required = false}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm mb-1 text-gray-500 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

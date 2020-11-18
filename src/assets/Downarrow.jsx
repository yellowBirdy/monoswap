import React from 'react'



export default ({onClick}) => 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
            viewBox="0 0 24 24" fill="none" stroke="#2172E5" 
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{display: "block", margin: "10px auto"}} 
            onClick={onClick}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
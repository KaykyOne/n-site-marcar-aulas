import React from 'react'
import NavBar from '../components/NavBar'
import { ToastContainer } from 'react-toastify'

export default function Layout({ children, back = -1, home = -1 }) {
    return (
        <div className='flex flex-col h-screen max-h-screen w-full max-w-[500px]'>
            <div>
                {children}
            </div>
            <NavBar back={back} home={home} />
            <ToastContainer position="top-center" />

        </div>
    )
}

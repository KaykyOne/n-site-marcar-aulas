import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NavBar({ back, home }) {
  const navigate = useNavigate();
  return (
    <div className='flex justify-center w-full items-center fixed left-1/2 -translate-x-1/2 bottom-0 max-w-[500px]'>
      <div className='flex-1 p-2 shadow-md flex gap-2 bg-white rounded-t-3xl'>
        <button className='flex  flex-1 text-primary flex-col p-2 font-medium hover:text-gray-600 transition duration-300'
          onClick={() => navigate(back)}>
          <span className="material-icons">
            arrow_back
          </span>
          <span className="text-xs">Voltar</span>
        </button>
        <button className='flex items-center justify-center fixed left-1/2 -translate-x-1/2 bottom-2 bg-primary text-white  rounded-full  w-[80px] h-[80px] flex-col p-2 font-medium hover:bg-primary/80 hover:text-white transition duration-300'
          onClick={() => navigate(home)}>
          <span className="material-icons !text-5xl">
            home
          </span>
        </button>
        <button className='flex  flex-1 text-primary flex-col p-2 font-medium hover:text-gray-600 transition duration-300'
          onClick={() => navigate('../perfil')}>
          <span className="material-icons">
            account_circle
          </span>
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  )
}

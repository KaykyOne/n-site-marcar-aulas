import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NavBar({ back, home }) {
  const navigate = useNavigate();
  return (
    <div className='p-4 w-full flex justify-center'>
      <div className='bg-gray-100 flex-1 p-2 shadow-md flex gap-2 rounded-full max-w-[300px] border border-gray-200'>
        <button className='flex rounded-full flex-1 text-primary flex-col p-2 font-medium hover:bg-primary hover:text-white transition duration-300'
          onClick={() => navigate(home)}>
          <span className="material-icons">
            home
          </span>
          <span className="text-xs">Início</span>
        </button>
        <button className='flex rounded-full  flex-1 text-primary flex-col p-2 font-medium hover:bg-primary hover:text-white transition duration-300'
          onClick={() => navigate(back)}>
          <span className="material-icons">
            arrow_back
          </span>
          <span className="text-xs">Voltar</span>
        </button>
      </div>
    </div>
  )
}

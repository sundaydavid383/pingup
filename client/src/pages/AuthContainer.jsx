import React, { useState } from 'react';
import './login.css';
import "../styles/ui.css";
import assets from '../assets/assets';
import { Star } from 'lucide-react';
import SignUpForm from '../component/SignUpForm';
import LoginForm from "../component/LoginForm";


const AuthContainer = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
  <div className="min-h-screen flex flex-col md:flex-row px-9 bg-multi-gradient">
            {/* Left side: Branding */}
            <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40 relative z-10">
                <img src={assets.logo} alt="Logo" className="h-22 object-contain" />
                <div>
                    <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
                        <div className="flex -space-x-4">
                            {[assets.user2, assets.user1, assets.user3].map((src, index) => (
                                <div
                                    key={index}
                                    className="w-14 h-14 rounded-full border-2 border-white overflow-hidden"
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className="w-[120%] h-[120%] object-cover object-center"
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="flex">
                                {Array(5).fill(0).map((_, i) => (<Star key={i}
                                    className='size-4 md:size-4.5 text-transparent
                            fill-amber-500'/>))}
                            </div>
                            <p className='text-xs md:text-sm text-[var(--primary-dark)]'>
                                Used by 12k+ Individuals
                            </p>
                        </div>
                    </div>
                    <h1 className='text-3xl md:text-6xl md:pb-2 font-bold 
bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>
                        More than just friends, truly connect
                    </h1>
                    <p className="text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
                        connect with global community on springs connect.</p>
                </div>
                <span className='md:h-10'></span>
            </div>
            {/* Right side: Login Form */}
            < div className='flex-1 flex items-center justify-center p-6 sm:p-10  relative z-10'>
                {isLogin ? (
                    <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
                ) : (
                    <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};

export default AuthContainer;
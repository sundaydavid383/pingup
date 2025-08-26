import React, { useState, useEffect } from 'react';
import './login.css';
import "../styles/ui.css";
import assets from '../assets/assets';
import { Star } from 'lucide-react';
import SignUpForm from '../component/SignUpForm';
import LoginForm from "../component/LoginForm";
import { signInWithGoogle, auth, logout, provider } from "../firebase";
import { onAuthStateChanged, signInWithPopup  } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import CustomAlert from '../component/shared/CustomAlert';
import Loading from '../component/shared/Loading';
import UserStats from '../component/UserStats';

const AuthContainer = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState(null);
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("")
    const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

    // listen to auth changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe();
}, []);


const handleGoogleSignup = async () => {
  try {
     const testPopup = window.open("", "", "width=100,height=100")
     if(!testPopup || testPopup.closed || typeof testPopup.closed === "undefined"){
      setAlert({
          show: true,
          message: "Popups are blocked. Please enable popups in your browser settings to continue.",
          type: "error",
        });
        return;
     }
    testPopup.close();

    setLoading(true);
    setLoadingText("Signing in with Google...");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const username = user?.email?.split("@")[0] || "unknown";

      const res = await axios.post(`${import.meta.env.VITE_SERVER}api/auth/google-register`, {
        name: user.displayName,
        email: user.email,
        username,
        profilePicUrl: user.photoURL,
        googleId: user.uid,
      });

      login(res.data.user, res.data.token);
        setAlert({
        show: true,
        message: "Google signup successful! 🎉",
        type: "success",
      });
     
  } catch (err) {
    console.error("Google signup error:", err);
    setAlert({
      show: true,
      message: err.response?.data?.message || "Google signup failed",
      type: "error",
    });
  }
  finally {
      setLoading(false);
    }
};



    return (
  <div className="min-h-screen flex flex-col md:flex-row px-9 bg-multi-gradient">
           
      {loading && <Loading text={loadingText} />}
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )} {/* Left side: Branding */}
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
                            {<UserStats/>}
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
            < div className='flex-1 flex flex-col items-center justify-center p-6 sm:p-10  relative z-10'>
                {isLogin ? (
                    <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
                ) : (
                    <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
                )}
            <div className="mt-6 w-full flex flex-col items-center">
 <button
  onClick={handleGoogleSignup}
  type="button"
  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl 
             border border-gray-300 shadow-lg hover:shadow-2xl transition cursor-pointer"
>
  <img
    src="https://www.svgrepo.com/show/355037/google.svg"
    alt="Google"
    className="w-5 h-5"
  />
  <span>Sign up with Google account</span>
</button>

<p className="mt-2 text-sm text-black text-center">
  ⚠️ Make sure popups are enabled in your browser before continuing.
</p></div>
            </div>
        </div>
    );
};

export default AuthContainer;
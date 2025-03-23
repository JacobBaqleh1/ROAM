import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="  flex justify-center items-center ">
            <div className="bg-white rounded-lg w-full max-w-sm md:max-w-lg p-8">
                <div className="flex justify-between items-center mb-2">
                    <button
                        className="text-gray-700 font-semibold cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="2.5em" width="2.5em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path>
                            <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                        </svg>
                    </button>
                </div>

                <div className='flex flex-col justify-center text-center text-3xl'>
                    <p>Sign up or log in</p>
                    <p>to access your profile</p>
                </div>

                <div className="mt-6">
                    <div>
                        <h2 className="text-gray-700 font-semibold text-center">Login</h2>
                        <LoginForm />
                    </div>

                    <p className='text-center mt-4'>or</p>

                    <div className='mt-6'>
                        <h2 className="text-gray-700 font-semibold text-center">Sign Up</h2>
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { X } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-8">
            <div className="bg-white rounded-2xl shadow-card w-full max-w-sm md:max-w-lg p-8">
                <div className="flex justify-between items-center mb-4">
                    <button
                        aria-label="Go back home"
                        className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col justify-center text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 font-display">Sign up or log in</h1>
                    <p className="text-gray-500 text-sm mt-1">to access your parks and reviews</p>
                </div>

                <div className="mt-4">
                    <div>
                        <h2 className="text-gray-700 font-semibold text-center mb-3">Login</h2>
                        <LoginForm />
                    </div>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="mx-4 text-sm text-gray-400">or</span>
                        <div className="flex-grow border-t border-gray-200" />
                    </div>

                    <div>
                        <h2 className="text-gray-700 font-semibold text-center mb-3">Sign Up</h2>
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

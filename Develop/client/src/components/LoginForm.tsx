import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';


const LoginForm = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);

      // Optionally close the modal after successful login
    } catch (e) {
      console.error(e);
      setShowAlert(true);
    }
  };

  return (
    <>
      <form noValidate onSubmit={handleFormSubmit} className="space-y-4">
        {/* Show alert if there is an error */}
        {error && showAlert && (
          <div className="bg-red-500 text-white p-3 rounded-md flex justify-between items-center">
            <span>{error.message || 'Something went wrong with your login!'}</span>
            <button onClick={() => setShowAlert(false)} className="text-white font-bold text-lg">✖</button>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={formState.email}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-100"
          />
          <p className="text-red-500 text-sm mt-1 hidden">Email is required!</p>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={formState.password}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-100"
          />
          <p className="text-red-500 text-sm mt-1 hidden">Password is required!</p>
        </div>

        <button
          disabled={!(formState.email && formState.password)}
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg font-bold shadow-md hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </>

  );
};

export default LoginForm;

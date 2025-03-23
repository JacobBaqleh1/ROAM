import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [addUser, { error, data }] = useMutation(ADD_USER);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });

      Auth.login(data.addUser.token);
      // Close the modal on successful signup
    } catch (e) {
      console.error(e);
      setShowAlert(true); // Show alert on error
    }
  };

  return (
    <>
      {data ? (
        <p className="text-center text-green-600">
          Success! You may now head{' '}
          <a href="/" className="text-blue-500 underline">
            back to the homepage.
          </a>
        </p>
      ) : (
        <form noValidate onSubmit={handleFormSubmit} className="space-y-4">
          {/* Alert for signup errors */}
          {error && showAlert && (
            <div className="bg-red-500 text-white p-3 rounded-md flex justify-between items-center">
              <span>{error.message || 'Something went wrong with your signup!'}</span>
              <button onClick={() => setShowAlert(false)} className="text-white font-bold text-lg">✖</button>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Your username"
              name="username"
              value={formState.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-100"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Your email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-100"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Your password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={!(formState.username && formState.email && formState.password)}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default SignupForm;

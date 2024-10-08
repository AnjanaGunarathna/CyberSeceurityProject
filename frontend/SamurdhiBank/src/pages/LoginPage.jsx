import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import FloatingShape from "../components/FloatingShape";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [captchaValue, setCaptchaValue] = useState(null);
	const navigate = useNavigate();
	const [nameError, setNameError] = useState("");

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();

		if (!validateName(name)) {
			setNameError("Full name can only contain letters and spaces.");
			return;
		} else {
			setNameError(""); // Clear error if valid
		}
		if (!captchaValue) {
			alert("Please complete the CAPTCHA."); // Alert if captcha is not completed
			return;
		}
		try {
			await login(name, password);

			// Check empid after login
			const user = useAuthStore.getState().user;
			if (user && user.empid && user.empid.startsWith('M')) {
				navigate('/admin-panel'); // Adjust this path to your Admin panel route
			} else {
				navigate('/'); // Adjust this path to the normal user dashboard
			}
		} catch (error) {
			console.error(error);
		}
	};
	const validateName = (name) => {
		// Regular expression to allow only letters and spaces
		const nameRegex = /^[A-Za-z\s]+$/;
		return nameRegex.test(name);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
			<FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
						Welcome Back
					</h2>

					<form onSubmit={handleLogin}>
						<Input
							icon={User}
							type='name'
							placeholder='Name'
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (validateName(e.target.value)) {
									setNameError(""); // Clear error if valid
								} else {
									setNameError("Full name can only contain letters and spaces.");
								}
							}}
						/>
						{ nameError && <p className='text-red-500 font-semibold mt-2'>{nameError}</p>}

						<Input
							icon={Lock}
							type='password'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<div className='flex items-center mb-6'>
							<Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
								Forgot password?
							</Link>
						</div>
						{error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

						<div className="flex flex-col items-center mt-6">
							<p className="text-gray-300 text-sm mb-2">
								Please verify that you are not a robot.
							</p>
							<div className="mb-4">
								<ReCAPTCHA
									sitekey="6LfyXFQqAAAAAB0t_biVdRoMimMyocY8lG43AjYG" 
									onChange={(value) => setCaptchaValue(value)} 
								/>
							</div>
						</div>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
						</motion.button>
					</form>
				</div>
				<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
					<p className='text-sm text-gray-400'>
						Don't have an account?{" "}
						<Link to='/signup' className='text-green-400 hover:underline'>
							Sign up
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;

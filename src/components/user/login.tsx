import '../../assets/css/user/login.css';

// const Login = () => {
//     return (
//         <div>
//             Đây là trang login
//         </div>
//     );
// };
// export default Login;
// src/components/Login.tsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../context/app.context';
import { useNavigate } from 'react-router-dom';

const LoginSchema = yup.object().shape({
	userName: yup.string().required('Tên người dùng không được để trống'),
	passwordHash: yup.string().required('Mật khẩu không được để trống'),
});

const Login = () => {
	const { login } = useAuth();

	const navigate = useNavigate();

	const handleSubmit = async (values: any) => {
		try {
			const success = await login(values);
			if (success) {
				navigate('/home');
			}
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	return (
		<div className="container-fluid">
			<div className="row login-container">
				<div className="col-md-6 login-left">
					{/* Phần hiển thị ảnh lớn */}
					{/* Background image */}
				</div>
				<div className="col-md-6 login-right">
					{/* Phần đăng nhập */}
					<Formik
						initialValues={{ userName: '', passwordHash: '', role: 0 }}
						validationSchema={LoginSchema}
						onSubmit={handleSubmit}
					>
						<Form>
							<div>
								<h2 className="mb-3">Đăng nhập</h2>
								<div className="mb-3">
									<label htmlFor="username" className="form-label">Tên người dùng</label>
									<Field type="text" id="username" name="userName" className="form-control" />
									<ErrorMessage name="username" component="div" className="text-danger" />
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Mật khẩu</label>
									<Field type="password" id="password" name="passwordHash" className="form-control" />
									<ErrorMessage name="password" component="div" className="text-danger" />
								</div>
								<button type="submit" className="btn btn-primary">Đăng nhập</button>
							</div>
						</Form>

					</Formik>
					<div className="mt-3">
						<a href="/sign-up">Bạn chưa có tài khoản? Đăng kí ngay</a>
					</div>
				</div>

			</div>
		</div>
	);
};

export default Login;

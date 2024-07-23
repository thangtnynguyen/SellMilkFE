import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserService from '../../services/user.services';
import '../../assets/css/user/signup.css';
const Signup: React.FC = () => {
  const [register, setRegister] = useState({
    name: '',
    userName: '',
    passwordHash: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegister(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (register.passwordHash !== register.confirmPassword) {
      toast.error('Mật khẩu nhập lại không trùng khớp!!');
      return;
    }
    if (!register.name || !register.userName || !register.passwordHash) {
      toast.error('Không được để trống !!');
      return;
    }
    try {
      const result = await UserService.signup(register);
      if (!result.status) {
        toast.error('Đăng kí thất bại!!');
      } else {
        toast.success('Đăng kí thành công!!');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Đăng kí thất bại!!');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 signup-image"></div>
        <div className="col-md-6 d-flex align-items-center">
          <div className="signup-form">
            <h2 className="mb-4">Đăng kí</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Tên của bạn là gì?</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={register.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">Tên đăng nhập của bạn?</label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  name="userName"
                  value={register.userName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordHash" className="form-label">Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordHash"
                  name="passwordHash"
                  value={register.passwordHash}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={register.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Đăng kí</button>
            </form>
            <div className="mt-3">
              <a href="/login">Bạn đã có tài khoản? Đăng nhập ngay</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

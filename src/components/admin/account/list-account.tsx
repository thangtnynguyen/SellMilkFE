import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserService from '../../../services/user.services';

interface User {
  id: number;
  name: string;
  userName: string;
  passwordHash: string;
  role: number;
}

const ListAccount: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getTatNguoiDung();
  }, []);

  const getTatNguoiDung = async () => {
    try {
      const result = await UserService.getTatNguoiDung();
      if (result.status) {
        setUsers(result.data);
      } else {
        toast.error('Không tải được danh sách người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách người dùng');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item">User</li>
              <li className="breadcrumb-item active" aria-current="page">
                List-User
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row px-3">
        {/* <button className="btn btn-primary mb-3">Thêm loại máy tính</button> */}
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="d-flex align-items-center justify-content-between">
            {/* Thanh tìm kiếm */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm"
                aria-label="Tìm kiếm"
                aria-describedby="button-search"
              />
              <button className="btn btn-outline-secondary" type="button" id="button-search">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ten</th>
              <th>User Name</th>
              <th>Pass</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.userName}</td>
                <td>{user.passwordHash}</td>
                <td>
                  {user.role === 0 ? (
                    <span className="badge bg-success">Người dùng</span>
                  ) : (
                    <span className="badge bg-warning">Admin</span>
                  )}
                </td>
                <td>
                  <button type="button" className="btn btn-outline-primary me-2" title="View">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button type="button" className="btn btn-outline-secondary me-2" title="Edit">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button type="button" className="btn btn-outline-danger" title="Delete">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAccount;

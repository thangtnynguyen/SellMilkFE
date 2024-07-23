import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryService from '../../../services/category.service';

interface Category {
  ten: string;
  moTa: string;
  status: boolean;
  showMenu: boolean;
}

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [loaiMayTinhThem, setLoaiMayTinhThem] = useState<Category>({
    ten: '',
    moTa: '',
    status: true,
    showMenu: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement; // Type assertion here
      setLoaiMayTinhThem(prevState => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setLoaiMayTinhThem(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await CategoryService.createLoaiSua(loaiMayTinhThem);
      if (result.status) {
        toast.success(result.message);
        navigate('/admin/category/list');
      }
    } catch (error: any) {
      console.error('Lỗi khi thêm loại sữa:', error);
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi thêm loại sữa');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item">Category</li>
              <li className="breadcrumb-item active" aria-current="page">Add-Category</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ten" className="form-label">Tên</label>
            <input
              type="text"
              className="form-control"
              id="ten"
              name="ten"
              value={loaiMayTinhThem.ten}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="moTa" className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              id="moTa"
              name="moTa"
              value={loaiMayTinhThem.moTa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="status"
              name="status"
              checked={loaiMayTinhThem.status}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="status">Status</label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showMenu"
              name="showMenu"
              checked={loaiMayTinhThem.showMenu}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="showMenu">Show Menu</label>
          </div>
          <button type="submit" className="btn btn-primary">Thêm</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;

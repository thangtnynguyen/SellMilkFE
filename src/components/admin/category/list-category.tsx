import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryService from '../../../services/category.service';

interface Category {
	id: number;
	ten: string;
	moTa: string;
	status: boolean;
}

const ListCategory: React.FC = () => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		getLoaiMayTinh();
	}, []);

	const getLoaiMayTinh = async () => {
		try {
			const response = await CategoryService.getLoaiSua({});
			if (response.status) {
				setCategories(response.data);
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
			toast.error('Đã xảy ra lỗi khi tải danh sách loại sữa');
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredCategories = categories.filter(category =>
		category.ten.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="container">
			<div className="row">
				<div className="col d-flex justify-content-end">
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item">Admin</li>
							<li className="breadcrumb-item">Category</li>
							<li className="breadcrumb-item active" aria-current="page">List-Category</li>
						</ol>
					</nav>
				</div>
			</div>



			<div className="row">
				<div className="col-md-8">
					<div className="d-flex align-items-center justify-content-between">
						<div className="input-group mb-3">
							<input
								type="text"
								className="form-control"
								placeholder="Tìm kiếm"
								aria-label="Tìm kiếm"
								aria-describedby="button-search"
								value={searchTerm}
								onChange={handleSearchChange}
							/>
							<button className="btn btn-outline-secondary" type="button" id="button-search">
								Tìm kiếm
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-4 d-flex flex-column justify-content-end align-items-end px-3">
					<button
						className="btn btn-primary mb-3"
						onClick={() => navigate('/admin/category/add')}
					>
						Thêm loại sữa
					</button>
				</div>

			</div>

			<div className="row">
				<table className="table table-striped">
					<thead>
						<tr>
							<th>ID</th>
							<th>Tên</th>
							<th>Mô Tả</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{filteredCategories.map(category => (
							<tr key={category.id}>
								<td>{category.id}</td>
								<td>{category.ten}</td>
								<td>{category.moTa}</td>
								<td>
									<span className={`badge ${category.status ? 'bg-success' : 'bg-warning'}`}>
										{category.status ? 'Mở' : 'Đóng'}
									</span>
								</td>
								<td>
									<button
										type="button"
										className="btn btn-outline-primary me-2"
										title="View"
										onClick={() => navigate(`/admin/category/view/${category.id}`)}
									>
										<i className="fas fa-eye"></i>
									</button>
									<button
										type="button"
										className="btn btn-outline-secondary me-2"
										title="Edit"
										onClick={() => navigate(`/admin/category/edit/${category.id}`)}
									>
										<i className="fas fa-pencil-alt"></i>
									</button>
									<button
										type="button"
										className="btn btn-outline-danger"
										title="Delete"
										onClick={() => {
											// Implement delete functionality here
										}}
									>
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

export default ListCategory;

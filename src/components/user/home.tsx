import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { enviroment } from '../../enviroment/enviroment';
import { toast } from 'react-toastify';
import '../../assets/css/user/home.css';
import milkService from '../../services/milk.service';
import CategoryService from '../../services/category.service';
import MilkCarousel from './layout/slideshow';
const Home: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [milks, setmilks] = useState<any[]>([]);
	const [originmilks, setOriginmilks] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [pageCurrent, setPageCurrent] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [search, setSearch] = useState<{ ten: string }>({ ten: '' });
	const baseUrlImage: string = enviroment.host.baseUrlImage;
	const [queryParameters, setQueryParameters] = useState({
		ten: '',
	});
	useEffect(() => {
		// const params = new URLSearchParams(location.search);
		// const pageIndex = params.get('pageIndex') || '1';
		// const pageSize = params.get('pageSize') || '10';
		// year: params.get("year") || '',
		// getSua({ pageIndex, pageSize });
		// getloaiSua();
		const params = new URLSearchParams(window.location.search);
		const request = {
			...search,
			pageIndex: params.get('pageIndex') ? params.get('pageIndex') : 1,
			pageSize: params.get('pageSize') ? params.get('pageSize') : 10,
			ten: params.get("ten") ? params.get("ten")! : null,

		};
		setQueryParameters({
			...queryParameters,
			...request,
			ten: params.get("ten") || '',
		});
		getSua(request);
		getloaiSua();

	}, [location.search]);

	const getSua = async (request: any) => {
		try {
			const response = await milkService.getSua(request);
			if (response.status) {
				if (request.pageIndex !== 1 && response.data.items.length === 0) {
					navigate('?pageIndex=1', { replace: true });
				}
				setmilks(response.data.items);
				setOriginmilks(response.data.items);
				setTotalPages(response.data.totalPages);
				setPageCurrent(response.data.pageIndex);
			}
		} catch (error) {
			console.error('Error fetching milks:', error);
			toast.error('Failed to fetch milks');
		}
	};

	const getloaiSua = async () => {
		try {
			const response = await CategoryService.getLoaiSua();
			if (response.status) {
				setCategories(response.data);
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
			toast.error('Failed to fetch categories');
		}
	};

	const onSearchChange = () => {
		const params = new URLSearchParams(location.search);
		params.set('ten', search.ten);
		navigate(`?${params.toString()}`);
	};

	const handleOnChangePage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			const params = new URLSearchParams(location.search);
			params.set('pageIndex', page.toString());
			navigate(`?${params.toString()}`);
		}
	};

	const filterByCategory = (id: number) => {
		const filteredmilks = originmilks.filter((milk: any) => milk.loaiID === id);
		setmilks(filteredmilks);
	};

	const formatCurrency = (value: number): string => {
		const formatter = new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
		});
		return formatter.format(value);
	};

	return (
		<div className="container-fluid">
			<div className='row'>
				<div className="col-lg-12 pt-5 px-4">
					<MilkCarousel />
				</div>
			</div>
			<div className="row">
				<div className="col-lg-2 pt-5 px-4">
					<div className="sidebar" style={{ backgroundColor: '#FFFFF0' }}>
						<h5>Các loại sữa</h5>
						<ul className="nav flex-column">
							{categories.map((category: any) => (
								<li className="nav-item" style={{ borderBottom: '1px solid #dee2e6' }} key={category.id}>
									<a className="nav-link d-flex align-items-center ttt" onClick={() => filterByCategory(category.id)}>
										<div className="me-3 rounded-circle overflow-hidden" style={{ width: '30px', height: '30px' }}>
											<img src={`${baseUrlImage}/${category.anh}`} alt={category.ten} style={{ width: '100%', height: 'auto' }} />
										</div>
										{category.ten}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="col-lg-10 pt-5 px-2">
					<div className="row">
						<div className="col">
							<div className="d-flex align-items-center justify-content-between">
								<div className="input-group mb-3">
									<input type="text" style={{maxWidth:'500px'}} className="form-control" placeholder="Tìm kiếm" aria-label="Tìm kiếm" aria-describedby="button-search" value={search.ten} onChange={(e) => setSearch({ ten: e.target.value })} />
									<button className="btn btn-outline-secondary" type="button" id="button-search" onClick={onSearchChange}>Tìm kiếm</button>
								</div>
							</div>
						</div>
					</div>
					<div className="milk-card">
						<div className="row">
							{milks.map((milk: any) => (
								<div className="col-md-2 mt-4" key={milk.id}>
									<a href={`/detail/${milk.id}`} className="card">
										<img src={`${baseUrlImage}/${milk.anh}`} alt="milk" className="img-fluid img-thumbnail"
											style={{ maxHeight: '300px', width: 'auto' }} />
										<div className="card-body">
											<div className="row">
												{milk.gia && (
													<h6 className="text-danger">
														{formatCurrency(milk.gia.giaSanPham)} <small className="text-muted"><del>{formatCurrency(milk.gia.giaTruocGiam)}</del></small>
													</h6>
												)}
											</div>
											<div className='row'>
												<p className="card-text">{milk.ten}</p>

											</div>
										</div>
									</a>
								</div>
							))}
						</div>
					</div>
					<div className="row d-flex justify-content-center align-items-center mt-4">
						<div className="col">
							<nav aria-label="Page navigation example">
								<ul className="pagination justify-content-center">
									<li className={`page-item ${pageCurrent === 1 ? 'disabled' : ''}`} onClick={() => pageCurrent > 1 && handleOnChangePage(pageCurrent - 1)}>
										<a className="page-link" tabIndex={pageCurrent === 1 ? -1 : 0} aria-disabled={pageCurrent === 1 ? 'true' : 'false'}>Previous</a>
									</li>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<li className="page-item" key={page} onClick={() => handleOnChangePage(page)}>
											<a className="page-link">{page}</a>
										</li>
									))}
									<li className="page-item" onClick={() => handleOnChangePage(pageCurrent + 1)}>
										<a className="page-link">Next</a>
									</li>
								</ul>
							</nav>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Home;

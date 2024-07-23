import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, InputGroup, FormControl, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faPencilAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { enviroment } from '../../../enviroment/enviroment';
import MilkService from '../../../services/milk.service';

const ListMilk: React.FC = () => {
    const [milks, setmilks] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<any>({
        nameOrEmail: '',
        phoneNumber: '',
        status: ''
    });

    const baseUrlImage: string = enviroment.host.baseUrlImage;

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pageIndex = queryParams.get('pageIndex') || '1';
        const pageSize = queryParams.get('pageSize') || '10';

        const request = {
            ...search,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize)
        };

        getmilks(request);
    }, [location.search, search]);

    const getmilks = (params: any) => {
        MilkService.getSua(params)
            .then((result: any) => {
                if (result.status) {
                    setmilks(result.data.items);
                    setTotalPages(result.data.totalPages);
                    setCurrentPage(result.data.pageIndex);
                    setTotalRecords(result.data.totalRecords);
                    setPageSize(result.data.pageSize);

                    // Transforming image URLs for display
                    result.data.items.forEach((milk: any) => {
                        if (milk.anhKhac) {
                            let urls: string[] = milk.anhKhac.split(',');
                            milk.anhKhacUrls = urls.map((url: string) => baseUrlImage + url);
                        }
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                toast.error('Không thể lấy dữ liệu từ máy chủ.');
            });
    };

    const deletemilk = (id: number) => {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa sữa này không?',
            text: 'Sau khi xóa không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Bỏ qua',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const request = { id: id };
                MilkService.deleteSua(request).then((result: any) => {
                    if (result.status) {
                        setmilks(milks.filter(milk => milk.id !== id));
                        toast.success('Xóa thành công');
                    }
                    else {
                        toast.error('Xóa thất bại');
                    }
                })
            }
        });
    };

    return (
        <div className="container">
            <ToastContainer />

            {/* Breadcrumb */}
            <div className="row">
                <div className="col d-flex justify-content-end">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Admin</li>
                            <li className="breadcrumb-item">Milk</li>
                            <li className="breadcrumb-item active" aria-current="page">List-Milk</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Search Bar */}
            <div className="row">
                <div className="col-md-8">
                    <div className="d-flex align-items-center justify-content-between">
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Tìm kiếm"
                                aria-label="Tìm kiếm"
                                aria-describedby="button-search"
                            />
                            <Button variant="outline-secondary" id="button-search">
                                Tìm kiếm
                            </Button>
                        </InputGroup>
                    </div>
                </div>

                {/* Add Button */}
                <div className="col-md-4 d-flex flex-column justify-content-end align-items-end px-3">
                    <Button variant="primary" className="mb-3" onClick={() => navigate('/admin/milk/add')}>
                        Thêm sữa
                    </Button>
                </div>


            </div>

            {/* Table */}
            <div className="row">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Ảnh</th>
                            <th>Ảnh Khác</th>
                            <th>Status</th>
                            <th>Tồn Kho</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {milks.map(milk => (
                            <tr key={milk.id}>
                                <td>{milk.id}</td>
                                <td>{milk.ten}</td>
                                <td>
                                    <img src={`${baseUrlImage}/${milk.anh}`} alt="milk" className="img-fluid img-thumbnail img-custom"
                                        style={{ maxHeight: '100px' }} />
                                </td>
                                <td>
                                    <div className="row">
                                        {milk.anhKhacUrls && milk.anhKhacUrls.map((url: string, index: number) => (
                                            <div className="col-md-4" key={index}>
                                                <img src={url} alt="Ảnh khác" className="img-fluid img-thumbnail img-thumbnail-custom" />
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    {milk.status
                                        ? <span className="badge bg-success">Mở</span>
                                        : <span className="badge bg-warning">Đóng</span>
                                    }
                                </td>
                                <td>
                                    {milk.tonKho >= 50
                                        ? <span className="badge bg-success">{milk.tonKho}</span>
                                        : <span className="badge bg-danger">{milk.tonKho}</span>
                                    }
                                </td>
                                <td>
                                    <Button variant="outline-primary" className="me-2" title="View"
                                        onClick={() => navigate(`/admin/milk/detail/${milk.id}`)}>
                                        <i className="fas fa-eye"></i>
                                    </Button>
                                    <Button variant="outline-secondary" className="me-2" title="Edit"
                                        onClick={() => navigate(`/admin/milk/edit/${milk.id}`)}>
                                        <i className="fas fa-pencil-alt"></i>
                                    </Button>
                                    <Button variant="outline-info" className="me-2" title="Edit stock"
                                        onClick={() => navigate(`/admin/milk/edit-stock/${milk.id}`)}>
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                                    <Button variant="outline-danger" title="Delete" onClick={() => deletemilk(milk.id)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

        </div>
    );
};

export default ListMilk;

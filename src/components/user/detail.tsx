// export default Detail;
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComputerService from '../../services/milk.service';
import { enviroment } from '../../enviroment/enviroment';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import BillService from '../../services/bill.service';
import { useAuth } from '../../context/app.context';
import CartService from '../../services/cart.service';
import '../../assets/css/user/detail.css';

const Detail: React.FC = () => {
    const baseUrlImage: string = enviroment.host.baseUrlImage;

    const [computer, setComputer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ComputerService.getSuaById({ id: id });
                if (result.status) {
                    const fetchedComputer = result.data;
                    if (fetchedComputer.anhKhac) {
                        const urls: string[] = fetchedComputer.anhKhac.split(',');
                        fetchedComputer.anhKhacUrls = urls;
                    }
                    fetchedComputer.quantity = 1;
                    fetchedComputer.total = fetchedComputer.gia.giaSanPham;
                    setComputer(fetchedComputer);
                } else {
                    toast.error('Failed to fetch product details');
                }
            } catch (error) {
                console.error('Failed to fetch product details', error);
                toast.error('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const decrementQuantity = () => {
        if (computer.quantity > 1) {
            setComputer((prevState: any) => ({
                ...prevState,
                quantity: prevState.quantity - 1,
                total: prevState.total - prevState.gia.giaSanPham
            }));
        }
    };

    const incrementQuantity = () => {
        setComputer((prevState: any) => ({
            ...prevState,
            quantity: prevState.quantity + 1,
            total: prevState.total + prevState.gia.giaSanPham
        }));
    };

    const onBuying = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                cancelButton: 'btn btn-danger ms-5',
                confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: `Bạn có chắc muốn mua sữa này không`,
                text: 'Sau khi mua không thể hoàn tác!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Bỏ qua',
                reverseButtons: false,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const request = {
                        nguoiDungID: user?.id,
                        tong: computer.total,
                        ctHoaDonBans: [
                            {
                                suaID: computer.id,
                                tenSua: computer.ten,
                                soLuong: computer.quantity,
                                gia: computer.gia.giaSanPham,
                            },
                        ],
                    };

                    try {
                        const result1 = await BillService.addHoaDonBan(request);
                        if (result1.status) {
                            toast.success('Mua sữa thành công');
                            navigate('/history');
                        } else {
                            toast.error('Mua sữa thất bại');
                        }
                    } catch (error) {
                        console.error('Error adding bill:', error);
                        toast.error('Mua sữa thất bại');
                    }
                }
            });
    };

    const onCarting = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                cancelButton: 'btn btn-danger ms-5',
                confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: `Bạn có chắc muốn thêm sữa này vào giỏ hàng không`,
                text: 'Sau khi thêm sẽ nằm ở giỏ hàng!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Bỏ qua',
                reverseButtons: false,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const request = {
                        nguoiDungID: user?.id,
                        suaID: computer.id,
                        tenSua: computer.ten,
                        soLuong: computer.quantity,
                        gia: computer.gia.giaSanPham,
                    };

                    try {
                        const result1 = await CartService.addGioHang(request);
                        if (result1.status) {
                            toast.success('Thêm vào giỏ hàng thành công');
                            navigate('/cart');
                        } else {
                            toast.error('Thêm vào giỏ hàng thất bại');
                        }
                    } catch (error) {
                        console.error('Error adding to cart:', error);
                        toast.error('Thêm vào giỏ hàng thất bại');
                    }
                }
            });
    };

    const changeMainImage = (imageUrl: string) => {
        if (computer) {
            setComputer((prevState: any) => ({
                ...prevState,
                anh: imageUrl
            }));
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!computer) {
        return <div className="text-center">Product not found</div>;
    }

    return (
        <div className="container mt-5 p-4">
            <ToastContainer />
            <div className="row">
                <div className="col-md-6">
                    <div className="position-relative main-image">
                        {computer.anh && (
                            <img
                                src={`${baseUrlImage}/${computer.anh}`}
                                alt="Computer"
                                className="img-fluid img-thumbnail main-img"
                            />
                        )}
                    </div>
                    <div className="row mt-3">
                        <div className="d-flex flex-row">
                            {computer?.anhKhacUrls?.map((anhCon: string, index: number) => (
                                <div key={index} className="col me-2">
                                    <img
                                        src={`${baseUrlImage}/${anhCon}`}
                                        alt="Ảnh con"
                                        className="img-thumbnail thumbnail-img"
                                        onClick={() => changeMainImage(anhCon)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h2>{computer.ten}</h2>
                    <p className="text-muted">Thương hiệu {computer.category?.ten} | SKU: {computer.loaiID}</p>
                    {computer.gia && (
                        <h3 className="text-danger">
                            {formatCurrency(computer.gia.giaSanPham)}{' '}
                            <small className="text-muted">
                                <del>{formatCurrency(computer.gia.giaTruocGiam)}</del>
                            </small>
                        </h3>
                    )}
                    <div className="product-details mt-4">
                        <p><strong>Nguyên liệu:</strong> {computer.nguyenLieu}</p>
                        <p><strong>Khối lượng:</strong> {computer.khoiLuong}</p>
                        <p><strong>Còn lại:</strong> <span className="badge bg-success">{computer.tonKho} chiếc</span></p>
                    </div>
                    <div className="quantity-control mt-3 d-flex align-items-center">
                        <Button className="btn btn-outline-secondary" onClick={decrementQuantity}>-</Button>
                        <input
                            type="number"
                            className="form-control text-center mx-2"
                            value={computer.quantity}
                            onChange={() => { }}
                            min={1}
                            style={{ maxWidth: '60px' }}
                        />
                        <Button className="btn btn-outline-secondary" onClick={incrementQuantity}>+</Button>
                    </div>
                    <div className="mt-4">
                        <strong>Thành tiền: {formatCurrency(computer.total)}</strong>
                    </div>
                    <div className="actions mt-4">
                        <Button className="btn btn-primary mr-2" onClick={onBuying}>Mua ngay</Button>
                        <Button className="btn btn-outline-secondary" onClick={onCarting}>Thêm giỏ hàng</Button>
                    </div>
                    <div className="mt-4">
                        <strong>Mô tả:</strong>
                        <p>{computer.moTa}</p>
                    </div>
                    <div className="mt-3">
                        <p><strong>Chi tiết sản phẩm:</strong></p>
                        <ul>
                            {computer?.thongSos?.map((thongSo: any, index: number) => (
                                <li key={index}>
                                    {thongSo.tenThongSo}: <strong>{thongSo.moTa}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;



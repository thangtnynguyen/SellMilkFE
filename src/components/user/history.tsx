import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BillService from '../../services/bill.service';
import { useAuth } from '../../context/app.context';
import '../../assets/css/user/blank.css';

interface Bill {
    id: number;
    status: boolean | null;
    tong: number;
    createdAt: string;
}

const History: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const request = { id: user?.id };
        getHoaDonBan(request);
    }, [user]);

    const getHoaDonBan = async (request: any) => {
        try {
            const result = await BillService.getHoaDonBanByNguoiDungId(request);
            if (result.status) {
                setBills(result.data);
            }
        } catch (error) {
            toast.error('Failed to fetch bills');
        }
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <section className="shopping-cart spad">
            <div className="container mt-5">
                {bills.length === 0 ? (
                    <div className="blank">
                        <h3>No items in the history</h3>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="table-responsive mb-5">
                                <table className="table table-striped table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th className="shoping__product">Bill ID</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Order Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bills.map((bill) => (
                                            <tr key={bill.id}>
                                                <td className="shoping__cart__item">{bill.id}</td>
                                                <td className="shoping__cart__price">
                                                    {bill.status === false && <span className="badge bg-danger">Chưa duyệt</span>}
                                                    {bill.status === true && <span className="badge bg-success">Đã duyệt</span>}
                                                    {bill.status === null && <span className="badge bg-warning">Chưa xác nhận</span>}
                                                </td>
                                                <td className="shoping__cart__quantity">{formatCurrency(bill.tong)}</td>
                                                <td className="shoping__cart__total">{new Date(bill.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary me-2"
                                                        title="View"
                                                        onClick={() => navigate(`/history/detail/${bill.id}`)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default History;

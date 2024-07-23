import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BillService from '../../../services/bill.service';

interface Bill {
  id: number;
  nguoiDungID: number;
  tong: number;
  status: boolean | null;
  createdAt: string;
}

const ListBill: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [originalBills, setOriginalBills] = useState<Bill[]>([]);
  const [status, setStatus] = useState<number>(3); // Default to show all bills

  const navigate = useNavigate();
  const { id } = useParams(); // In case you need to fetch based on route parameter

  useEffect(() => {
    const request = {};

    getHoaDonBan(request);
  }, []);

  const getHoaDonBan = async (request: any) => {
    try {
      const result = await BillService.getHoaDonBan(request);
      if (result.status) {
        setBills(result.data);
        setOriginalBills(result.data);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const approve = async (status: boolean, id: number) => {
    const request = { id, status };
    try {
      const result = await BillService.updateStatusHoaDonBan(request);
      if (result.status) {
        toast.success('Thành công');
        getHoaDonBan({});
      } else {
        toast.error('Thất bại');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error( 'Đã xảy ra lỗi khi cập nhật trạng thái');
    }
  };

  const filter = (status: number) => {
    let filteredBills: Bill[] = [];

    if (status === 0) {
      filteredBills = originalBills.filter(bill => bill.status === false);
    } else if (status === 1) {
      filteredBills = originalBills.filter(bill => bill.status === true);
    } else if (status === 3) {
      filteredBills = originalBills;
    } else {
      filteredBills = originalBills.filter(bill => bill.status === null);
    }

    setBills(filteredBills);
    setStatus(status);
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
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item">Bill</li>
              <li className="breadcrumb-item active" aria-current="page">
                List-Bill
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row px-3">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <select
              className="form-select"
              name="status"
              value={status}
              onChange={(e) => filter(parseInt(e.target.value))}
            >
              <option value="1">Đã duyệt</option>
              <option value="0">Đã hủy</option>
              <option value="3">Tất cả</option>
              <option value="2">Chưa duyệt</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>NguoiDungID</th>
              <th>Total</th>
              <th>Status</th>
              <th>CreatedAt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.nguoiDungID}</td>
                <td>{formatCurrency(bill.tong)}</td>
                <td>
                  {bill.status === true && <span className="badge bg-success">Đã duyệt</span>}
                  {bill.status === false && <span className="badge bg-danger">Đã hủy</span>}
                  {bill.status === null && <span className="badge bg-warning">Chưa duyệt</span>}
                </td>
                <td>{bill.createdAt}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-primary me-2"
                    title="View"
                    onClick={() => {
                      // Navigate to bill detail page
                      navigate(`/admin/bill/detail/${bill.id}`);
                    }}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    title="Edit"
                    onClick={() => approve(true, bill.id)}
                  >
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    title="Delete"
                    onClick={() => approve(false, bill.id)}
                  >
                    <i className="fas fa-thumbs-down"></i>
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

export default ListBill;

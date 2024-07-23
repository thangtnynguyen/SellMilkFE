import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BillService from '../../../services/bill.service';

interface Bill {
  id: number;
  nguoiDungID: number;
  tong: number;
  status: boolean | null;
  createdAt: string;
  ctHoaDonBans: {
    tenSua: string;
    soLuong: number;
    gia: number;
    tong: number;
  }[];
}

const DetailBill: React.FC = () => {
  const [bill, setBill] = useState<Bill | null>(null);
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      getHoaDonBanById(id);
    }
  }, [id]);

  const getHoaDonBanById = async (id: string) => {
    try {
      const request = { id };
      const result = await BillService.getHoaDonBanById(request);
      if (result.status) {
        setBill(result.data);
      } else {
        toast.error('Không tìm thấy hóa đơn');
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
      toast.error('Đã xảy ra lỗi khi lấy chi tiết hóa đơn');
    }
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
      <div className="row">
        <div className="col d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item">Bill</li>
              <li className="breadcrumb-item active" aria-current="page">
                Detail-Bill
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <h3>Thông tin hóa đơn</h3>
          {bill ? (
            <div className="card">
              <div className="card-body">
                <p>
                  <strong>ID:</strong> {bill.id}
                </p>
                <p>
                  <strong>Người dùng ID:</strong> {bill.nguoiDungID}
                </p>
                <p>
                  <strong>Tổng tiền:</strong> {formatCurrency(bill.tong)}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {bill.status ? 'Đã duyệt' : 'Chưa duyệt'}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(bill.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}

          <h3 className="mt-4">Chi tiết hóa đơn</h3>
          {bill ? (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên máy</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {bill.ctHoaDonBans.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.tenSua}</td>
                    <td>{item.soLuong}</td>
                    <td>{formatCurrency(item.gia)}</td>
                    <td>{formatCurrency(item.tong)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailBill;

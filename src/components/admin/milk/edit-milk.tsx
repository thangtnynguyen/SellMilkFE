

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MilkService from '../../../services/milk.service';
import CategoryService from '../../../services/category.service';


interface ThongSo {
  tenThongSo: string;
  moTa: string;
}
const EditMilk:React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [milk, setMilk] = useState({
    ten: '',
    moTa: '',
    nguyenLieu: '',
    khoiLuong: '',
    loaiID: '',
    tonKho: 0,
    gia: {
      giaSanPham: 0,
      giaTruocGiam: 0,
      ngayBatDau: '',
      ngayKetThuc: '',
      status:true,
    },
    anh: '',
    anhKhac: '',
    anhKhacUrls: [],
    thongSos:[],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getMilkById();
    getCategories();
  }, []);

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const getMilkById = async () => {
    try {
      const response = await MilkService.getSuaById({ id });
      if (response.status) {
        const { ten, moTa, nguyenLieu, khoiLuong, loaiID, tonKho, gia,anh, anhKhac ,thongSos} = response.data;
        setMilk({
          ten,
          moTa,
          nguyenLieu,
          khoiLuong,
          loaiID,
          tonKho,
          gia: {
            giaSanPham: gia.giaSanPham,
            giaTruocGiam: gia.giaTruocGiam,
            ngayBatDau: formatDate(gia.ngayBatDau),
            ngayKetThuc: formatDate(gia.ngayKetThuc),
            status:gia.status
          },
          anh,
          anhKhac,
          anhKhacUrls: anhKhac ? anhKhac.split(',') : [],
          thongSos
        });
      }
    } catch (error) {
      console.error('Error fetching milk:', error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await CategoryService.getLoaiSua({});
      if (response.status) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
        formData.append('iD', id? id?.toString() :'0');
        formData.append('ten', milk.ten);
        formData.append('moTa', milk.moTa);
        formData.append('nguyenLieu', milk.nguyenLieu);
        formData.append('khoiLuong', milk.khoiLuong);
        formData.append('tonKho', milk.tonKho.toString());
        formData.append('loaiID', milk.loaiID.toString());

        // if (milk.anhFile) {
        //     formData.append('anhFile', milk.anhFile);
        // }
        // milk.anhKhacFile.forEach(file => {
        //     formData.append('anhKhacFile', file);
        // });

        formData.append('anh', milk.anh);
        formData.append('anhKhac', milk.anhKhac);

        milk.thongSos.forEach((thongSo:any, index:any) => {
            formData.append(`thongSos[${index}].tenThongSo`, thongSo.tenThongSo);
            formData.append(`thongSos[${index}].moTa`, thongSo.moTa);
        });

        formData.append('gia.giaSanPham', milk.gia.giaSanPham.toString());
        formData.append('gia.giaTruocGiam', milk.gia.giaTruocGiam.toString());
        if (milk.gia.ngayBatDau) {
            const ngayBatDau = new Date(milk.gia.ngayBatDau);
            formData.append('gia.ngayBatDau', ngayBatDau.toISOString().split('T')[0]);
        }
        if (milk.gia.ngayKetThuc) {
            const ngayKetThuc = new Date(milk.gia.ngayKetThuc);
            formData.append('gia.ngayKetThuc', ngayKetThuc.toISOString().split('T')[0]);
        }
        formData.append('gia.status', milk.gia.status.toString());

      const response = await MilkService.updateSua(formData);
      if (response.status) {
        toast.success('Sửa sữa thành công');
        navigate('/admin/milk/list');
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    } catch (error) {
      console.error('Error updating milk:', error);
      toast.error('Đã xảy ra lỗi');
    }
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setMilk({ ...milk, [name]: value });
  };

  const handleGiaChange = (e:any) => {
    const { name, value } = e.target;
    setMilk({ ...milk, gia: { ...milk.gia, [name]: value } });
  };

  const handleSelectChange = (e:any) => {
    const { name, value } = e.target;
    setMilk({ ...milk, [name]: value });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item">Milk</li>
              <li className="breadcrumb-item active" aria-current="page">Edit-Milk</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="tenMay">
              <Form.Label>Tên sữa</Form.Label>
              <Form.Control type="text" name="ten" value={milk.ten} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="moTa">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control as="textarea" rows={3} name="moTa" value={milk.moTa} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nguyenLieuSac">
              <Form.Label>Màu Sắc</Form.Label>
              <Form.Control type="text" name="nguyenLieu" value={milk.nguyenLieu} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="khoiLuong">
              <Form.Label>Dung Lượng</Form.Label>
              <Form.Control type="text" name="khoiLuong" value={milk.khoiLuong} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loaiID">
              <Form.Label>Chọn một danh mục</Form.Label>
              <Form.Control as="select" name="loaiID" value={milk.loaiID} onChange={handleSelectChange}>
                <option disabled>Chọn một danh mục</option>
                {categories.map((category:any) => (
                  <option key={category.id} value={category.id}>{category.ten}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="tonKho">
              <Form.Label>Tồn Kho</Form.Label>
              <Form.Control type="number" name="tonKho" value={milk.tonKho} onChange={handleInputChange} />
            </Form.Group>
            <h4>Thông Tin Giá</h4>
            <Form.Group className="mb-3" controlId="giaSanPham">
              <Form.Label>Giá</Form.Label>
              <Form.Control type="number" name="giaSanPham" value={milk.gia.giaSanPham} onChange={handleGiaChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="giaTruocGiam">
              <Form.Label>Giá Trước Giảm</Form.Label>
              <Form.Control type="number" name="giaTruocGiam" value={milk.gia.giaTruocGiam} onChange={handleGiaChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ngayBatDau">
              <Form.Label>Ngày Bắt Đầu</Form.Label>
              <Form.Control type="date" name="ngayBatDau" value={milk.gia.ngayBatDau} onChange={handleGiaChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ngayKetThuc">
              <Form.Label>Ngày Kết Thúc</Form.Label>
              <Form.Control type="date" name="ngayKetThuc" value={milk.gia.ngayKetThuc} onChange={handleGiaChange} />
            </Form.Group>
            <Button variant="success" type="submit">Sửa sữa</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditMilk;


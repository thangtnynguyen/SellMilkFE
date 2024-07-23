import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ComputerService from '../../../services/milk.service';
import CategoryService from '../../../services/category.service';
import { enviroment } from '../../../enviroment/enviroment';

const DetailMilk: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [computer, setComputer] = useState<any>({});
  const [category, setCategory] = useState<any>({});
  const baseUrlImage: string = enviroment.host.baseUrlImage;

  useEffect(() => {
    // Fetch computer details on component mount
    getComputerDetails();
    // Fetch base URL for images
  }, []);

  const getComputerDetails = () => {
    ComputerService.getSuaById({ id })
      .then((result: any) => {
        if (result.status) {
          let computerData = result.data;
          computerData.quantity = 1;
          computerData.total = computerData.gia.giaSanPham;

          // Split and format additional images
          if (computerData.anhKhac) {
            computerData.anhKhacUrls = computerData.anhKhac.split(',').map((url: string) => `${baseUrlImage}/${url}`);
          }

          // Fetch category information
          CategoryService.getLoaiSuaById({ id: computerData.loaiID })
            .then((result: any) => {
              if (result.status) {
                setCategory(result.data);
              }
            })
            .catch((error: any) => {
              console.error('Error fetching category:', error);
            });

          setComputer(computerData);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching computer details:', error);
      });
  };

  const formatCurrency = (value: number): string => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    });

    return formatter.format(value);
  };

//   const handleAddToCart = () => {
//     // Handle adding to cart logic
//     Swal.fire({
//       icon: 'success',
//       title: 'Đã thêm vào giỏ hàng',
//       showConfirmButton: false,
//       timer: 1500
//     });
//   };

  return (
    <Container className="mt-4">
      <Row>
        <Col className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item">Computer</li>
              <li className="breadcrumb-item active" aria-current="page">Detail-Computer</li>
            </ol>
          </nav>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={6}>
          <Image src={`${baseUrlImage}/${computer.anh}`} fluid thumbnail alt="Ảnh sản phẩm" />
          <Row className="mt-3">
            <Col md={6}>
              <h5>{computer.ten}</h5>
              <p><strong>Mô tả:</strong> {computer.moTa}</p>
              <p><strong>Màu sắc:</strong> {computer.mau}</p>
              <p><strong>Dung lượng:</strong> {computer.dungLuong}</p>
              <p><strong>Tồn kho:</strong> {computer.tonKho}</p>
            </Col>
            <Col md={6}>
              <h5>Thông số kỹ thuật</h5>
              <ul className="list-group">
                {computer.thongSoKyThuats && computer.thongSoKyThuats.map((thongSoKyThuat: any, index: number) => (
                  <li key={index} className="list-group-item"><strong>{thongSoKyThuat.tenThongSo}</strong> {thongSoKyThuat.moTa}</li>
                ))}
              </ul>
              <p><strong>Giá sản phẩm:</strong> {formatCurrency(computer.gia?.giaSanPham)}</p>
              <p><strong>Giá trước giảm:</strong> {formatCurrency(computer.gia?.giaTruocGiam)}</p>
              <p><strong>Ngày bắt đầu giảm giá:</strong> {new Date(computer.gia?.ngayBatDau).toLocaleDateString('vi-VN')}</p>
              <p><strong>Ngày kết thúc giảm giá:</strong> {new Date(computer.gia?.ngayKetThuc).toLocaleDateString('vi-VN')}</p>
            </Col>
          </Row>
        </Col>
        <Col md={6}>
          <h5>Ảnh khác</h5>
          <Row>
            {computer.anhKhacUrls && computer.anhKhacUrls.map((url: string, index: number) => (
              <Col key={index}>
                <Image src={`${url}`} fluid thumbnail alt="Ảnh sản phẩm" />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {/* <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
        </Col>
      </Row> */}
    </Container>
  );
};

export default DetailMilk;

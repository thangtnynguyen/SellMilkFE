import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import ComputerService from '../../../services/milk.service';
import CategoryService from '../../../services/category.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


interface ThongSo {
    tenThongSo: string;
    moTa: string;
}

interface Gia {
    giaSanPham: number;
    giaTruocGiam: number;
    ngayBatDau: Date | null;
    ngayKetThuc: Date | null;
    status: boolean | true;
}


// Khai báo interface sua với anhKhac là string[]
interface sua {
    ten: string;
    moTa: string;
    nguyenLieu: string;
    khoiLuong: string;
    anhFile: any,
    anh: string;
    anhKhacFile: File[];
    anhKhac: string[];
    loaiID: number;
    tonKho: number;
    thongSos: ThongSo[];
    gia: Gia;
}

const AddMilk: React.FC = () => {

    const navigate = useNavigate();
    const [sua, setsua] = useState<sua>({
        ten: '',
        moTa: '',
        nguyenLieu: '',
        khoiLuong: '',
        anhFile: null,
        anh: '',
        anhKhacFile: [],
        anhKhac: [],
        loaiID: 1,
        tonKho: 0,
        thongSos: [{ tenThongSo: '', moTa: '' }],
        gia: { giaSanPham: 0, giaTruocGiam: 0, ngayBatDau: null, ngayKetThuc: null, status: true }
    });

    const [categories, setCategories] = useState<any[]>([]);

    // Function to handle file selection for main image
    const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setsua(prevState => ({
                    ...prevState,
                    anhFile: file,
                    anh: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    // Function to handle file selection for additional images
    const onFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []) as File[];
        setsua({ ...sua, anhKhacFile: files });

        files.forEach(file => {
            const url = URL.createObjectURL(file);
            setsua(prevState => ({ ...prevState, anhKhac: [...prevState.anhKhac, url] }));
        });
    };

    // Function to remove an additional image
    const xoaAnh = (index: number) => {
        const updatedAnhKhac = sua.anhKhac.filter((_, idx) => idx !== index);
        const updatedAnhKhacFile = sua.anhKhacFile.filter((_, idx) => idx !== index);
        setsua({ ...sua, anhKhac: updatedAnhKhac, anhKhacFile: updatedAnhKhacFile });
        URL.revokeObjectURL(sua.anhKhac[index]); // Free memory
    };

    // Function to remove all additional images
    const xoaTatCaAnh = () => {
        sua.anhKhac.forEach(url => URL.revokeObjectURL(url));
        setsua({ ...sua, anhKhac: [], anhKhacFile: [] });
    };

    // Function to handle adding a specification
    const themThongSo = () => {
        setsua(prevState => ({
            ...prevState,
            thongSos: [...prevState.thongSos, { tenThongSo: '', moTa: '' }]
        }));
    };

    // Function to handle removing a specification
    const xoaThongSo = (index: number) => {
        const updatedThongSos = sua.thongSos.filter((_, idx) => idx !== index);
        setsua({ ...sua, thongSos: updatedThongSos });
    };

    // Function to handle form submission
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('ten', sua.ten);
        formData.append('moTa', sua.moTa);
        formData.append('nguyenLieu', sua.nguyenLieu);
        formData.append('khoiLuong', sua.khoiLuong);
        formData.append('tonKho', sua.tonKho.toString());
        formData.append('loaiID', sua.loaiID.toString());

        if (sua.anhFile) {
            formData.append('anhFile', sua.anhFile);
        }

        sua.anhKhacFile.forEach(file => {
            formData.append('anhKhacFile', file);
        });

        formData.append('anh', 'computer');
        formData.append('anhKhac', 'list-computer');

        sua.thongSos.forEach((thongSo, index) => {
            formData.append(`thongSos[${index}].tenThongSo`, thongSo.tenThongSo);
            formData.append(`thongSos[${index}].moTa`, thongSo.moTa);
        });

        formData.append('gia.giaSanPham', sua.gia.giaSanPham.toString());
        formData.append('gia.giaTruocGiam', sua.gia.giaTruocGiam.toString());
        if (sua.gia.ngayBatDau) {
            const ngayBatDau = new Date(sua.gia.ngayBatDau);
            formData.append('gia.ngayBatDau', ngayBatDau.toISOString().split('T')[0]);
        }
        if (sua.gia.ngayKetThuc) {
            const ngayKetThuc = new Date(sua.gia.ngayKetThuc);
            formData.append('gia.ngayKetThuc', ngayKetThuc.toISOString().split('T')[0]);
        }
        formData.append('gia.status', sua.gia.status.toString());

        try {
            const response = await ComputerService.createSua(formData);
            if (response.status) {
                toast.success('Thêm máy tính thành công');
                navigate('/admin/milk/list');
            }
        } catch (error) {
            console.error('Error adding computer:', error);
            alert('Đã xảy ra lỗi khi thêm máy tính');
        }

        // console.log(sua);

    };

    // Function to fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await CategoryService.getLoaiSua({});
                if (result.status) {
                    setCategories(result.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Handle error as needed
            }
        };

        fetchCategories();
    }, []);

    // Function to format date for input
    const formatDateInput = (date: Date | null) => {
        return date ? date.toISOString().split('T')[0] : '';
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col className="d-flex justify-content-end">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Admin</li>
                            <li className="breadcrumb-item">Computer</li>
                            <li className="breadcrumb-item active" aria-current="page">Add-Computer</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="tenMay">
                            <Form.Label>Tên Sữa</Form.Label>
                            <Form.Control type="text" value={sua.ten} onChange={e => setsua({ ...sua, ten: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="moTa">
                            <Form.Label>Mô Tả</Form.Label>
                            <Form.Control as="textarea" rows={3} value={sua.moTa} onChange={e => setsua({ ...sua, moTa: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="nguyenLieu">
                            <Form.Label>Nguyên Liệu</Form.Label>
                            <Form.Control type="text" value={sua.nguyenLieu} onChange={e => setsua({ ...sua, nguyenLieu: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="khoiLuong">
                            <Form.Label>Khối Lượng</Form.Label>
                            <Form.Control type="text" value={sua.khoiLuong} onChange={e => setsua({ ...sua, khoiLuong: e.target.value })} />
                            {/* <Form.Control type="text" value={sua.khoiLuong} onChange={e => setsua({ ...sua, khoiLuong: e.target.value })} /> */}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="anh">
                            <Form.Label>Ảnh</Form.Label>
                            <Form.Control type="file" onChange={onFileSelected} />
                            {sua.anh && <Image src={sua.anh as string} className="img-preview mt-3 img-thumbnail img-fluid" style={{ maxHeight: '200px' }} />}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="anhKhac">
                            <Form.Label>Ảnh Khác</Form.Label>
                            <Form.Control type="file" onChange={onFilesSelected} multiple />
                            {sua.anhKhac.length > 0 && (
                                <div className="mt-2">
                                    <Button variant="danger" onClick={xoaTatCaAnh} className="mb-3">Xóa Tất Cả Ảnh</Button>
                                    <div className="d-flex flex-wrap">
                                        {sua.anhKhac.map((image, index) => (
                                            <div key={index} className="p-2">
                                                <Image src={image} className="img-preview" style={{ maxHeight: '200px', maxWidth: '200px' }} />
                                                <Button variant="danger" onClick={() => xoaAnh(index)} className="btn-sm mt-2">Xóa</Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loaiID">
                            <Form.Label>Chọn một danh mục</Form.Label>
                            <Form.Control as="select" value={sua.loaiID} onChange={e => setsua({ ...sua, loaiID: parseInt(e.target.value) })}>
                                <option disabled>Chọn một danh mục</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.ten}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="tonKho">
                            <Form.Label>Tồn Kho</Form.Label>
                            <Form.Control type="number" value={sua.tonKho} onChange={e => setsua({ ...sua, tonKho: parseInt(e.target.value) })} />
                        </Form.Group>

                        <div className="mb-3">
                            <h4>Thông Số</h4>
                            {sua.thongSos.map((thongSo, index) => (
                                <div key={index} className="mb-3 row">
                                    <Col>
                                        <Form.Control type="text" value={thongSo.tenThongSo} onChange={e => {
                                            const updatedThongSos = [...sua.thongSos];
                                            updatedThongSos[index].tenThongSo = e.target.value;
                                            setsua({ ...sua, thongSos: updatedThongSos });
                                        }} placeholder="Tên thông số" />
                                    </Col>
                                    <Col>
                                        <Form.Control type="text" value={thongSo.moTa} onChange={e => {
                                            const updatedThongSos = [...sua.thongSos];
                                            updatedThongSos[index].moTa = e.target.value;
                                            setsua({ ...sua, thongSos: updatedThongSos });
                                        }} placeholder="Mô tả" />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="danger" onClick={() => xoaThongSo(index)}>Xóa</Button>
                                    </Col>
                                </div>
                            ))}
                            <Button variant="primary" className="mb-3" onClick={themThongSo}>Thêm Thông Số</Button>
                        </div>

                        <div className="mb-3">
                            <h4>Thông Tin Giá</h4>
                            <Form.Group controlId="gia">
                                <Form.Label>Giá</Form.Label>
                                <Form.Control type="number" value={sua.gia.giaSanPham} onChange={e => setsua({ ...sua, gia: { ...sua.gia, giaSanPham: parseInt(e.target.value) } })} />
                            </Form.Group>
                            <Form.Group controlId="giaTruocGiam">
                                <Form.Label>Giá Trước Giảm</Form.Label>
                                <Form.Control type="number" value={sua.gia.giaTruocGiam} onChange={e => setsua({ ...sua, gia: { ...sua.gia, giaTruocGiam: parseInt(e.target.value) } })} />
                            </Form.Group>
                            <Form.Group controlId="ngayBatDau">
                                <Form.Label>Ngày Bắt Đầu</Form.Label>
                                <Form.Control type="date" value={formatDateInput(sua.gia.ngayBatDau)} onChange={e => setsua({ ...sua, gia: { ...sua.gia, ngayBatDau: new Date(e.target.value) } })} />
                            </Form.Group>
                            <Form.Group controlId="ngayKetThuc">
                                <Form.Label>Ngày Kết Thúc</Form.Label>
                                <Form.Control type="date" value={formatDateInput(sua.gia.ngayKetThuc)} onChange={e => setsua({ ...sua, gia: { ...sua.gia, ngayKetThuc: new Date(e.target.value) } })} />
                            </Form.Group>
                        </div>

                        <Button variant="success" type="submit">Thêm Sữa</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddMilk;

const Footer = () => {
    return (
        <div>
            <footer className="footer bg-dark text-light py-4 px-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h5>Thông tin liên hệ</h5>
                            <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
                            <p>Email: khoi@gmail.com</p>
                            <p>Điện thoại: 0123-456-789</p>
                        </div>
                        <div className="col-md-4">
                            <h5>Liên kết nhanh</h5>
                            <ul className="list-unstyled">
                                <li><a href="#">Trang chủ</a></li>
                                <li><a href="#">Sản phẩm</a></li>
                                <li><a href="#">Dịch vụ</a></li>
                                <li><a href="#">Giới thiệu</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h5>Theo dõi chúng tôi</h5>
                            <ul className="list-inline social-icons">
                                <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                <li className="list-inline-item"><a href="#"><i className="fab fa-twitter"></i></a></li>
                                <li className="list-inline-item"><a href="#"><i className="fab fa-instagram"></i></a></li>
                                <li className="list-inline-item"><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>        </div>
    );
};
export default Footer;
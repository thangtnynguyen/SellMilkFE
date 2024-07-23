import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { enviroment } from '../../enviroment/enviroment';
import BillService from '../../services/bill.service';
import '../../assets/css/user/detail-history.css';

interface BillDetail {
	id: number;
	createdAt: string;
	tong: number;
	status: boolean;
	ctHoaDonBans: {
		tenSua: string;
		soLuong: number;
		gia: number;
		tong: number;
		sua: { anh: string };
	}[];
}

const DetailHistory: React.FC = () => {
	const [bill, setBill] = useState<BillDetail | null>(null);
	const { id } = useParams<{ id: string }>();
	const baseUrlImage = enviroment.host.baseUrlImage;

	useEffect(() => {
		const request = { id };
		getHoaDonBan(request);
	}, [id]);

	const getHoaDonBan = async (request: any) => {
		try {
			const result = await BillService.getHoaDonBanById(request);
			setBill(result.data);
		} catch (error) {
			console.error('Error fetching bill:', error);
		}
	};

	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
		}).format(value);
	};

	if (!bill) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col-md-12">
					<div className="card">
						<div className="card-header">
							<h4>Hóa đơn số: #{bill.id}</h4>
						</div>
						<div className="card-body">
							<p>Ngày tạo: {new Date(bill.createdAt).toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}</p>
							<p>Tổng tiền: {formatCurrency(bill.tong)}</p>
							<span className={`badge ${bill.status ? 'bg-success' : 'bg-danger'}`}>
								Trạng thái: {bill.status ? 'Hoàn thành' : 'Chưa hoàn thành'}
							</span>
							<hr />
							<h5>Chi tiết hóa đơn</h5>
							<table className="table table-bordered table-striped custom-table mt-3">
								<thead className="custom-color">
									<tr>
										<th>#</th>
										<th>Tên Sữa</th>
										<th>Số lượng</th>
										<th>Đơn giá</th>
										<th>Tổng</th>
									</tr>
								</thead>
								<tbody>
									{bill.ctHoaDonBans.map((item, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td className="d-flex align-items-center">
												{item.tenSua}
												<img
													src={`${baseUrlImage}/${item.sua.anh}`}
													alt="product"
													className="img-fluid img-thumbnail ms-3"
													style={{ maxHeight: '100px', maxWidth: '200px' }}
												/>
											</td>
											<td>{item.soLuong}</td>
											<td>{formatCurrency(item.gia)}</td>
											<td>{formatCurrency(item.tong)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailHistory;

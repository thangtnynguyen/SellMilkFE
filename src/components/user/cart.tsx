import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import CartService from '../../services/cart.service';
import BillService from '../../services/bill.service';
import { enviroment } from '../../enviroment/enviroment';
import { useAuth } from '../../context/app.context';
import '../../assets/css/user/blank.css';
import '../../assets/css/user/cart.css';


const Cart: React.FC = () => {
  const [carts, setCarts] = useState<any[]>([]);
  const baseUrlImage: string = enviroment.host.baseUrlImage;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const request = { id: user?.id };
    getGioHang(request);
  }, [user]);

  const getGioHang = async (request: any) => {
    try {
      const result = await CartService.getGioHangByNguoiDungId(request);
      if (result.status) {
        const cartsWithSelected = result.data.data.map((cart: any) => ({
          ...cart,
          selected: cart.selected ?? false,
        }));
        setCarts(cartsWithSelected);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const buySelected = async () => {
    const selectedItems = carts.filter(item => item.selected);
    const tongPre = selectedItems.reduce((total, item) => total + (item.gia * item.soLuong), 0);
    if (selectedItems.length === 0) {
      toast.warning('Không có sữa được chọn');
    } else {
      const contentHTML = selectedItems.map(item => (
        `<tr>
          <td>${item.tenSua.slice(0, 30)}</td>
          <td>${formatCurrency(item.gia)}</td>
          <td>${item.soLuong}</td>
          <td>${formatCurrency(item.gia * item.soLuong)}</td>
        </tr>`
      )).join('') + `
        <tr>
          <td>Tổng</td>
          <td colspan="3">${formatCurrency(tongPre)}</td>
        </tr>`;

      Swal.fire({
        title: 'Bạn có chắc muốn mua danh sách sữa này không',
        html: `<div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tbody>${contentHTML}</tbody>
          </table>
        </div>`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Bỏ qua',
        customClass: {
          cancelButton: "btn btn-danger ms-5",
          confirmButton: "btn btn-success",
          popup: 'my-modal'
        }
      }).then(async result => {
        if (result.isConfirmed) {
          const request = {
            nguoiDungID: user.id,
            tong: tongPre,
            ctHoaDonBans: selectedItems.map(item => ({
              suaID: item.suaID,
              tenSua: item.tenSua,
              soLuong: item.soLuong,
              gia: item.gia
            }))
          };
          try {
            const result1 = await BillService.addHoaDonBan(request);
            if (result1.status) {
              const ids = selectedItems.map(item => item.id);
              const request1 = { ids };
              const result2 = await CartService.deleteNhieuGioHang(request1);
              if (result2.status) {
                toast.success('Mua sữa thành công');
                navigate('/history');
              }
            } else {
              toast.error('Mua sữa thất bại');
            }
          } catch (error) {
            toast.error('Mua sữa thất bại');
          }
        }
      });
    }
  };

  const deleteCart = async (id: number) => {
    const request = { id };
    try {
      const result = await CartService.deleteGioHang(request);
      if (result.status) {
        toast.success('Xóa cart thành công',);
        setCarts(carts.filter(cart => cart.id !== id));
      } else {
        toast.error('Xóa cart thất bại');
      }
    } catch (error) {
      toast.error('Xóa cart thất bại');
    }
  };

  const updateCart = async (cart: any) => {
    const request = { id: cart.id, soLuong: cart.soLuong };
    try {
      const result = await CartService.updateGioHang(request);
      if (result.status) {
        toast.success('Update cart thành công',);
      } else {
        toast.error('Update cart thất bại');
      }
    } catch (error) {
      toast.error('Update cart thất bại');
    }
  };

  const getTotalForCart = (cart: any): number => cart.gia * cart.soLuong;

  const getTotalPrice = (): number => carts.reduce((total, cart) => total + (cart.gia * cart.soLuong), 0);

  const increaseQuantity = (cart: any): void => {
    const updatedCarts = carts.map(c => {
      if (c.id === cart.id) {
        return { ...c, soLuong: c.soLuong + 1 };
      }
      return c;
    });
    setCarts(updatedCarts);
  };

  const decreaseQuantity = (cart: any): void => {
    if (cart.soLuong > 1) {
      const updatedCarts = carts.map(c => {
        if (c.id === cart.id) {
          return { ...c, soLuong: c.soLuong - 1 };
        }
        return c;
      });
      setCarts(updatedCarts);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleCheckboxChange = (cartId: number) => {
    const updatedCarts = carts.map(cart => {
      if (cart.id === cartId) {
        return { ...cart, selected: !cart.selected };
      }
      return cart;
    });
    setCarts(updatedCarts);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      {carts.length === 0 ? (
        <div className="blank">
          <h3>No items in the cart</h3>
        </div>
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map(cart => (
                <tr key={cart.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={cart.selected || false}
                      onChange={() => handleCheckboxChange(cart.id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`${baseUrlImage}/${cart.sua.anh}`}
                        alt="product"
                        className="img-thumbnail ttt me-2"
                        style={{ maxHeight: '100px', maxWidth: '100px' }}
                      />
                      <span>{cart.tenSua}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(cart.gia)}</td>
                  <td>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => decreaseQuantity(cart)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control ttt text-center"
                        value={cart.soLuong}
                        readOnly
                        style={{ maxWidth: '50px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => increaseQuantity(cart)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatCurrency(getTotalForCart(cart))}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger me-2"
                      onClick={() => deleteCart(cart.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => updateCart(cart)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-5">
            <button className="btn btn-primary" onClick={buySelected}>
              Buy Selected
            </button>
            <h3>Total: {formatCurrency(getTotalPrice())}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;







































// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Swal from 'sweetalert2';
// import CartService from '../../services/cart.service';
// import BillService from '../../services/bill.service';
// import { enviroment } from '../../enviroment/enviroment';
// import { useAuth } from '../../context/app.context';
// import '../../assets/css/user/blank.css';

// const Cart: React.FC = () => {
//   const [carts, setCarts] = useState<any[]>([]);
//   const baseUrlImage: string = enviroment.host.baseUrlImage;
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();

//   useEffect(() => {
//     const request = { id: user?.id };
//     getGioHang(request);
//   }, [user]);

//   const getGioHang = async (request: any) => {
//     try {
//       const result = await CartService.getGioHangByNguoiDungId(request);
//       if (result.status) {
//         const cartsWithSelected = result.data.data.map((cart: any) => ({
//           ...cart,
//           selected: cart.selected ?? false,
//         }));
//         setCarts(cartsWithSelected);
//       }
//     } catch (error) {
//       console.error('Failed to fetch cart', error);
//     }
//   };

//   const buySelected = async () => {
//     const selectedItems = carts.filter(item => item.selected);
//     const tongPre = selectedItems.reduce((total, item) => total + (item.gia * item.soLuong), 0);
//     if (selectedItems.length === 0) {
//       toast.warning('Không có sữa được chọn');
//     } else {
//       const contentHTML = selectedItems.map(item => (
//         `<tr>
//           <td>${item.tenSua.slice(0, 30)}</td>
//           <td>${formatCurrency(item.gia)}</td>
//           <td>${item.soLuong}</td>
//           <td>${formatCurrency(item.gia * item.soLuong)}</td>
//         </tr>`
//       )).join('') + `
//         <tr>
//           <td>Tổng</td>
//           <td colspan="3">${formatCurrency(tongPre)}</td>
//         </tr>`;

//       Swal.fire({
//         title: 'Bạn có chắc muốn mua danh sách sữa này không',
//         html: `<div class="table-responsive">
//           <table class="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Price</th>
//                 <th>Quantity</th>
//                 <th>SubTotal</th>
//               </tr>
//             </thead>
//             <tbody>${contentHTML}</tbody>
//           </table>
//         </div>`,
//         showCancelButton: true,
//         confirmButtonText: 'Xác nhận',
//         cancelButtonText: 'Bỏ qua',
//         customClass: {
//           cancelButton: "btn btn-danger ms-5",
//           confirmButton: "btn btn-success",
//           popup: 'my-modal'
//         }
//       }).then(async result => {
//         if (result.isConfirmed) {
//           const request = {
//             nguoiDungID: user.id,
//             tong: tongPre,
//             ctHoaDonBans: selectedItems.map(item => ({
//               suaID: item.suaID,
//               tenSua: item.tenSua,
//               soLuong: item.soLuong,
//               gia: item.gia
//             }))
//           };
//           try {
//             const result1 = await BillService.addHoaDonBan(request);
//             if (result1.status) {
//               const ids = selectedItems.map(item => item.id);
//               const request1 = { ids };
//               const result2 = await CartService.deleteNhieuGioHang(request1);
//               if (result2.status) {
//                 toast.success('Mua sữa thành công');
//                 navigate('/history');
//               }
//             } else {
//               toast.error('Mua sữa thất bại');
//             }
//           } catch (error) {
//             toast.error('Mua sữa thất bại');
//           }
//         }
//       });
//     }
//   };

//   const deleteCart = async (id: number) => {
//     const request = { id };
//     try {
//       const result = await CartService.deleteGioHang(request);
//       if (result.status) {
//         toast.success('Xóa cart thành công',);
//         setCarts(carts.filter(cart => cart.id !== id));
//       } else {
//         toast.error('Xóa cart thất bại');
//       }
//     } catch (error) {
//       toast.error('Xóa cart thất bại');
//     }
//   };

//   const updateCart = async (cart: any) => {
//     const request = { id: cart.id, soLuong: cart.soLuong };
//     try {
//       const result = await CartService.updateGioHang(request);
//       if (result.status) {
//         toast.success('Update cart thành công',);
//       } else {
//         toast.error('Update cart thất bại');
//       }
//     } catch (error) {
//       toast.error('Update cart thất bại');
//     }
//   };

//   const getTotalForCart = (cart: any): number => cart.gia * cart.soLuong;

//   const getTotalPrice = (): number => carts.reduce((total, cart) => total + (cart.gia * cart.soLuong), 0);

//   const increaseQuantity = (cart: any): void => {
//     const updatedCarts = carts.map(c => {
//       if (c.id === cart.id) {
//         return { ...c, soLuong: c.soLuong + 1 };
//       }
//       return c;
//     });
//     setCarts(updatedCarts);
//   };

//   const decreaseQuantity = (cart: any): void => {
//     if (cart.soLuong > 1) {
//       const updatedCarts = carts.map(c => {
//         if (c.id === cart.id) {
//           return { ...c, soLuong: c.soLuong - 1 };
//         }
//         return c;
//       });
//       setCarts(updatedCarts);
//     }
//   };

//   const formatCurrency = (value: number): string => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       minimumFractionDigits: 0
//     }).format(value);
//   };

//   const handleCheckboxChange = (cartId: number) => {
//     const updatedCarts = carts.map(cart => {
//       if (cart.id === cartId) {
//         return { ...cart, selected: !cart.selected };
//       }
//       return cart;
//     });
//     setCarts(updatedCarts);
//   };

//   return (
//     <div className="container">
//       <ToastContainer />
//       {carts.length === 0 ? (
//         <div className='blank'>
//           No items in the cart
//         </div>
//       ) : (
//         <div className="table-responsive mb-5">
//           <table className="table table-striped table-hover">
//             <thead>
//               <tr>
//                 <th>+</th>
//                 <th>Name</th>
//                 <th>Price</th>
//                 <th>Quantity</th>
//                 <th>Total</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {carts.map(cart => (
//                 <tr key={cart.id}>
//                   <td>
//                     <input type="checkbox" checked={cart.selected || false} onChange={() => handleCheckboxChange(cart.id)} />
//                   </td>
//                   <td className="d-flex flex-column">
//                     {cart.tenSua}
//                     <img src={`${baseUrlImage}/${cart.sua.anh}`} alt="computer" className="img-fluid img-thumbnail" style={{ maxHeight: '100px', maxWidth: '200px' }} />
//                   </td>
//                   <td>{formatCurrency(cart.gia)}</td>
//                   <td>
//                     <div className="btn-group" role="group">
//                       <button type="button" className="btn btn-secondary" onClick={() => decreaseQuantity(cart)}>-</button>
//                       <span className="btn btn-light">{cart.soLuong}</span>
//                       <button type="button" className="btn btn-secondary" onClick={() => increaseQuantity(cart)}>+</button>
//                     </div>
//                   </td>
//                   <td>{formatCurrency(getTotalForCart(cart))}</td>
//                   <td>
//                     <button type="button" className="btn btn-outline-danger" title="Delete" onClick={() => deleteCart(cart.id)}>
//                       <i className="fas fa-trash-alt"></i>
//                     </button>
//                     <button type="button" className="btn btn-outline-secondary me-2" title="Update Quantity" onClick={() => updateCart(cart)}>
//                       <i className="fas fa-pencil-alt"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="d-flex mt-5">
//             <button className="btn btn-primary" onClick={buySelected}>Buy Selected</button>
//             <div className="flex-grow-1"></div>
//             <h3 style={{ order: 1 }}>Total: {formatCurrency(getTotalPrice())}</h3>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

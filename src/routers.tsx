import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AppLayout from "./components/user/layout/layout";
import Home from "./components/user/home";
import Detail from "./components/user/detail";
import History from "./components/user/history";
import Cart from "./components/user/cart";
import Login from "./components/user/login";
import DetailHistory from "./components/user/detail-history";
import AppLayoutAdmin from "./components/admin/layout/layout";
import ListMilk from "./components/admin/milk/list-milk";
import DetailMilk from "./components/admin/milk/detail-milk";
import AddMilk from "./components/admin/milk/add-milk";
import EditMilk from "./components/admin/milk/edit-milk";
import ListCategory from "./components/admin/category/list-category";
import AddCategory from "./components/admin/category/add-category";
import ListBill from "./components/admin/bill/list-bill";
import DetailBill from "./components/admin/bill/detail-bill";
import ListAccount from "./components/admin/account/list-account";
import AdminProtected from "./protecteds/admin";
import LoginAdmin from "./components/admin/login";
import Signup from "./components/user/sign-up";
import Dashboard from "./components/admin/dashboard";

const routers = createBrowserRouter([
	{
		path: "",
		element: (
			<>
				{" "}
				<ScrollToTop />
				<AppLayout />
			</>
		),
		errorElement: (
			<AppLayout>
				<div>
					Trang bị lỗi!!!!!!!!!!!!
				</div>
			</AppLayout>
		),
		children: [
			{
				path: "",
				element: (
					<Home />
				),
			},
			{
				path: "home",
				element: (
					<Home />
				),
			},
			{
				path: "detail/:id",
				element: (

					<Detail />
				),
			},
			{
				path: "history",
				element: (
					<History />
				),
			},
			{
				path: "history/detail/:id",
				element: (
					<DetailHistory />
				),
			},
			{
				path: "cart",
				element: (
					<Cart />
				),
			}
		],
	},
	{
		path: "admin",
		element: (
			<>
				{" "}
				<ScrollToTop />
				<AdminProtected>
					<AppLayoutAdmin />
				</AdminProtected>
			</>
		),
		errorElement: (
			<AppLayoutAdmin>
				<div>
					Trang bị lỗi !!!!!!!!!!!!1
				</div>
			</AppLayoutAdmin>
		),
		children: [
			//dashboard
			{
				path: "/admin/",
				element: (
					<Dashboard />
				),
			},
			{
				path: "/admin/dashboard",
				element: (
					<Dashboard />
				),
			},
			//milk
			{
				path: "/admin/milk/list",
				element: (
					<ListMilk />
				),
			},
			{
				path: "/admin/milk/detail/:id",
				element: (
					<DetailMilk />
				),
			},
			{
				path: "/admin/milk/add",
				element: (
					<AddMilk />
				),
			},
			{
				path: "/admin/milk/edit/:id",
				element: (
					<EditMilk />
				),
			},
			//category
			{
				path: "/admin/category/list",
				element: (
					<ListCategory />
				),
			},
			{
				path: "/admin/category/add",
				element: (
					<AddCategory />
				),
			},
			//bill
			{
				path: "/admin/bill/list",
				element: (
					<ListBill />
				),
			},
			{
				path: "/admin/bill/detail/:id",
				element: (
					<DetailBill />
				),
			},
			//account
			{
				path: "/admin/account/list",
				element: (
					<ListAccount />
				),
			},

		],
	},
	{
		path: "login",
		element: <Login />,
	},
	{
		path: "admin/login",
		element: <LoginAdmin />,
	},
	{
		path: "/sign-up",
		element: <Signup />,
	},
	
]);

export default routers;

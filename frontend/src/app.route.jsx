import {createBrowserRouter} from "react-router-dom";
import  Register  from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProductList from "./features/seller/pages/ProductList";
import CreateProduct from "./features/seller/pages/CreateProduct";
import EditProduct from "./features/seller/pages/EditProduct";
import ProductDetails from "./features/buyer/pages/ProductDetails";
import Profile from "./features/buyer/pages/Profile";
import CartPage from "./features/buyer/pages/CartPage";
import OrdersPage from "./features/buyer/pages/OrdersPage";
import SellerOrders from "./features/seller/pages/SellerOrders";
import SellerTickets from "./features/seller/pages/SellerTickets";

export const router = createBrowserRouter([
    {
        path:"/",
        element: (
                <Home />
            
        )
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/forgot-password",
        element:<ForgotPassword/>
    },
    {
        path:"/reset-password",
        element:<ResetPassword/>
    },
    {
        path: "/product/:id",
        element: <ProductDetails />
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        )
    },
    {
        path: "/cart",
        element: (
            <ProtectedRoute role="buyer">
                <CartPage />
            </ProtectedRoute>
        )
    },
    {
        path: "/orders",
        element: (
            <ProtectedRoute role="buyer">
                <OrdersPage />
            </ProtectedRoute>
        )
    },
    {
        path:"/seller",
        children:[
            {
                path:'',
                element:(
                <ProtectedRoute role="seller">
                    <ProductList/>
                </ProtectedRoute>
            )
        },
        {
            path:'orders',
            element:(
                <ProtectedRoute role="seller">
                    <SellerOrders/>
                </ProtectedRoute>
            )
        },
        {
            path:'tickets',
            element:(
                <ProtectedRoute role="seller">
                    <SellerTickets/>
                </ProtectedRoute>
            )
        },
    {
        path:"/seller/products/new",
        element:(
            <ProtectedRoute role="seller">
                <CreateProduct/>
            </ProtectedRoute>
        )
    },
    {
        path:'/seller/products/edit/:id',
        element:(
            <ProtectedRoute role="seller">
                <EditProduct/>
            </ProtectedRoute>
        )
    }
    ]
    }
])
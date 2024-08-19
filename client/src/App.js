import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/customerPages/HomePage';
import CatalogPage from './pages/customerPages/CatalogPage';
import CartPage from './pages/customerPages/CartPage';
import LoginPage from './pages/customerPages/LoginPage';
import CheckoutPaymentInfoEdit from './pages/customerPages/CheckoutPaymentInfoEdit';
import TempLoginPage from "./pages/customerPages/LoginCreatePageTemp";
import AdminPage from './pages/adminPages/AdminPage';
import AddProduct from './pages/adminPages/AddProduct';
import TempTransactionPage from './pages/customerPages/TempTransactionPage';
import { useDispatch } from 'react-redux';
import { testSession } from './features/userManagement'
import AdminTransactionPage from './pages/adminPages/AdminTransactionPage';
import { fetchInventory } from './features/catalog';
import AdminManageUsers from './pages/adminPages/AdminManageUsers';
import ProfilePage from './pages/customerPages/ProfilePage';
//import UpdateProduct from '../src/pages/adminPages/UpdateProduct';
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(testSession());
    dispatch(fetchInventory());
  }, []);


  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/addProduct" element={<AddProduct />} />
          <Route path="/checkout/payment" element={<CheckoutPaymentInfoEdit />} />
          <Route path="/temptransactions" element={<TempTransactionPage />} />
          <Route path="/admin/transactions" element={<AdminTransactionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/management/users" element={<AdminManageUsers />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

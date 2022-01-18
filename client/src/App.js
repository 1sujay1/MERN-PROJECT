// import './App.css';
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import HomePage from './pages/homepage/homepage.component';
// import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';

import { GlobalStyle } from './global.styles';

// import SignInAndSignUp from './components/sign-in-and-sign-up/sign-in-and-sign-up.component';

import ErrorBoundary from './components/error-boundary/error-boundary.component.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from './redux/user/user.selectors';

// import { createStructuredSelector } from 'reselect';
// import Checkout from './pages/checkout/checkout.component';
import { checkUserSession } from './redux/user/user.actions';
import Loader from './components/loader/loader.component';

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const ShopPage = lazy(() => import('./pages/shop/shop.component'));
const SignInAndSignUp = lazy(() => import('./components/sign-in-and-sign-up/sign-in-and-sign-up.component'));
const Checkout = lazy(() => import('./pages/checkout/checkout.component'));

const App = () => {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkUserSession())
  }, [dispatch])

  return (
    <div>
      <GlobalStyle />
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>

            <Route path='/' element={<HomePage />} />

            <Route path='shop/*' element={<ShopPage />} />
            <Route
              path='/signin'
              element={currentUser
                ? (<Navigate replace to='/' />)
                : (<SignInAndSignUp />)
              }
            />
            <Route path='checkout' element={<Checkout />} />
            {/* <Route path='loader' element={<Loader />} /> */}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// const mapStateToProps = createStructuredSelector({
//   currentUser: selectCurrentUser
// })
// const mapDispatchToProps = dispatch => ({
//   checkUserSession: () => dispatch(checkUserSession())
// })

export default App;

import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import sellerReducer from '../features/seller/seller.slice'
import buyerReducer from '../features/buyer/buyer.slice'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        seller:sellerReducer,
        buyer:buyerReducer
    }
})
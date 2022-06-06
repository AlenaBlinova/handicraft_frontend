import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from "./userSlice";
import {cartSlice} from "./cartSlice";
// import {categorySlice} from "./categorySlice";
import {ordersSlice} from "./ordersSlice";
import {categoriesSlice} from "./categoriesSlice";
import {categorySlice} from "./categorySlice";

export default configureStore({
    reducer: {
        user: userSlice.reducer,
        cart: cartSlice.reducer,
        // menu: categorySlice.reducer,
        orders: ordersSlice.reducer,
        categories: categoriesSlice.reducer,
        category: categorySlice.reducer
    },
});
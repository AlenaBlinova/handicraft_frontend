import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./app/store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {MantineProvider} from "@mantine/core";
import {Wrapper} from "./components/Wrapper";
import {ModalsProvider} from "@mantine/modals";
import {About} from "./pages/About";
import {SignIn} from "./pages/Signin";
import {SignUp} from "./pages/Signup";
import {ForgotPassword} from "./pages/Forgot";
import {ResetPassword} from "./pages/Reset";
import {Orders} from "./pages/Orders";
import {Profile} from "./pages/Profile";
import {Cart} from "./pages/Cart";
import {Catalog} from "./pages/Catalog";
import {Category} from "./pages/Category";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{primaryColor: "indigo"}}>
            <Provider store={store}>
                <Wrapper>
                    <ModalsProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Home/>}/>
                                <Route path="/catalog" element={<Catalog/>}/>
                                <Route path="/catalog/:categoryId" element={<Category/>}/>
                                <Route path="/signin" element={<SignIn/>}/>
                                <Route path="/signup" element={<SignUp/>}/>
                                <Route path="/cart" element={<Cart/>}/>
                                <Route path="/about" element={<About/>}/>
                                <Route path="/account" element={<Profile/>}/>
                                <Route path="/orders" element={<Orders/>}/>
                                <Route path="/forgot" element={<ForgotPassword/>}/>
                                <Route path="/reset" element={<ResetPassword/>}/>
                            </Routes>
                        </BrowserRouter>
                    </ModalsProvider>
                </Wrapper>
            </Provider>
        </MantineProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

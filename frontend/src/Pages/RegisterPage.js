import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { NavLink } from "react-router-dom";

const RegisterPage = (props) => {
    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    const registerUser = (props) => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post("http://localhost:8000/user/register", {
                name, email, password,
            })
            .then((response) => {
                makeToast("success", response.data.message);
                window.location.replace(window.location.origin.toString() + "/login");
            })
            .catch((err) => {
                // console.log(err);
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                    makeToast("error", err.response.data.message);
            });
    };

    return (
        <div className="card">
            <div className="cardHeader">Register</div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="name">Name</label>
                    <input type="name" name="name" id="name" placeholder="Zhe Han" ref={nameRef}/>
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" email="email" id="email" placeholder="zhe.han@gmail.com" ref={emailRef}/>
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" password="password" id="password" placeholder="Your Secret" ref={passwordRef}/>
                </div>
                <button onClick={registerUser}>Register</button>
                <button style={{marginTop:1+'em'}}><NavLink to="/login">Go to Login Page</NavLink></button>
            </div>
        </div>
    );
};

export default RegisterPage;

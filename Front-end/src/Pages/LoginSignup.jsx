import React, { useState } from "react";
import './CSS/LoginSignup.css'

const LoginSignup = () => {

    const [state, setState] = useState("Login")
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const signup = async () => {
        console.log("Sign in function is exicuted", formData);
        let responseData;
        await fetch('https://e-commers-zter.vercel.app/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => responseData = data)
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        }
        else {
            alert(responseData.errors)
        }


    }
    const login = async () => {
        console.log("Login function is exicuted", formData);
        let responseData;
        await fetch('https://e-commers-zter.vercel.app/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => responseData = data)
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        }
        else {
            alert(responseData.errors)
        }
    }


    return (
        <div className="loginsignup">
            <div className="loginsignup-continer">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" /> : <></>}
                    <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
                    <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                </div>

                <button onClick={() =>{state==="Login"?login():signup()}}>Continue</button>

                {state === "Sign Up" ? <p className="loginsignup-login">Already have account? <span onClick={() => { setState("Login") }}>Login here</span></p> :
                    <p className="loginsignup-login">Create a account <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}

                <div className="loginsignup-agree">
                    <input type="checkbox" name="" id="" />
                    <p>By continuing, i agree to the terms of provacy policy. </p>
                </div>
            </div>

        </div>
    )

}
export default LoginSignup;
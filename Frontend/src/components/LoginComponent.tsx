import { useState } from 'react';
import '../styles/LoginComponentStyle.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function () {
    const navigate = useNavigate()
    const [userEmail, setEmail] = useState('')
    const [userPassword, setPassword] = useState('')
    const [token, setToken] = useState('')

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleLogin = async () => {
        try {
            axios.post("http://localhost:8080/api/auth/login", {email:userEmail, password:userPassword}).then(
                (response) => { 
                    const newToken = response.data.token;
                    setToken(newToken);
                    localStorage.setItem("Token", newToken);
                    navigate("/home");
                }
            ).catch(
                () => {window.alert("Login Failed")}
            )
            //navigate(`/home`);

        } catch (error) {
            console.error("Login error:", error);
            window.alert("Login Failed");
        }

        window.localStorage.setItem("Token", token)
    };

    const handleRegister = async () => {
        navigate("/register")
    }

    return (
        <div className="page-container d-flex justify-content-center align-items-center">
            <div className="login-box d-flex flex-column justify-content-center align-items-center gap-3">
                <div className="email-input w-100 d-flex justify-content-between align-items-center">
                    <label htmlFor="">email</label>
                    <input className="input-box" type="email" onChange={handleEmailChange} placeholder="john@example.com"/>
                </div>
                <div className="password-input w-100 d-flex justify-content-between align-items-center gap-5">
                    <label htmlFor="">password</label>
                    <input className="input-box" type="password" onChange={handlePasswordChange} placeholder="enter your password"/>
                </div>
                <div className="action-btns w-100 d-flex justify-content-between align-items-center mt-3">
                    <button className="register" onClick={handleRegister}>dont have an account yet?</button>
                    <button className="submit" onClick={handleLogin}>log in</button>
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [Name, setName] = useState<String>('')
    const [Age, setAge] = useState<Number>(0)
    const [Email, setEmail] = useState<String>('')
    const [Password, setPassword] = useState<String>('')

    const navigate = useNavigate()

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value)
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleSubmit = async () => {
        try {
            axios.post("http://localhost:8080/api/auth/register", {name:Name, age:Age, email:Email, password:Password}).then(
                (response) => { 
                    navigate("/login")
                }
            ).catch(
                () => {window.alert("Register Failed")}
            )
            //navigate(`/home`);

        } catch (error) {
            console.error("Register error:", error);
            window.alert("Register Failed");
        }
    }

    return (
        <div className="page-container d-flex justify-content-center align-items-center">
            <div className="login-box d-flex flex-column justify-content-center align-items-center gap-3">
                <div className="email-input w-100 d-flex justify-content-between align-items-center">
                    <label htmlFor="">Name</label>
                    <input className="input-box" type="text" onChange={handleNameChange} placeholder="John Dane"/>
                </div>
                <div className="email-input w-100 d-flex justify-content-between align-items-center">
                    <label htmlFor="">Age</label>
                    <input className="input-box" type="number" onChange={handleAgeChange} placeholder="i.e. 18"/>
                </div>
                <div className="email-input w-100 d-flex justify-content-between align-items-center">
                    <label htmlFor="">email</label>
                    <input className="input-box" type="email" onChange={handleEmailChange} placeholder="john@example.com"/>
                </div>
                <div className="password-input w-100 d-flex justify-content-between align-items-center gap-5">
                    <label htmlFor="">password</label>
                    <input className="input-box" type="password" onChange={handlePasswordChange} placeholder="enter your password"/>
                </div>
                <div className="action-btns w-100 d-flex justify-content-center align-item-center mt-3">
                    <button className="submit" onClick={handleSubmit}>Register</button>
                </div>
            </div>
        </div>
    );
}
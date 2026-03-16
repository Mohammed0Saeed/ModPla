import loadingIcon from "../assets/loading-icon.png"
import closeIcon from "../assets/close-icon.png";
import { useState, type MouseEventHandler } from "react";
import axios from "axios";
import "../styles/SubjectSideNavStyle.css";

export default function (showView:boolean,
    text:string,
    placeHolder:string,
    loadingText:string,
    handleFunction: MouseEventHandler) {

    const [showAddView, setShowAddView] = useState(true)
    const [contentTitle, setContentTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContentTitle(event.target.value)
    }

    const handleClose = () => {
        setShowAddView(false)
    }


    return(
        <div className= {
            showView && showAddView ? "add-window d-flex justify-content-center align-items-center" :
            "add-window d-none justify-content-center align-items-center"
        }>
            <div className={`input-window ${isLoading ? 'd-none':'d-flex'} flex-column gap-5`}>
                <button className="close-button" onClick={handleClose}>
                    <img src={closeIcon} className="icon"/>
                </button>
                <div className="form-group d-flex align-items-center">
                    <label className="w-25">{text}</label>
                    <input type="text" value={contentTitle} onChange={handleInputChange} className="form-control" aria-describedby="emailHelp" placeholder={placeHolder} />
                </div>
                <div className="btns-container d-flex justify-content-center">
                    {/* <button type="submit" className="btn btn-black">Add</button> */}
                    <button className="btn-black d-flex gap-2 align-items-center" onClick={handleFunction}>
                        <span>Add</span>
                    </button>
                </div>
            </div>
            <div className={`loading-window ${isLoading ? 'd-flex':'d-none'} flex-column justify-content-center align-items-center gap-5`}>
                <div className="d-flex gap-2 align-items-center">
                    <span>{loadingText}</span>
                    <img src={loadingIcon} className="icon continuous-motion" alt="" />   
                </div>
            </div>
        </div>

    )
}
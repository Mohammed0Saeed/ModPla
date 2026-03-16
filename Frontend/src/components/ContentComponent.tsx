import TaskText from './TaskComponent';
import loadingIcon from "../assets/loading-icon.png"
import closeIcon from "../assets/close-icon.png";
import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/ContentCompnentStyle.css'

interface Task{
    id: number;
    task: string;
    isDone: boolean;
}

interface Content {
    id: number,
    title: string,
    tasks: Task[]
}

export default function(content:Content) {
    const [showAddView, setShowAddView] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [taskText, setTaskTest] = useState("")

    const token = window.localStorage.getItem("Token")

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTest(event.target.value)
    }

    const handleShowAddView = () => {
        setShowAddView(!showAddView)
    }

    const handleAdd = () => {
        setIsLoading(true)
        try {
            axios.post(`http://localhost:8080/api/task/${content.id}`,
                {task: taskText},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(() => {
                setIsLoading(false)
                handleClose();
                window.location.reload()
            });
        } catch (err) {
            console.log("Something went wrong: ", err);
        }
    }

    const handleClose = () => {
        setShowAddView(!showAddView)
    }

    return (
        <div className="content-container d-flex flex-column gap-3 w-100 h-100">
            <div className="header d-flex justify-content-between align-items-center">
                <h2 className="highlight-effect">{content.title}</h2>
                <button className="add-btn rounded" onClick={handleShowAddView}>Add Task</button>
            </div>
            <div className="content-tasks d-flex flex-column gap-3">
                {content.tasks?.map(t => {
                    return(<TaskText id={t.id} task={t.task} done={t.isDone}/>)
                })}
            </div>
            <div className={`view-container ${showAddView && !isLoading ? 'd-flex':'d-none'} justify-content-center align-items-center`}>
                <div className={`view-window d-flex flex-column gap-5`}>
                    <button className="close-button" onClick={handleClose}>
                        <img src={closeIcon} className="icon"/>
                    </button>
                    <div className="form-group d-flex align-items-center">
                        <label className="w-25">Task</label>
                        <input type="text" value={taskText} onChange={handleInputChange} className="form-control" aria-describedby="emailHelp" placeholder="write the new task" />
                    </div>
                    <div className="btns-container d-flex justify-content-center">
                        <button className="btn-black d-flex gap-2 align-items-center" onClick={handleAdd}>
                            <span>add task</span>
                        </button>
                    </div>
                </div>
                <div className={`loading-window ${isLoading ? 'd-flex':'d-none'} flex-column justify-content-center align-items-center gap-5`}>
                    <div className="d-flex gap-2 align-items-center">
                        <span>Adding task</span>
                        <img src={loadingIcon} className="icon continuous-motion" alt="" />   
                    </div>
                </div>
            </div>
        </div>
    )
}
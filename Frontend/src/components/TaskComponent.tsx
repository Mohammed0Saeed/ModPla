import '../styles/TaskComponentStyles.css'
import {useState} from 'react'
import deleteBin from '../assets/trash-delete-bin.svg'
import editIcon from '../assets/pencil-edit-button.svg'
import closeIcon from '../assets/close-icon.png'
import loadingIcon from '../assets/loading-icon.png'
import axios from 'axios'

interface Task {
    id: number,
    task: string,
    done: boolean
}

export default function (text:Task) {
    const [done, setDone] = useState(false)
    const [viewEdit, setviewEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [taskText, setTaskText] = useState('')
    const token = window.localStorage.getItem('Token')

    axios.get(`http://localhost:8080/api/task/${text.id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).then(
        (response) => {
            const tmpTask:Task = response.data
            setDone(tmpTask.done)
        }
    )

    const handleCheck = async () => {
        const newDoneState = !done;
        setDone(newDoneState);

        try {
            await axios.put(`http://localhost:8080/api/task/${text.id}`, 
                {
                    task: text.task,
                    done: newDoneState
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Task successfully updated on the server.");
        } catch(err) {
            console.log("Error updating task:" + err);
            setDone(done);
        }
    }

    const handleEditView = () => {
        setviewEdit(!viewEdit)
    }

    const handleEdit = () => {
        setIsLoading(true)

        console.log(taskText)

        axios.put(`http://localhost:8080/api/task/${text.id}`, {
            task:taskText,
            done:false
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(
            () => {
                setIsLoading(false)
                handleClose()
                window.location.reload()
            }
        )
    }

    const handleClose = () => {
        setviewEdit(!viewEdit)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskText(event.target.value)
    }

    const handleDelete = () => {
        const sureToDelete = window.confirm("Are you sure you want to delete this task?")
        if (sureToDelete) {
            axios.delete(`http://localhost:8080/api/task/${text.id}`).then(
                () => { window.location.reload() }
            )
        }
    }

    return (
        <div className="task-container d-flex justify-content-between align-items-center">
            <div className="text-container d-flex gap-3">
                <input type="checkbox" checked={done === null ? false : done} onChange={handleCheck} className='p-0 m-0'/>
                <div className="text-holder">{text.task}</div>
            </div>
            <div className="actions d-flex gap-2">
                <button className="delete-btn">
                    <img src={deleteBin} className={`delete-icon ${viewEdit ? 'd-none':''}`} onClick={handleDelete} alt="trash-delete-bin" />
                </button>
                <button className="delete-btn">
                    <img src={editIcon} className={`delete-icon ${viewEdit ? 'd-none':''}`} onClick={handleEditView} alt="trash-delete-bin" />
                </button>
            </div>

            <div className={`input-window ${viewEdit && !isLoading ? 'd-flex':'d-none'} flex-column gap-5`}>
                <button className="close-button" onClick={handleClose}>
                    <img src={closeIcon} className="icon"/>
                </button>
                <div className="form-group d-flex align-items-center">
                    <label className="w-25">Task</label>
                    <input type="text" value={taskText} onChange={handleInputChange} className="form-control" aria-describedby="emailHelp" placeholder="write the new task" />
                </div>
                <div className="btns-container d-flex justify-content-center">
                    <button className="btn-black d-flex gap-2 align-items-center" onClick={handleEdit}>
                        <span>Edit Task</span>
                    </button>
                </div>
            </div>

            <div className={`loading-window ${isLoading ? 'd-flex':'d-none'} flex-column justify-content-center align-items-center gap-5`}>
                <div className="d-flex gap-2 align-items-center">
                    <span>Generating tasks</span>
                    <img src={loadingIcon} className="icon continuous-motion" alt="" />   
                </div>
            </div>
        </div>
    )
}
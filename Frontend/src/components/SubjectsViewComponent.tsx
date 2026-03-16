import { useEffect, useState } from 'react';
import loadingIcon from "../assets/loading-icon.png"
import closeIcon from "../assets/close-icon.png";
import editIcon from "../assets/pencil-edit-button.svg"
import deleteIcon from "../assets/trash-delete-bin.svg"
import '../styles/HomePageComponentStyle.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Subject {
    id: number;
    name: string;
}

interface Semester {
    id: number;
    name: string;
    subjects: Subject[]
}

interface Props {
    id: number;
    isEditMode: boolean;
}

export default function Subjects(props: Props) {
    const { id, isEditMode } = props;
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [localEditMode, setLocalEditMode] = useState<boolean>(!!isEditMode)
    const [subjectName, setSubjectName] = useState('')
    const [showAddView, setShowAddView] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // state trackers for dynamic add/edit window
    const [subjectID, setSubjectID] = useState<number>(0)
    const [btnText, setBtnText] = useState<string>('')
    const [loadingText, setLoadingText] = useState<string>()

    const token = localStorage.getItem("Token")

    const navigator = useNavigate()
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubjectName(event.target.value)
    }

    const handleClose = () => {
        setShowAddView(false)
    }
    
    const fetchSubjects = async () => {
        const response = await axios.get("http://localhost:8080/api/semester/subjects/"+props.id,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setSubjects(response.data)
    }
    
    const handleAddSubject = () => {
        setIsLoading(true)
        try {
            axios.post(`http://localhost:8080/api/subject/${id}`,
                {name: subjectName},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(() => {
                setIsLoading(false)
                handleClose();
                window.location.reload()
            }, 
        );
        } catch (err) {
            console.log("Something went wrong: ", err);
        }
    }

    const handleEditSubject = (subjectID:number) => {
        setShowAddView(true)
        try {
            axios.put(`http://localhost:8080/api/subject/${subjectID}`,
                {name: subjectName},
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

    const handleDeleteSubject = (subjectID:number) => {
        const choice = window.confirm("Are you sure you want to delete this?")
        
        if(choice) {
            try {
                axios.delete(`http://localhost:8080/api/subject/${subjectID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then(() => {
                    setIsLoading(false)
                    handleClose();
                    window.location.reload()
                });
            } catch (err) {
                console.log("Something went wrong: ", err);
            }
        } else {
            window.location.reload()
        }
    }

    const handleShowWindow = (mode:string, subjectID:number) => {
        if (mode === "Add") {
            setBtnText("Add")
            setLoadingText("Adding Subject")
        } else if (mode === "Edit") {
            setBtnText("Edit")
            setLoadingText("Editing Subject")
            setSubjectID(subjectID)
        }

        setShowAddView(!showAddView)
    }

    const handleGoToSubject = (subject:number) => {
        navigator(`/subject/${subject}`)
    }

    useEffect(() => {
        fetchSubjects()
    }, [])

    useEffect(() => {
        setLocalEditMode(!!isEditMode)
    }, [isEditMode])

    useEffect(() => {
        fetchSubjects()
    }, [props.id])

    
    return (
        <>
            <div className="subjects-grid w-75 d-flex flex-wrap align-items-start gap-2">
                {subjects?.map(s => (
                    <button key={s.id} className="subject btn-special-design" onClick={() => handleGoToSubject(s.id)}>
                        <div className="subject-name">{s.name}</div>
                        <div className={localEditMode ? 'control-btns' : 'd-none'}>
                            <button className='icon-btn' onClick={() => handleShowWindow("Edit", s.id)}><img src={editIcon} className="icon" alt="edit-icon" /></button>
                            <button className='icon-btn' onClick={() => handleDeleteSubject(s.id)}><img src={deleteIcon} className="icon" alt="delete-icon" /></button>
                        </div>
                    </button>
                ))}
                <button className={(props.id === 0) ? "d-none subject btn-special-design":"subject btn-special-design"} onClick={() => handleShowWindow("Add", 0)}>
                    add subject
                </button>
            </div>
            <div className= {
                showAddView ? "add-window d-flex justify-content-center align-items-center" :
                "add-window d-none justify-content-center align-items-center"
            }>
                <div className={`input-window ${isLoading ? 'd-none':'d-flex'} flex-column gap-5`}>
                    <button className="close-button" onClick={handleClose}>
                        <img src={closeIcon} className="icon"/>
                    </button>
                    <div className="form-group d-flex align-items-center">
                        <label className="w-25">Subject</label>
                        <input type="text" value={subjectName} onChange={handleInputChange} className="form-control" aria-describedby="emailHelp" placeholder="i.e. Mathematics" />
                    </div>
                    <div className="btns-container d-flex justify-content-center">
                        <button className="btn-black d-flex gap-2 align-items-center" onClick={isEditMode? () => handleEditSubject(subjectID):handleAddSubject}>
                            {btnText}
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
        </>
    )
}
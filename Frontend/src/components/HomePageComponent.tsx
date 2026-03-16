import { useEffect, useState } from 'react';
import axios from 'axios';
import Subjects from "../components/SubjectsViewComponent";
import editIcon from "../assets/pencil-edit-button.svg"
import deleteIcon from "../assets/trash-delete-bin.svg"
import loadingIcon from "../assets/gemini.png"
import closeIcon from "../assets/close-icon.png"
import '../styles/HomePageComponentStyle.css'
import { useParams, useNavigate } from 'react-router-dom';

interface Semester {
    id: number;
    name: string;
    subjects: Subject[]
}

interface Subject {
    id: number;
    name: string;
}

export default function () {
    const [semesters, setSemesters] = useState<Semester[]>([])
    const [showAddView, setShowAddView] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [semesterYear, setSemesterYear] = useState<number>(0)
    const [semesterSeason, setSemesterSeason] = useState('SUMMER')
    const [selectedID, setSelectedID] = useState<number>(0)

    // states to make edit window dynamic for add and edit
    const [semesterID, setSemesterID] = useState(0)
    const [btnText, setBtnText] = useState<string>('')
    const [loadingText, setLoadingText] = useState<string>()
    const [btnFunction, setBtnFunction] = useState('')

    const token = window.localStorage.getItem("Token")

    const navigate = useNavigate();

    const fetchSemesters = async () => {
        const response = await axios.get("http://localhost:8080/api/semester/my-semesters", 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setSemesters(response.data)
    }

    const handleEditMode = () => {
        setEditMode(!editMode)
    }

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSemesterYear(event.target.value as number)
    }

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemesterSeason(event.target.value)
    }

    const handleEditWindow = (mode:string, semesterID:number) => {
        if (mode == 'edit') {
            setBtnText('Edit')
            setLoadingText('Editing semester')
            setShowAddView(!showAddView)
            setBtnFunction('edit')
            setSemesterID(semesterID)
        } else if (mode == 'add') {
            setBtnText('add')
            setLoadingText('Adding semester')
            setShowAddView(!showAddView)
            setBtnFunction('add')
        }
    }

    const handleEditSemester = (semesterID:number) => {
        setIsLoading(true)
        try {
            axios.put("http://localhost:8080/api/semester/"+semesterID, {year: semesterYear, season: semesterSeason}).then(() => {
                setIsLoading(false)
                handleClose();
                window.location.reload()
            });
        } catch (err) {
            console.log("Something went wrong: ", err);
        }
    }

    const handleAddSemester = () => {
        setIsLoading(true)
        try {
            axios.post("http://localhost:8080/api/semester/add",
                {year: semesterYear, season: semesterSeason}, 
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
    }

    const handleDeleteSemester = (semester_id:number) => {
        const choice = window.confirm("Are you sure you want to delete this?")
        if (choice) {
            try {
                axios.delete("http://localhost:8080/api/semester/"+semester_id, 
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
        }
    }

    const handleClose = () => {
        setShowAddView(!showAddView)
    }

    const handleUpdateID = (id: number) => {
        setSelectedID(id)
    }
    
    const logout = () => {
        localStorage.removeItem("Token")
        navigate('/')
    }

    useEffect(() => {
        fetchSemesters()
    }, [])

    
    return (
        <div className="home-container w-100 h-100">
            <div className="nav w-100 d-flex justify-content-between">
                <div className="logo">ModPla</div>
                <div className="user-info d-flex align-items-center gap-2">
                    <button className='btn btn-black' onClick={handleEditMode}>{editMode? "Done" : "Edit"}</button>
                    <button className='btn btn-outline-danger' onClick={logout}>log out</button>
                </div>
            </div>
            <div className="main-page w-100 d-flex">
                <div className="semesters-nav w-25 d-flex flex-column gap-3">
                {semesters.map(semester => (
                    <button className={`${selectedID==semester.id ? "active":"btn-special-design"} semester d-flex justify-content-between align-items-center`}
                        onClick={() => handleUpdateID(semester.id)}>
                        <div className="semester-name">{semester.name}</div>
                        <div className={editMode ? 'control-btn':'d-none'}>
                            <button className='icon-btn'><img src={editIcon} className="icon" alt="edit-icon" onClick={() => handleEditWindow('edit', semester.id)}/></button>
                            <button className='icon-btn'><img src={deleteIcon} className="icon" alt="delete-icon" onClick={() => handleDeleteSemester(semester.id)}/></button>
                        </div>
                    </button>
                ))}
                <button className="semester btn-special-design d-flex justify-content-between align-items-center" onClick={() => handleEditWindow('add', 0)}>
                    Add Semester
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
                        <label className="w-25">Year</label>
                        <input type="number" value={semesterYear} onChange={handleYearChange} className="form-control" aria-describedby="emailHelp" placeholder="i.e. 2025" />
                    </div>
                    <div className="form-group d-flex align-items-center">
                        <label className="w-25" htmlFor='season-choice'>Season</label>
                        <select name="season" id="season-choice" value={semesterSeason} onChange={handleSeasonChange}>
                            <option value="SUMMER">Summer</option>
                            <option value="WINTER">Winter</option>
                        </select>
                    </div>
                    <div className="btns-container d-flex justify-content-center">
                        <button className="btn-black d-flex gap-2 align-items-center" onClick={btnFunction === 'edit'? () => handleEditSemester(semesterID) : handleAddSemester}>
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
                <Subjects id={selectedID}
                    isEditMode={editMode} />
                </div>
            </div>
    )
}
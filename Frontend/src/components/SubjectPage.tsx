import ContentComponent from "./ContentComponent";
import geminiIcon from "../assets/gemini.png";
import loadingIcon from "../assets/loading-icon.png";
import closeIcon from "../assets/close-icon.png";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/SubjectSideNavStyle.css";

// Interfaces
interface Subject {
    id: number;
    name: string;
    contents: Content[];
}
interface Task {
    id: number;
    task: string;
    isDone: boolean;
}

interface Content {
    id: number;
    title: string;
    tasks: Task[];
}

export default function SubjectPage() {
    const [subject, setSubject] = useState<Subject>();
    const [contents, setContents] = useState<Content[]>([]);
    const [contentTitle, setContentTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [showAddView, setShowAddView] = useState(false);

    const navigate = useNavigate();
    const { subjectId } = useParams<{ subjectId: string }>();

    const token = window.localStorage.getItem("Token")

    const fetchSubjectData = async () => {
        if (!subjectId) return;
        try {
            const response = await axios.get(`http://localhost:8080/api/subject/${subjectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSubject(response.data);
            setContents(response.data.contents || []);
        } catch (err) {
            console.error("Failed to fetch subject data:", err);
        }
    };

    useEffect(() => {
        fetchSubjectData();
    }, [subjectId]);

    const handleClick = (i: number) => {
        setIndex(i);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContentTitle(event.target.value);
    };

    const handleShowAddView = () => {
        setContentTitle("");
        setShowAddView(true);
    };

    const handleAdd = async () => {
        if (!contentTitle.trim()) return;

        setIsLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/contents/${subjectId}`,
                { title: contentTitle },
                            {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            await fetchSubjectData();
            handleClose();
        } catch (err) {
            console.error("Something went wrong: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setShowAddView(false);
    };

    const handleGoBack = () => {
        navigate('/home');
    };

    const selectedContent = contents[index];

    // TODO: fix hiding contents issue

    return (
        <div className="subject-view w-100 h-100 bg-light d-flex">
            <div className="side-bar w-25 h-100 d-flex flex-column p-3 justify-content-start align-items-center gap-5">
                <button className="back-btn" onClick={handleGoBack}>Go back to subjects</button>
                <div className="subject-list d-flex flex-column gap-2">
                    <h2 className='title'>{subject?.name}</h2>
                    <div className="contents-container w-100 d-flex flex-column justify-content-start align-items-center gap-3">
                        {contents?.map((c, i) => {
                            const isActive = i === index;
                            return (
                                <button
                                    key={c.id}
                                    id={c.id.toString()}
                                    className={`btn-special-design ${isActive ? 'active' : ''}`}
                                    onClick={() => handleClick(i)}
                                >
                                    {c.title}
                                </button>
                            );
                        })}
                        <button className={"btn-special-design"} onClick={handleShowAddView}>+</button>
                        <div className={
                            showAddView ? "add-window d-flex justify-content-center align-items-center" :
                            "add-window d-none justify-content-center align-items-center"
                        }>
                            <div className={`input-window ${isLoading ? 'd-none' : 'd-flex'} flex-column gap-5`}>
                                <button className="close-button" onClick={handleClose}>
                                    <img src={closeIcon} className="icon" alt="close" />
                                </button>
                                <div className="form-group d-flex align-items-center">
                                    <label className="w-25">Content's Title</label>
                                    <input type="text" value={contentTitle} onChange={handleInputChange} className="form-control" placeholder="i.e. fourier transformation" />
                                </div>
                                <div className="btns-container d-flex justify-content-center">
                                    <button className="btn-black d-flex gap-2 align-items-center" onClick={handleAdd}>
                                        <span>Generate Tasks with AI</span>
                                        <img src={geminiIcon} className="icon" alt="gemini" />
                                    </button>
                                </div>
                            </div>
                            <div className={`loading-window ${isLoading ? 'd-flex' : 'd-none'} flex-column justify-content-center align-items-center gap-5`}>
                                <div className="d-flex gap-2 align-items-center">
                                    <span>Generating tasks</span>
                                    <img src={loadingIcon} className="icon continuous-motion" alt="loading" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ContentComponent
                id={selectedContent?.id}
                title={selectedContent?.title}
                tasks={selectedContent?.tasks}
            />
        </div>
    );
}
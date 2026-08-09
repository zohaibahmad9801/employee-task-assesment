/**
 * Update Task
 *
 * Responsibilities:
 *
 * 1. Read task id from URL.
 * 2. Fetch task details.
 * 3. Populate form.
 * 4. Update task.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import PageHeader from "../../components/PageHeader";
import api from "../../api/axios";
import ConfirmationModal from "../../components/ConfirmationModal";
import AlertMessage from "../../components/AlertMessage";

function EditTask() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [task, setTask] = useState({

        title: "",

        description: "",

        priority: "LOW",

        dueDate: "",

        assignedUserId: ""

    });

    const [employees, setEmployees] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Fetch task by id.
     */
    async function fetchTaskById() {

        try {

            const response = await api.get(`/tasks/${id}`);

            setTask(response.data);

        }

        catch (error) {

            setErrorMessage(error?.response?.data?.message);

        }

    }

    /**
     * Fetch all employees.
     */
    async function fetchEmployees() {

        try {

            const response = await api.get("/employees");

            setEmployees(response.data);

        }

        catch (error) {

            setErrorMessage(error?.response?.data?.message);

        }

    }

    /**
     * Update task.
     */
    async function updateTask() {

        try {

            await api.put(`/tasks/${id}`, task);

            setShowModal(false);

            setSuccessMessage("Task updated successfully.");

            setTimeout(() => {

                navigate("/tasks");

            }, 1500);

        }

        catch (error) {

            setShowModal(false);

            setErrorMessage(error?.response?.data?.message);

        }

    }

    useEffect(() => {

        fetchTaskById();

        fetchEmployees();

    }, [id]);

    return (
        <>

            <Navbar />

            <div className="container mt-5">

                <PageHeader

                    title="✏ Update Task 📋"

                    subtitle="Update task information."

                />

                {

                    successMessage && (

                        <AlertMessage

                            type="success"

                            message={successMessage}

                            onClose={() => setSuccessMessage("")}

                        />

                    )

                }

                {

                    errorMessage && (

                        <AlertMessage

                            type="danger"

                            message={errorMessage}

                            onClose={() => setErrorMessage("")}

                        />

                    )

                }

                <div className="card shadow-sm border-0 rounded-4">

                    <div className="card-body">

                        {/* Title */}

                        <div className="mb-3">

                            <label className="form-label">

                                Title

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                value={task.title}

                                onChange={(event) =>

                                    setTask({

                                        ...task,

                                        title: event.target.value

                                    })

                                }

                            />

                        </div>

                        {/* Description */}

                        <div className="mb-3">

                            <label className="form-label">

                                Description

                            </label>

                            <textarea

                                className="form-control"

                                rows="3"

                                value={task.description}

                                onChange={(event) =>

                                    setTask({

                                        ...task,

                                        description: event.target.value

                                    })

                                }

                            />

                        </div>

                        {/* Priority */}

                        <div className="mb-3">

                            <label className="form-label">

                                Priority

                            </label>

                            <select

                                className="form-select"

                                value={task.priority}

                                onChange={(event) =>

                                    setTask({

                                        ...task,

                                        priority: event.target.value

                                    })

                                }

                            >

                                <option value="LOW">

                                    LOW

                                </option>

                                <option value="MEDIUM">

                                    MEDIUM

                                </option>

                                <option value="HIGH">

                                    HIGH

                                </option>

                            </select>

                        </div>

                        {/* Due Date */}

                        <div className="mb-3">

                            <label className="form-label">

                                Due Date

                            </label>

                            <input

                                type="date"

                                className="form-control"

                                value={task.dueDate}

                                onChange={(event) =>

                                    setTask({

                                        ...task,

                                        dueDate: event.target.value

                                    })

                                }

                            />

                        </div>

                        {/* Assigned Employee */}

                        <div className="mb-4">

                            <label className="form-label">

                                Assigned Employee

                            </label>

                            <select

                                className="form-select"

                                value={task.assignedUserId}

                                onChange={(event) =>

                                    setTask({

                                        ...task,

                                        assignedUserId: Number(event.target.value)

                                    })

                                }

                            >

                                <option value="">

                                    Select Employee

                                </option>

                                {

                                    employees.map((employee) => (

                                        <option

                                            key={employee.id}

                                            value={employee.id}

                                        >

                                            {employee.email}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        <div className="d-flex justify-content-end gap-2">

                            <button

                                className="btn btn-outline-secondary"

                                onClick={() => navigate("/tasks")}

                            >

                                Cancel

                            </button>

                            <button

                                className="btn btn-warning"

                                onClick={() => setShowModal(true)}

                            >

                                Update Task

                            </button>

                        </div>

                        <ConfirmationModal

                            show={showModal}

                            title="Update Task"

                            message="Are you sure you want to update this task?"

                            onClose={() => setShowModal(false)}

                            onConfirm={updateTask}

                            confirmButtonText="Update"

                            confirmButtonClass="btn btn-outline-warning"

                        />

                    </div>

                </div>

            </div>

        </>

    );

}

export default EditTask;
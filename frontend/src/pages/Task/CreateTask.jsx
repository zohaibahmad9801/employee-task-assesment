/**
 * Create Task
 *
 * Responsibilities:
 *
 * 1. Create new task.
 * 2. Fetch employees.
 * 3. Assign task.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import PageHeader from "../../components/PageHeader";
import ConfirmationModal from "../../components/ConfirmationModal";
import AlertMessage from "../../components/AlertMessage";
import api from "../../api/axios";

function CreateTask() {

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
     * Fetch Employees
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
     * Create Task
     */
    async function createTask() {

        try {

            await api.post("/tasks", task);

            setShowModal(false);

            setSuccessMessage("Task created successfully.");

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

        fetchEmployees();

    }, []);

    return (<>

        <Navbar />

        <div className="container mt-5">

            <PageHeader

                title="➕ Create Task 📋"

                subtitle="Assign a new task to an employee."

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

                            className="btn btn-success"

                            onClick={() => setShowModal(true)}

                        >

                            Create Task

                        </button>

                    </div>

                    <ConfirmationModal

                        show={showModal}

                        title="Create Task"

                        message="Are you sure you want to create this task?"

                        onClose={() => setShowModal(false)}

                        onConfirm={createTask}

                        confirmButtonText="Create"

                        confirmButtonClass="btn btn-outline-success"

                    />

                </div>

            </div>

        </div>

    </>

    );

}

export default CreateTask;
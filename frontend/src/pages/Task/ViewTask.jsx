/**
 * View Task
 *
 * Responsibilities:
 *
 * 1. Read task id from URL.
 * 2. Fetch task details.
 * 3. Display task information.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import PageHeader from "../../components/PageHeader";
import AlertMessage from "../../components/AlertMessage";
import api from "../../api/axios";

function ViewTask() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [task, setTask] = useState({});

    const [errorMessage, setErrorMessage] = useState("");

    const role = localStorage.getItem("role");

    /**
     * Fetch task by id.
     */
    async function fetchTaskById() {

        try {

            const response = await api.get(`/tasks/${id}`);

            setTask(response.data);

        }

        catch (error) {

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to fetch task."
            );

        }

    }

    useEffect(() => {

        fetchTaskById();

    }, [id]);

    /**
     * Format date and time.
     */
    function formatDateTime(dateTime) {

        if (!dateTime) {

            return "";

        }

        return new Date(dateTime).toLocaleString();

    }

    return (

        <>

            <Navbar />

            <div className="container mt-5">

                <PageHeader
                    title="👁 View Task 📋"
                    subtitle="View task details."
                />

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

                    <div className="card-body p-4">

                        {/* Task Header */}

                        <div className="border-bottom pb-3 mb-4">

                            <h4 className="fw-bold mb-1">

                                {task.title}

                            </h4>

                            <small className="text-muted">

                                Task ID: {task.id}

                            </small>

                        </div>


                        {/* Task Information */}

                        <div className="row g-4">

                            {/* Description */}

                            <div className="col-12">

                                <label className="fw-bold text-muted">

                                    Description

                                </label>

                                <p className="mb-0 mt-1">

                                    {task.description || "No description available."}

                                </p>

                            </div>


                            {/* Status */}

                            {

                                task.status && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Status

                                        </label>

                                        <div className="mt-1">

                                            <span
                                                className={
                                                    task.status === "TODO"
                                                        ? "badge bg-danger"
                                                        : task.status === "IN_PROGRESS"
                                                            ? "badge bg-warning text-dark"
                                                            : task.status === "DONE"
                                                                ? "badge bg-success"
                                                                : "badge bg-secondary"
                                                }
                                            >

                                                {task.status}

                                            </span>

                                        </div>

                                    </div>

                                )

                            }


                            {/* Priority */}

                            {

                                task.priority && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Priority

                                        </label>

                                        <div className="mt-1">

                                            <span
                                                className={
                                                    task.priority === "HIGH"
                                                        ? "badge bg-danger"
                                                        : task.priority === "MEDIUM"
                                                            ? "badge bg-warning text-dark"
                                                            : task.priority === "LOW"
                                                                ? "badge bg-success"
                                                                : "badge bg-secondary"
                                                }
                                            >

                                                {task.priority}

                                            </span>

                                        </div>

                                    </div>

                                )

                            }


                            {/* Due Date */}

                            {

                                task.dueDate && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Due Date

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {task.dueDate}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Assigned User ID */}

                            {

                                task.assignedUserId && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Assigned User ID

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {task.assignedUserId}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Assigned To */}

                            {

                                task.assignedTo && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Assigned To

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {task.assignedTo}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Assigned User Email */}

                            {

                                task.assignedUserName && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Assigned User Email

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {task.assignedUserName}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Created At */}

                            {

                                task.createdAT && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Created At

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {formatDateTime(task.createdAT)}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Updated At */}

                            {

                                task.updatedAt && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Updated At

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {formatDateTime(task.updatedAt)}

                                        </p>

                                    </div>

                                )

                            }

                        </div>


                        {/* Back Button */}

                        <div className="d-flex justify-content-end mt-4 pt-3 border-top">

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    navigate(
                                        role === "ADMIN"
                                            ? "/tasks"
                                            : "/my-tasks"
                                    )
                                }
                            >
                                Back
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}

export default ViewTask;
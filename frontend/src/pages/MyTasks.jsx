/**
 * My Tasks Page
 *
 * Responsibilities:
 *
 * 1. Display only tasks assigned to the logged-in employee.
 * 2. Display task summary information.
 * 3. Allow filtering tasks by status.
 * 4. Allow employee to view complete task details.
 * 5. Allow employee to update task status.
 * 6. Provide pagination for tasks.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import UpdateStatusModal from "../components/UpdateStatusModal";
import Footer from "../components/Footer";


function MyTasks() {

    const navigate = useNavigate();


    // Stores tasks assigned to logged-in employee
    const [tasks, setTasks] = useState([]);


    // Stores selected status filter
    const [selectedFilter, setSelectedFilter] = useState("ALL");


    // Stores current page
    const [currentPage, setCurrentPage] = useState(1);


    // Tasks displayed per page
    const itemsPerPage = 5;


    // Loading state
    const [loading, setLoading] = useState(true);


    // Selected task for status update
    const [selectedTask, setSelectedTask] = useState(null);


    // Selected new status
    const [selectedStatus, setSelectedStatus] = useState("");


    // Status update modal
    const [showModal, setShowModal] = useState(false);


    // Success message
    const [successMessage, setSuccessMessage] = useState("");


    // Error message
    const [errorMessage, setErrorMessage] = useState("");


    /**
     * Table columns.
     *
     * Description is intentionally not displayed here
     * because it can be lengthy.
     *
     * Full description can be viewed from View Task.
     */
    const columns = [

        {
            key: "id",
            label: "ID"
        },

        {
            key: "title",
            label: "Title"
        },

        {
            key: "status",
            label: "Status",

            render: (task) => (

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

            )

        },

        {
            key: "priority",
            label: "Priority",

            render: (task) => (

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

            )

        },

        {
            key: "dueDate",
            label: "Due Date"
        }

    ];


    /**
     * Fetch tasks assigned to logged-in employee.
     *
     * Backend:
     * GET /api/tasks/my-tasks
     */
    async function fetchMyTasks() {

        try {

            setLoading(true);

            const response = await api.get("/tasks/my-tasks");

            setTasks(response.data);

        }

        catch (error) {

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to fetch your tasks."
            );

        }

        finally {

            setLoading(false);

        }

    }


    /**
     * Open status update modal.
     */
    function openStatusModal(task) {

        setSelectedTask(task);

        setSelectedStatus(task.status);

        setShowModal(true);

    }


    /**
     * Close status update modal.
     */
    function closeStatusModal() {

        setShowModal(false);

        setSelectedTask(null);

        setSelectedStatus("");

    }


    /**
     * Update task status.
     *
     * Backend:
     * PUT /api/tasks/{taskId}/status
     */
    async function updateTaskStatus() {

        try {

            await api.put(
                `/tasks/${selectedTask.id}/status`,
                {
                    status: selectedStatus
                }
            );

            closeStatusModal();

            setSuccessMessage(
                "Task status updated successfully."
            );

            fetchMyTasks();

        }

        catch (error) {

            closeStatusModal();

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to update task status."
            );

        }

    }


    /**
     * Load employee tasks when page opens.
     */
    useEffect(() => {

        fetchMyTasks();

    }, []);


    /**
     * Automatically hide success message.
     */
    useEffect(() => {

        if (successMessage) {

            const timer = setTimeout(() => {

                setSuccessMessage("");

            }, 3000);

            return () => clearTimeout(timer);

        }

    }, [successMessage]);


    /**
     * Automatically hide error message.
     */
    useEffect(() => {

        if (errorMessage) {

            const timer = setTimeout(() => {

                setErrorMessage("");

            }, 4000);

            return () => clearTimeout(timer);

        }

    }, [errorMessage]);


    /**
     * Task counts.
     */
    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(
        (task) => task.status === "TODO"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
    ).length;

    const doneTasks = tasks.filter(
        (task) => task.status === "DONE"
    ).length;


    /**
     * Filter tasks based on selected status.
     */
    const filteredTasks = tasks.filter((task) => {

        if (selectedFilter === "ALL") {

            return true;

        }

        return task.status === selectedFilter;

    });


    /**
     * Reset pagination when filter changes.
     */
    useEffect(() => {

        setCurrentPage(1);

    }, [selectedFilter]);


    /**
     * Pagination.
     */
    const totalPages = Math.ceil(
        filteredTasks.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const endIndex =
        startIndex + itemsPerPage;

    const currentTasks =
        filteredTasks.slice(startIndex, endIndex);


    return (

        <div className="d-flex flex-column min-vh-100">

            <Navbar />


            <div className="container mt-5 flex-grow-1">


                {/* Page Header */}

                <PageHeader

                    title="📋 My Tasks"

                    subtitle="View and manage tasks assigned to you."

                />


                {/* Success Message */}

                {
                    successMessage && (

                        <AlertMessage

                            type="success"

                            message={successMessage}

                            onClose={() =>
                                setSuccessMessage("")
                            }

                        />

                    )
                }


                {/* Error Message */}

                {
                    errorMessage && (

                        <AlertMessage

                            type="danger"

                            message={errorMessage}

                            onClose={() =>
                                setErrorMessage("")
                            }

                        />

                    )
                }


                {

                    loading ? (

                        <LoadingSpinner />

                    ) : (

                        <>


                            {/* Task Summary Cards */}

                            <div className="row g-4 mb-4">


                                {/* Total Tasks */}

                                <div className="col-md-6 col-lg-3">

                                    <div className="card shadow-sm border-0 rounded-4 h-100">

                                        <div className="card-body p-4">

                                            <h5 className="fw-bold">

                                                📋 Total Tasks

                                            </h5>

                                            <h2 className="fw-bold mt-3">

                                                {totalTasks}

                                            </h2>

                                            <p className="text-muted mb-0">

                                                All assigned tasks

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* TODO */}

                                <div className="col-md-6 col-lg-3">

                                    <div className="card shadow-sm border-0 rounded-4 h-100">

                                        <div className="card-body p-4">

                                            <h5 className="fw-bold">

                                                📝 TODO

                                            </h5>

                                            <h2 className="fw-bold mt-3">

                                                {todoTasks}

                                            </h2>

                                            <p className="text-muted mb-0">

                                                Tasks not started

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* IN PROGRESS */}

                                <div className="col-md-6 col-lg-3">

                                    <div className="card shadow-sm border-0 rounded-4 h-100">

                                        <div className="card-body p-4">

                                            <h5 className="fw-bold">

                                                🔄 In Progress

                                            </h5>

                                            <h2 className="fw-bold mt-3">

                                                {inProgressTasks}

                                            </h2>

                                            <p className="text-muted mb-0">

                                                Tasks currently in progress

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* DONE */}

                                <div className="col-md-6 col-lg-3">

                                    <div className="card shadow-sm border-0 rounded-4 h-100">

                                        <div className="card-body p-4">

                                            <h5 className="fw-bold">

                                                ✅ Done

                                            </h5>

                                            <h2 className="fw-bold mt-3">

                                                {doneTasks}

                                            </h2>

                                            <p className="text-muted mb-0">

                                                Completed tasks

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Tasks Table */}

                            <div className="card shadow-sm border-0 rounded-4">

                                <div className="card-body p-4">


                                    {/* Table Header */}

                                    <div className="d-flex justify-content-between align-items-center mb-3">

                                        <div>

                                            <h4 className="fw-bold mb-1">

                                                My Tasks

                                            </h4>

                                            <p className="text-muted mb-0">

                                                Tasks assigned to you.

                                            </p>

                                        </div>

                                    </div>


                                    {/* Status Filters */}

                                    <div className="d-flex flex-wrap gap-2 mb-4">


                                        <button

                                            className={
                                                selectedFilter === "ALL"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }

                                            onClick={() => {

                                                setSelectedFilter("ALL");

                                            }}

                                        >

                                            All ({totalTasks})

                                        </button>


                                        <button

                                            className={
                                                selectedFilter === "TODO"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }

                                            onClick={() => {

                                                setSelectedFilter("TODO");

                                            }}

                                        >

                                            TODO ({todoTasks})

                                        </button>


                                        <button

                                            className={
                                                selectedFilter === "IN_PROGRESS"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }

                                            onClick={() => {

                                                setSelectedFilter("IN_PROGRESS");

                                            }}

                                        >

                                            In Progress ({inProgressTasks})

                                        </button>


                                        <button

                                            className={
                                                selectedFilter === "DONE"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }

                                            onClick={() => {

                                                setSelectedFilter("DONE");

                                            }}

                                        >

                                            Done ({doneTasks})

                                        </button>

                                    </div>


                                    {/* Task Data */}

                                    {

                                        filteredTasks.length === 0 ? (

                                            <EmptyState

                                                message={
                                                    selectedFilter === "ALL"
                                                        ? "No tasks assigned to you."
                                                        : `No ${selectedFilter
                                                            .toLowerCase()
                                                            .replace("_", " ")} tasks.`
                                                }

                                            />

                                        ) : (

                                            <DataTable

                                                columns={columns}

                                                data={currentTasks}

                                                renderActions={(task) => (

                                                    <>

                                                        {/* View */}

                                                        <button

                                                            className="btn btn-outline-success btn-sm me-2"

                                                            onClick={() =>
                                                                navigate(
                                                                    `/tasks/view/${task.id}`
                                                                )
                                                            }

                                                        >

                                                            View

                                                        </button>


                                                        {/* Update Status */}

                                                        <button

                                                            className="btn btn-outline-primary btn-sm"

                                                            onClick={() =>
                                                                openStatusModal(task)
                                                            }

                                                        >

                                                            Update Status

                                                        </button>

                                                    </>

                                                )}

                                            />

                                        )

                                    }


                                    {/* Pagination Information */}

                                    {

                                        filteredTasks.length > 0 && (

                                            <>

                                                <div className="d-flex justify-content-between align-items-center mt-3">

                                                    <small className="text-muted">

                                                        Showing{" "}

                                                        {currentTasks.length}

                                                        {" "}of{" "}

                                                        {filteredTasks.length}

                                                        {" "}tasks

                                                    </small>

                                                    <small className="text-muted">

                                                        Page{" "}

                                                        {currentPage}

                                                        {" "}of{" "}

                                                        {totalPages}

                                                    </small>

                                                </div>


                                                <Pagination

                                                    currentPage={currentPage}

                                                    totalPages={totalPages}

                                                    onPageChange={setCurrentPage}

                                                />

                                            </>

                                        )

                                    }


                                </div>

                            </div>


                        </>

                    )

                }

            </div>


            {/* Update Status Modal */}

            <UpdateStatusModal

                show={showModal}

                task={selectedTask}

                status={selectedStatus}

                onStatusChange={setSelectedStatus}

                onClose={closeStatusModal}

                onConfirm={updateTaskStatus}

            />


            <Footer />

        </div>

    );

}


export default MyTasks;
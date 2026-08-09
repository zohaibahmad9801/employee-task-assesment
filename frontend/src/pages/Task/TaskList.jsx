import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";

function TaskList() {

    // Stores all tasks
    const [tasks, setTasks] = useState([]);
    // Stores search text
    const [search, setSearch] = useState("");
    // Stores status filter
    const [statusFilter, setStatusFilter] = useState("ALL");
    // Stores priority filter
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    // Stores current page
    const [currentPage, setCurrentPage] = useState(1);
    // Loading state  
    const [loading, setLoading] = useState(true);
    // tasks per page
    const itemsPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Table Columns
     */
    const columns = [

        {
            key: "id",
            label: "ID"
        },

        {
            key: "title",
            label: "Title",

            render: (task) => (

                <span title={task.title}>

                    {task.title.length > 25
                        ? task.title.substring(0, 25) + "..."
                        : task.title}

                </span>

            )

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
        },
        {
            key: "assignedUserName",
            label: "Assigned To"
        }

    ];

    /**
     * Fetch all tasks from backend.
     */
    async function fetchTasks() {

        try {

            setLoading(true);
            const response = await api.get('/tasks');
            setTasks(response.data);

        } catch (error) {

            setErrorMessage(error?.response?.data?.message);

        } finally {

            setLoading(false);

        }

    }

    async function deleteTask() {

        try {

            await api.delete(`/tasks/${selectedTaskId}`);
            setShowModal(false);
            setSuccessMessage("Tasks deleted successfully.");
            fetchTasks();

        }

        catch (error) {

            setShowModal(false);
            setErrorMessage(error?.response?.data?.message);

        }

    }

    /**
     * Load Tasks when page opens.
     */
    useEffect(() => {

        fetchTasks();

    }, []);


    useEffect(() => {

        setCurrentPage(1);

    }, [search, statusFilter, priorityFilter]);

    useEffect(() => {

        if (successMessage) {

            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            return () => clearTimeout(timer);

        }

    }, [successMessage]);

    useEffect(() => {

        if (errorMessage) {

            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 4000);

            return () => clearTimeout(timer);

        }

    }, [errorMessage]);

    /**
     * Filter Tasks by search text, status, and priority.
     */
    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(search.toLowerCase())
            ||
            (task.description && task.description
                .toLowerCase()
                .includes(search.toLowerCase()))
            ||
            (task.assignedUserName && task.assignedUserName
                .toLowerCase()
                .includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === "ALL" || task.status === statusFilter;

        const matchesPriority =
            priorityFilter === "ALL" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;

    });

    /**
     * Pagination
     */
    const totalPages = Math.ceil(
        filteredTasks.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, endIndex);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setPriorityFilter("ALL");
    };

    const hasActiveFilters = search !== "" || statusFilter !== "ALL" || priorityFilter !== "ALL";

    return (

        <>

            <Navbar />

            <div className="container mt-5">

                <PageHeader title="📋 Tasks List" subtitle="Manage and view all tasks." buttonText="+ Create Task"
                    onButtonClick={() => navigate("/tasks/create")}
                    backText="← Back to Dashboard"
                    onBackClick={() => navigate("/admin/dashboard")}
                />

                {
                    successMessage && (

                        <AlertMessage type={'success'} message={successMessage}
                            onClose={() => setSuccessMessage("")}
                        />


                    )
                }

                {
                    errorMessage && (

                        <AlertMessage type={'danger'} message={errorMessage}
                            onClose={() => setErrorMessage("")}
                        />

                    )
                }

                <div className="card shadow-sm border-0 rounded-4">

                    <div className="card-body">

                        <div className="row g-2 mb-4 align-items-center">

                            <div className={hasActiveFilters ? "col-md-4" : "col-md-6"}>

                                <SearchBar value={search} onChange={setSearch} placeholder="Search Tasks by title, description or assigned employee..." />

                            </div>

                            <div className="col-md-3">

                                <select
                                    className="form-select rounded-3 py-2 border-1"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >

                                    <option value="ALL">All Statuses</option>
                                    <option value="TODO">TODO</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="DONE">DONE</option>

                                </select>

                            </div>

                            <div className="col-md-3">

                                <select
                                    className="form-select rounded-3 py-2 border-1"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                >

                                    <option value="ALL">All Priorities</option>
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>

                                </select>

                            </div>

                            {
                                hasActiveFilters && (

                                    <div className="col-md-2">

                                        <button
                                            className="btn btn-outline-secondary w-100 py-2 rounded-3"
                                            onClick={resetFilters}
                                        >

                                            🔄 Reset

                                        </button>

                                    </div>

                                )
                            }

                        </div>

                        {

                            loading ? (

                                <LoadingSpinner />

                            ) : filteredTasks.length === 0 ? (

                                <EmptyState message="No task found." />

                            ) : (

                                <DataTable columns={columns} data={currentTasks}

                                    renderActions={(task) => (

                                        <>

                                            <button className="btn btn-outline-success btn-sm me-2"
                                                onClick={() =>
                                                    navigate(`/tasks/view/${task.id}`)
                                                }
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-outline-warning btn-sm me-2"
                                                onClick={() =>
                                                    navigate('/tasks/edit/' + task.id)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => {
                                                    setSelectedTaskId(task.id);

                                                    setShowModal(true);
                                                }}
                                            >

                                                Delete

                                            </button>

                                        </>

                                    )}

                                />

                            )

                        }

                        {

                            !loading &&
                            filteredTasks.length > 0 && (

                                <>

                                    <div className="d-flex justify-content-between align-items-center mt-3">

                                        <small className="text-muted">

                                            Showing {currentTasks.length} of {filteredTasks.length} tasks

                                        </small>

                                        <small className="text-muted">

                                            Page {currentPage} of {totalPages}

                                        </small>

                                    </div>

                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                                    <ConfirmationModal

                                        show={showModal}

                                        title="Delete Task"

                                        message="Are you sure you want to delete this task?"

                                        onClose={() => setShowModal(false)}

                                        onConfirm={deleteTask}

                                        confirmButtonText="Delete"

                                        confirmButtonClass="btn btn-danger"

                                    />

                                </>



                            )

                        }

                    </div>

                </div>

            </div>

        </>

    );

}

export default TaskList;
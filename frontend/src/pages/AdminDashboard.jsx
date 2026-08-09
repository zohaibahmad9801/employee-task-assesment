/**
 * Admin Dashboard
 *
 * Responsibilities:
 *
 * 1. Display summary information.
 * 2. Provide links to employee management.
 * 3. Provide links to task management.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";






import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";
import Footer from "../components/Footer";

function AdminDashboard() {

    const navigate = useNavigate();

    const [employeeCount, setEmployeeCount] = useState(0);

    const [taskCount, setTaskCount] = useState(0);

    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Fetch dashboard data.
     */
    async function fetchDashboardData() {

        try {

            setLoading(true);

            const employeeResponse =
                await api.get("/employees");

            const taskResponse =
                await api.get("/tasks");

            setEmployeeCount(
                employeeResponse.data.length
            );

            setTaskCount(
                taskResponse.data.length
            );

        }

        catch (error) {

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to load dashboard."
            );

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        fetchDashboardData();

    }, []);

    return (

        <div className="d-flex flex-column min-vh-100">

            <Navbar />

            <div className="container mt-5 flex-grow-1">

                <PageHeader
                    title="📊 Admin Dashboard"
                    subtitle="Manage employees and tasks."
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

                {
                    loading ? (

                        <LoadingSpinner />

                    ) : (

                        <div className="row g-4">

                            {/* Employees */}

                            <div className="col-md-6">

                                <div className="card shadow-sm border-0 rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <h4 className="fw-bold">
                                            👥 Employees
                                        </h4>

                                        <p className="text-muted">
                                            Manage employee accounts.
                                        </p>

                                        <h2 className="fw-bold">
                                            {employeeCount}
                                        </h2>

                                        <p className="text-muted">
                                            Total Employees
                                        </p>

                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    navigate("/employees")
                                                }
                                            >
                                                View Employees
                                            </button>

                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    navigate("/employees/create")
                                                }
                                            >
                                                + Create
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Tasks */}

                            <div className="col-md-6">

                                <div className="card shadow-sm border-0 rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <h4 className="fw-bold">
                                            📋 Tasks
                                        </h4>

                                        <p className="text-muted">
                                            Manage and assign tasks.
                                        </p>

                                        <h2 className="fw-bold">
                                            {taskCount}
                                        </h2>

                                        <p className="text-muted">
                                            Total Tasks
                                        </p>

                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    navigate("/tasks")
                                                }
                                            >
                                                View Tasks
                                            </button>

                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    navigate("/tasks/create")
                                                }
                                            >
                                                + Create
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="card shadow-sm border-0 rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <h4 className="fw-bold">
                                            👤 Administrators
                                        </h4>

                                        <p className="text-muted">
                                            Create a new administrator account.
                                        </p>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                navigate("/admin/register")
                                            }
                                        >
                                            + Register Admin
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )

                }

            </div>

            <Footer />

        </div>

    );

}

export default AdminDashboard;
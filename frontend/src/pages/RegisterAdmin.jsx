/**
 * Register Admin
 *
 * Responsibilities:
 *
 * 1. Display admin registration form.
 * 2. Allow an admin to create a new admin account.
 * 3. Display success and error messages.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import ConfirmationModal from "../components/ConfirmationModal";
import AlertMessage from "../components/AlertMessage";
import Footer from "../components/Footer";
import api from "../api/axios";

function RegisterAdmin() {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState({

        name: "",

        email: "",

        password: ""

    });

    const [showModal, setShowModal] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");


    /**
     * Register new admin.
     */
    async function registerAdmin() {

        try {

            await api.post("/auth/register", admin);

            setShowModal(false);

            setSuccessMessage(
                "Admin registered successfully."
            );

            setAdmin({

                name: "",

                email: "",

                password: ""

            });

        }

        catch (error) {

            setShowModal(false);

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to register admin."
            );

        }

    }


    return (

        <div className="d-flex flex-column min-vh-100">

            <Navbar />

            <div className="container mt-5 flex-grow-1">

                <PageHeader
                    title="👤 Register Admin"
                    subtitle="Create a new administrator account."
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


                <div className="card shadow-sm border-0 rounded-4">

                    <div className="card-body p-4">

                        {/* Name */}

                        <div className="mb-3">

                            <label className="form-label">

                                Name

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter admin name"
                                value={admin.name}
                                onChange={(event) =>
                                    setAdmin({
                                        ...admin,
                                        name: event.target.value
                                    })
                                }
                            />

                        </div>


                        {/* Email */}

                        <div className="mb-3">

                            <label className="form-label">

                                Email

                            </label>

                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter admin email"
                                value={admin.email}
                                onChange={(event) =>
                                    setAdmin({
                                        ...admin,
                                        email: event.target.value
                                    })
                                }
                            />

                        </div>


                        {/* Password */}

                        <div className="mb-4">

                            <label className="form-label">

                                Password

                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter admin password"
                                value={admin.password}
                                onChange={(event) =>
                                    setAdmin({
                                        ...admin,
                                        password: event.target.value
                                    })
                                }
                            />

                        </div>


                        {/* Buttons */}

                        <div className="d-flex justify-content-end gap-2">

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    navigate("/admin/dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    setShowModal(true)
                                }
                            >
                                Register Admin
                            </button>

                        </div>


                        {/* Confirmation */}

                        <ConfirmationModal

                            show={showModal}

                            title="Register Admin"

                            message="Are you sure you want to create this admin account?"

                            onClose={() =>
                                setShowModal(false)
                            }

                            onConfirm={registerAdmin}

                            confirmButtonText="Register"

                            confirmButtonClass="btn btn-primary"

                        />

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );

}

export default RegisterAdmin;
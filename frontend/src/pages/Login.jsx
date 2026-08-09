/**
 * Login Component
 *
 * This component renders the login page of the application.
 *
 * Responsibilities:
 *
 * 1. Display the company logo and title.
 * 2. Display email and password fields.
 * 3. Allow the user to log in.
 * 4. Redirect the user after successful authentication.
 */

import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import Footer from "../components/Footer";

function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    //const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event) {

        // Prevents browser from refreshing the page while submitting the form
        event.preventDefault();

        try {

            const response = await api.post("auth/login", {

                email,

                password

            });

            localStorage.setItem(
                "token",
                response?.data?.token
            );

            localStorage.setItem(
                "role",
                response?.data?.role
            );

            localStorage.setItem(
                "userId",
                response?.data?.userId
            );

            localStorage.setItem(
                "userName",
                response?.data?.userName
            );

            setErrorMessage("");

            //setSuccessMessage("Login successful.");

            setTimeout(() => {

                if (response?.data?.role === "ADMIN") {

                    navigate("/admin/dashboard");

                } else {

                    navigate("/my-tasks");

                }

            }, 1000);

        }

        catch (error) {

            //setSuccessMessage("");

            setErrorMessage(
                error?.response?.data?.message ||
                "Invalid email or password."
            );

        }

    }

return (

    <div className="d-flex flex-column min-vh-100">

        {/* Login Navbar */}

        <nav
            className="navbar navbar-dark"
            style={{
                backgroundColor: "#0A3FAF",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
            }}
        >

            <div className="container-fluid px-4">

                <div className="navbar-brand d-flex align-items-center">

                    <img
                        src="/logo.png"
                        alt="Al Nada Exchange"
                        width="55"
                        height="55"
                        className="me-3"
                    />

                    <div>

                        <div
                            className="fw-bold text-white"
                            style={{
                                fontSize: "22px",
                                lineHeight: "1.1"
                            }}
                        >
                            AL NADA EXCHANGE
                        </div>

                        <small className="text-light">
                            Employee Task Management Portal
                        </small>

                    </div>

                </div>

            </div>

        </nav>


        {/* Login Content */}

        <div className="container-fluid bg-light flex-grow-1">

            <div className="row justify-content-center align-items-center">

                <div className="col-md-4 mt-5">

                    <div className="card shadow border-0 rounded-4 p-4">

                        <h2 className="text-center mb-3">
                            Employee Task Management
                        </h2>

                        <p className="text-center text-muted">
                            Please login to continue
                        </p>

                        <div
                            className="alert alert-info py-2 mb-3"
                            role="alert"
                        >
                            <small>
                                <strong>Note:</strong> Both Admin and Employee
                                users can log in using their registered
                                credentials.
                            </small>
                        </div>

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

                        <form onSubmit={handleLogin}>

                            {/* Email */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />

                            </div>

                            {/* Password */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Login
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

        <Footer />

    </div>

);

}

export default Login;
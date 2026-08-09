import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");

    function handleLogout() {

        localStorage.clear();

        navigate("/");
    }

    return (

        <nav
            className="navbar navbar-expand-lg navbar-dark"
            style={{
                backgroundColor: "#0A3FAF",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
            }}
        >

            <div className="container-fluid px-4">

                {/* Logo */}

                <Link
                     to={role === "ADMIN" ? "/admin/dashboard" : "/my-tasks"}
                    className="navbar-brand d-flex align-items-center"
                >

                    <img
                        src="/logo.png"
                        alt="Logo"
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

                </Link>

                {/* Hamburger */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>

                {/* Navbar content */}

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    {/* Center Links */}

                    <ul className="navbar-nav mx-auto">

                        {role === "ADMIN" && (

                            <>

                                <li className="nav-item">

                                    <Link
                                        className="nav-link px-3"
                                        to="/admin/dashboard"
                                    >
                                        Dashboard
                                    </Link>

                                </li>

                                <li className="nav-item">

                                    <Link
                                        className="nav-link px-3"
                                        to="/employees"
                                    >
                                        Employees
                                    </Link>

                                </li>

                                <li className="nav-item">

                                    <Link
                                        className="nav-link px-3"
                                        to="/tasks"
                                    >
                                        Tasks
                                    </Link>

                                </li>

                            </>

                        )}

                        {role === "EMPLOYEE" && (

                            <li className="nav-item">

                                <Link
                                    className="nav-link px-3"
                                    to="/my-tasks"
                                >
                                    My Tasks
                                </Link>

                            </li>

                        )}

                    </ul>

                    {/* Right side */}

                    <div
                        className="d-flex align-items-center gap-3 mt-3 mt-lg-0"
                    >

                        <span className="text-white">

                            👤 {userName}

                        </span>

                        <button
                            className="btn btn-outline-light"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;
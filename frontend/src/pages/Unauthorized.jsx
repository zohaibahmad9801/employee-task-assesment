import { useNavigate } from "react-router-dom";

function Unauthorized() {

    const navigate = useNavigate();

    return (

        <div className="container-fluid min-vh-100 bg-light">

            <div className="row min-vh-100 justify-content-center align-items-center">

                <div className="col-md-6 col-lg-5">

                    <div className="card shadow-sm border-0 rounded-4 text-center">

                        <div className="card-body p-5">

                            <div className="display-1 fw-bold text-danger mb-3">
                                403
                            </div>

                            <h2 className="fw-bold mb-3">
                                Access Denied
                            </h2>

                            <p className="text-muted mb-4">
                                You do not have permission to access this page.
                            </p>

                            <button
                                className="btn btn-primary px-4"
                                onClick={() => navigate("/")}
                            >
                                ← Back to Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Unauthorized;
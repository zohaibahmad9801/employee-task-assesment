/**
 * View Employee
 *
 * Responsibilities:
 *
 * 1. Read employee id from URL.
 * 2. Fetch employee details.
 * 3. Display employee information.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import PageHeader from "../../components/PageHeader";
import AlertMessage from "../../components/AlertMessage";
import api from "../../api/axios";

function ViewEmployee() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [employee, setEmployee] = useState({});

    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Fetch employee by id.
     */
    async function fetchEmployeeById() {

        try {

            const response = await api.get(`/employees/${id}`);

            setEmployee(response.data);

        }

        catch (error) {

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to fetch employee."
            );

        }

    }

    useEffect(() => {

        fetchEmployeeById();

    }, [id]);

    return (

        <>

            <Navbar />

            <div className="container mt-5">

                <PageHeader
                    title="👁 View Employee 👤"
                    subtitle="View employee details."
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

                        {/* Employee Header */}

                        <div className="border-bottom pb-3 mb-4">

                            <h4 className="fw-bold mb-1">

                                {employee.name}

                            </h4>

                            <small className="text-muted">

                                Employee ID: {employee.id}

                            </small>

                        </div>


                        {/* Employee Information */}

                        <div className="row g-4">

                            {/* Name */}

                            {

                                employee.name && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Name

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {employee.name}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Email */}

                            {

                                employee.email && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Email

                                        </label>

                                        <p className="mb-0 mt-1">

                                            {employee.email}

                                        </p>

                                    </div>

                                )

                            }


                            {/* Role */}

                            {

                                employee.role && (

                                    <div className="col-md-6">

                                        <label className="fw-bold text-muted">

                                            Role

                                        </label>

                                        <div className="mt-1">

                                            <span className="badge bg-primary">

                                                {employee.role}

                                            </span>

                                        </div>

                                    </div>

                                )

                            }

                        </div>


                        {/* Back Button */}

                        <div className="d-flex justify-content-end mt-4 pt-3 border-top">

                            <button

                                className="btn btn-outline-secondary"

                                onClick={() => navigate("/employees")}

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

export default ViewEmployee;
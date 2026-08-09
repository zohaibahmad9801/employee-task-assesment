/**
 * Edit Employee
 *
 * Responsibilities:
 *
 * 1. Read employee id from URL.
 * 2. Fetch employee details.
 * 3. Populate form.
 * 4. Update employee.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import PageHeader from "../../components/PageHeader";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import AlertMessage from "../../components/AlertMessage";

function EditEmployee() {

    const { id } = useParams();

    const [employee, setEmployee] = useState({

        name: "",

        email: "",

        role: ""

    });

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
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

            setErrorMessage(error?.response?.data?.message);

        }

    }

    /**
 * Update employee.
 */
    async function updateEmployee() {

        try {

            await api.put(`/employees/${id}`, employee);

            setShowModal(false);

            setSuccessMessage("Employee updated successfully.");

            setTimeout(() => {

                navigate("/employees");

            }, 1500);

        }

        catch (error) {

            setShowModal(false);

            setErrorMessage(error?.response?.data?.message);

            //alert(error?.response?.data?.message);

        }

    }

    useEffect(() => {

        fetchEmployeeById();

    }, [id]);

    return (

        <>

            <Navbar />

            <div className="container mt-5">

                <PageHeader title="✏ Edit Employee 👤" subtitle="Update employee information." />

                {
                    successMessage && (

                        <AlertMessage type={'success'} message={successMessage} onClose={() => setSuccessMessage("")} />

                    )
                }

                {
                    errorMessage && (

                        <AlertMessage type={'danger'} message={errorMessage} onClose={() => setErrorMessage("")} />

                    )
                }

                <div className="card shadow-sm border-0 rounded-4">

                    <div className="card-body">

                        {/* Name */}

                        <div className="mb-3">

                            <label className="form-label">Name</label>

                            <input type="text" className="form-control" value={employee.name}

                                onChange={(event) =>

                                    setEmployee({

                                        ...employee,

                                        name: event.target.value

                                    })

                                }

                            />

                        </div>

                        {/* Email */}

                        <div className="mb-3">

                            <label className="form-label"> Email </label>

                            <input type="email" className="form-control" value={employee.email}

                                onChange={(event) =>

                                    setEmployee({

                                        ...employee,

                                        email: event.target.value

                                    })

                                }

                            />

                        </div>


                        {/* Role */}

                        <div className="mb-4">

                            <label className="form-label">Role</label>

                            <input type="text" className="form-control" value={employee.role} disabled />

                        </div>

                        <div className="d-flex justify-content-end gap-2">

                            <button className="btn btn-outline-secondary"onClick={() => navigate("/employees")}>
                                Cancel
                            </button>

                            <button className="btn btn-warning" onClick={() => setShowModal(true)}>
                                Update Employee
                            </button>

                        </div>

                        <ConfirmationModal

                            show={showModal}

                            title="Update Employee"

                            message="Are you sure you want to update this employee?"

                            onClose={() => setShowModal(false)}

                            onConfirm={updateEmployee}

                            confirmButtonText="Update"

                            confirmButtonClass="btn btn-outline-warning"

                        />

                    </div>

                </div>

            </div>

        </>

    );

}

export default EditEmployee;
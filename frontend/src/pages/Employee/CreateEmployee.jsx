
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import PageHeader from "../../components/PageHeader";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import AlertMessage from "../../components/AlertMessage";
function CreateEmployee() {

    const [employee, setEmployee] = useState({

        name: "",

        email: "",

        password: ""

    });
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    async function createEmployee() {

        try {

            const response = await api.post('/employees', employee);

            setShowModal(false);

            setSuccessMessage("Employee created successfully.");

            setTimeout(() => {

                navigate("/employees");

            }, 1500);

        }

        catch (error) {

            setShowModal(false);

            setErrorMessage(error?.response?.data?.message);

        }

    }


    return (<>
        <Navbar />
        <div className="container mt-5">

            <PageHeader title="👥 Create Employee" subtitle="Add new employee." />

            <AlertMessage
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage("")}
            />

            <AlertMessage
                type="danger"
                message={errorMessage}
                onClose={() => setErrorMessage("")}
            />

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

                        <label className="form-label">Password</label>

                        <input type="password" className="form-control" value={employee.password}
                            onChange={(event) =>

                                setEmployee({

                                    ...employee,

                                    password: event.target.value

                                })

                            }
                        />

                    </div>

                    <div className="d-flex justify-content-end gap-2">

                        <button className="btn btn-outline-secondary" onClick={() => navigate("/employees")}>
                            Cancel
                        </button>

                        <button className="btn btn-success" onClick={() => setShowModal(true)}>
                            Create Employee
                        </button>

                    </div>

                    <ConfirmationModal

                        show={showModal}

                        title="Add Employee"

                        message="Are you sure you want to add this employee?"

                        onClose={() => setShowModal(false)}

                        onConfirm={createEmployee}

                        confirmButtonText="Create"

                        confirmButtonClass="btn btn-outline-success"

                    />

                </div>

            </div>

        </div>


    </>)

}


export default CreateEmployee;
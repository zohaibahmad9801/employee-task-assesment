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

function EmployeeList() {

    // Stores all employees
    const [employees, setEmployees] = useState([]);
    // Stores search text
    const [search, setSearch] = useState("");
    // Stores current page
    const [currentPage, setCurrentPage] = useState(1);
    // Loading state
    const [loading, setLoading] = useState(true);
    // Employees per page
    const itemsPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
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
            key: "name",
            label: "Name"
        },

        {
            key: "email",
            label: "Email"
        },

        {
            key: "role",
            label: "Role",

            render: (employee) => (

                <span className="badge bg-primary">

                    {employee.role}

                </span>

            )

        }

    ];

    /**
     * Fetch all employees from backend.
     */
    async function fetchEmployees() {

        try {

            setLoading(true);
            const response = await api.get('/employees');
            setEmployees(response.data);

        } catch (error) {

            setErrorMessage(error?.response?.data?.message);

        } finally {

            setLoading(false);

        }

    }

    async function deleteEmployee() {

        try {

            await api.delete(`/employees/${selectedEmployeeId}`);
            setShowModal(false);
            setSuccessMessage("Employee deleted successfully.");
            fetchEmployees();

        }

        catch (error) {

            setShowModal(false);
            setErrorMessage(error?.response?.data?.message);

        }

    }

    /**
     * Load employees when page opens.
     */
    useEffect(() => {

        fetchEmployees();

    }, []);


    useEffect(() => {

        setCurrentPage(1);

    }, [search]);

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
     * Search Employees
     */
    const filteredEmployees = employees.filter((employee) =>

        employee.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        employee.email
            .toLowerCase()
            .includes(search.toLowerCase())

    );

    /**
     * Pagination
     */
    const totalPages = Math.ceil(
        filteredEmployees.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex =startIndex + itemsPerPage;
    const currentEmployees =filteredEmployees.slice(startIndex, endIndex);

    return (

        <>

            <Navbar />

            <div className="container mt-5">

                <PageHeader title="👥 Employee List" subtitle="Manage and view all employees." buttonText="+ Create Employee"
                    onButtonClick={() => navigate("/employees/create")}
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

                        <SearchBar value={search} onChange={setSearch}placeholder="Search Employees"/>

                        {

                            loading ? (

                                <LoadingSpinner />

                            ) : filteredEmployees.length === 0 ? (

                                <EmptyState message="No employees found."/>

                            ) : (

                                <DataTable columns={columns} data={currentEmployees}

                                    renderActions={(employee) => (

                                        <>

                                            <button className="btn btn-outline-success btn-sm me-2"
                                                onClick={() =>
                                                    navigate(`/employees/view/${employee.id}`)
                                                }
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-outline-warning btn-sm me-2"
                                                onClick={() =>
                                                    navigate('/employees/edit/' + employee.id)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => {
                                                    setSelectedEmployeeId(employee.id);

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
                            filteredEmployees.length > 0 && (

                                <>

                                    <div className="d-flex justify-content-between align-items-center mt-3">

                                        <small className="text-muted">

                                            Showing {currentEmployees.length} of {filteredEmployees.length} employees

                                        </small>

                                        <small className="text-muted">

                                            Page {currentPage} of {totalPages}

                                        </small>

                                    </div>

                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>

                                    <ConfirmationModal

                                        show={showModal}

                                        title="Delete Employee"

                                        message="Are you sure you want to delete this employee?"

                                        onClose={() => setShowModal(false)}

                                        onConfirm={deleteEmployee}

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

export default EmployeeList;
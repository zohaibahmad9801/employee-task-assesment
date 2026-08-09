import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard'
import MyTasks from './pages/MyTasks'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './pages/Unauthorized'
import EmployeeList from "./pages/Employee/EmployeeList";
import EditEmployee from "./pages/Employee/EditEmployee";
import ViewEmployee from "./pages/Employee/ViewEmployee";
import CreateEmployee from "./pages/Employee/CreateEmployee";
import TaskList from "./pages/Task/TaskList";
import EditTask from "./pages/Task/EditTask";
import CreateTask from "./pages/Task/CreateTask";
import ViewTask from "./pages/Task/ViewTask";
import RegisterAdmin from "./pages/RegisterAdmin";

function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <EditEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/view/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ViewEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/create"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CreateEmployee />
              </ProtectedRoute>
            }
          />

          //Tasks

          <Route
            path="/tasks"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <TaskList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <EditTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/create"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CreateTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/view/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
                <ViewTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/register"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <RegisterAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <MyTasks />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;



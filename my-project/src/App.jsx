import { HashRouter, Routes, Route } from "react-router-dom";

// ================= PUBLIC =================
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./components/Login";
import AnyLogin from "./pages/Login/AnyLogin";

// ================= LAYOUTS =================
import StudentHome from "./pages/StudentHome";
import FacultyHome from "./pages/FacultyHome";
import AdminHome from "./pages/AdminHome";

// ================= SHARED =================
import Dashboard from "./pages/Dashboard";

// ================= STUDENT =================
import MyThesis from "./components/student/MyThesis";
import FormsSubmission from "./components/student/FormsSubmission";
import AllFormsUploadPage from "./components/student/AllFormsUploadPage";
import ViewUploadedForms from "./components/student/ViewUploadedForms";
import StudentProfile from "./components/student/StudentProfile";

// Forms
import Form2A from "./components/forms/Form2A";
import Form2B from "./components/forms/Form2B";
import Form2C from "./components/forms/Form2C";
import Form2D from "./components/forms/Form2D";
import Form2E from "./components/forms/Form2E";
import Form2F from "./components/forms/Form2F";
import Form2G from "./components/forms/Form2G";
import Form2H from "./components/forms/Form2H";
import Form2I from "./components/forms/Form2I";
import Form2J from "./components/forms/Form2J";
import Form2K from "./components/forms/Form2K";

// ================= FACULTY =================
import Advisee from "./components/faculty/Advisee";
import Panelist from "./components/faculty/Panelist";
import FacultyProfile from "./components/faculty/FacultyProfile";


// ================= ADMIN =================
import Thesislist from "./components/admin/Thesislist";
import StudentList from "./components/admin/StudentList";
import FacultyList from "./components/admin/FacultyList";


//new example

import Form2a from "./components/admin/form2a.jsx";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/student" element={<AnyLogin />} />
        
        

        {/* STUDENT */}
        <Route path="/student" element={<StudentHome />}>
          <Route index element={<MyThesis />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="thesis" element={<MyThesis />} />
          <Route path="Profile" element={<StudentProfile />} />


          <Route path="forms" element={<FormsSubmission />} />
          <Route path="formsUpload" element={<AllFormsUploadPage />} />
          <Route path="formsView" element={<ViewUploadedForms />} />

          <Route path="forms/2a" element={<Form2A />} />
          <Route path="forms/2b" element={<Form2B />} />
          <Route path="forms/2c" element={<Form2C />} />
          <Route path="forms/2d" element={<Form2D />} />
          <Route path="forms/2e" element={<Form2E />} />
          <Route path="forms/2f" element={<Form2F />} />
          <Route path="forms/2g" element={<Form2G />} />
          <Route path="forms/2h" element={<Form2H />} />
          <Route path="forms/2i" element={<Form2I />} />
          <Route path="forms/2j" element={<Form2J />} />
          <Route path="forms/2k" element={<Form2K />} />
        </Route>

        {/* FACULTY */}
        <Route path="/faculty" element={<FacultyHome />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="advisee" element={<Advisee />} />
          <Route path="panelist" element={<Panelist />} />
          <Route path="facultyedit" element={<FacultyProfile />} />
          
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="thesislist" element={<Thesislist />} />
          <Route path="students" element={<StudentList />} />
          <Route path="faculty" element={<FacultyList />} />
       
        </Route>

      </Routes>
    </HashRouter>
  );
}

export default App;

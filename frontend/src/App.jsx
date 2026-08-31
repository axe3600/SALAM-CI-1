import {
  Routes,
  Route
} from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"

// PUBLIC
import Home from "./pages/public/Home"
import Login from "./pages/public/Login"
import Register from "./pages/public/Register"

// CONFERENCE
import ConferenceRoom from "./pages/conference/ConferenceRoom"
import ConferenceLive from "./pages/conference/ConferenceLive"
import ConferenceDetails from "./pages/conference/ConferenceDetails"
import ConferenceReplay from "./pages/conference/ConferenceReplay"

//COMMUNITY
import Community from "./pages/community/Community"
import CommunityAccess from "./pages/community/CommunityAccess"

// STUDENT
import StudentDashboard from "./pages/student/Dashboard"
import Catalog from "./pages/student/Catalog";
import PaymentTest from "./pages/student/PaymentTest";
import Courses from "./pages/student/Courses"
import CourseDetailsStudent from "./pages/student/CourseDetails";
import CourseLearn from "./pages/student/CourseLearn";
import Conferences from "./pages/student/Conferences"
import Certificates from "./pages/student/Certificates"
// CERTIFICATES PUBLIC
import CertificatesCatalog from "./pages/certificates/CertificatesCatalog"
import MyCertificates from "./pages/certificates/MyCertificates"
import Downloads from "./pages/student/Downloads"
import Profile from "./pages/student/Profile"
import CoursesCatalog from "./pages/courses/CoursesCatalog"
import CertificateDetails from "./pages/certificates/CertificateDetails"

// TEACHER
import DashboardTeacher from "./pages/teacher/Dashboard"
import CoursesTeacher from "./pages/teacher/Courses"
import CourseContent from "./pages/teacher/CourseContent"
import ChapterContent from "./pages/teacher/ChapterContent";
import CoursePreview from "./pages/teacher/CoursePreview";
import CourseStatistics from "./pages/teacher/CourseStatistics";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import StudentDetails from "./pages/teacher/StudentDetails";
import ConferencesTeacher from "./pages/teacher/Conferences"
import ConferenceRequestDetails from "./pages/teacher/ConferenceRequestDetails";
import ProfileTeacher from "./pages/teacher/Profile"
import AddCourse from "./pages/teacher/AddCourse"
import CreateConference from "./pages/teacher/CreateConference"
import MyConferences from "./pages/teacher/MyConferences";

// ADMIN
import AdminDashboard from "./pages/admin/Dashboard"
import Users from "./pages/admin/Users"
import CreateUser from "./pages/admin/CreateUser"
import CoursesAdmin from "./pages/admin/Courses"
import ConferencesAdmin from "./pages/admin/Conferences"
import ConferenceListAdmin from "./pages/admin/ConferenceList"
import CategoriesAdmin from "./pages/admin/Categories"
import CategoryDetails from "./pages/admin/CategoryDetails"
import CourseDetails from "./pages/admin/CourseDetails"
import FilesAdmin from "./pages/admin/Files"
import NotificationsAdmin from "./pages/admin/Notifications"
import StatisticsAdmin from "./pages/admin/Statistics"
import SettingsAdmin from "./pages/admin/Settings"
import ProfileAdmin from "./pages/admin/Profile"
import Maintenance from "./pages/public/Maintenance"

//MDP
import ForgotPassword from "./pages/public/ForgotPassword"
import ResetPassword from "./pages/public/ResetPassword"

function App() {

  return (

    <Routes>

      {/* PUBLIC */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/maintenance"
        element={<Maintenance />}
      />

          {/* CONFERENCE */}
      <Route
        path="/conference-room"
        element={<ConferenceRoom />}
      />

      <Route
        path="/conference-live/:id"
        element={<ConferenceLive />}
      />

      <Route
        path="/conference-details/:id"
        element={<ConferenceDetails />}
      />

      <Route
        path="/conference-replay/:id"
        element={<ConferenceReplay />}
      />


          {/* COMMUNITY */}
      <Route
        path="/community"
        element={<Community />}
      />

      <Route
        path="/community-access"
        element={<CommunityAccess />}
      />


      {/* ADMIN */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-create-user"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-edit-user/:id"
        element={
          <ProtectedRoute>
              <CreateUser />
          </ProtectedRoute>
        }

      />

      <Route
        path="/admin-courses"
        element={
          <ProtectedRoute>
            <CoursesAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-conferences"
        element={
          <ProtectedRoute>
            <ConferencesAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-conferences/list"
        element={
          <ProtectedRoute>
            <ConferenceListAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-categories"
        element={
          <ProtectedRoute>
            <CategoriesAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories/:id"
        element={
          <ProtectedRoute>
            <CategoryDetails />
          </ProtectedRoute>
        }
     />

      <Route
        path="/admin/courses/:id"
        element={<CourseDetails />}
      />

      <Route
        path="/admin-files"
        element={
          <ProtectedRoute>
            <FilesAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-notifications"
        element={
          <ProtectedRoute>
            <NotificationsAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-statistics"
        element={
          <ProtectedRoute>
            <StatisticsAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-settings"
        element={
          <ProtectedRoute>
            <SettingsAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute>
            <ProfileAdmin />
          </ProtectedRoute>
        }
      />


      {/* ENSEIGNANT */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute>
            <DashboardTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-courses"
        element={
          <ProtectedRoute>
            <CoursesTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-course-content/:id"
        element={<CourseContent />}
      />

      <Route
        path="/teacher-chapter-content/:chapterId"
        element={<ChapterContent />}
      />

      <Route
        path="/teacher-course-preview/:id"
        element={<CoursePreview />}
     />

      <Route
        path="/teacher-course-statistics/:id"
        element={<CourseStatistics />}
      />

      <Route
        path="/teacher-students"
        element={
          <ProtectedRoute>
            <TeacherStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-student/:id"
        element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-conferences"
        element={
          <ProtectedRoute>
            <ConferencesTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-my-conferences"
        element={
          <ProtectedRoute>
            <MyConferences />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-conferences/:id"
        element={
          <ProtectedRoute>
            <ConferenceRequestDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-profile"
        element={
          <ProtectedRoute>
            <ProfileTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-add-course"
        element={
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-create-conference"
        element={
          <ProtectedRoute>
            <CreateConference />
          </ProtectedRoute>
        }
      />


      {/* STUDENT */}
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
    path="/catalog"
    element={
        <ProtectedRoute>
            <Catalog />
        </ProtectedRoute>
    }
/>

<Route
  path="/payment-test/:paymentId"
  element={
    <ProtectedRoute>
      <PaymentTest />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-course/:id"
  element={
    <ProtectedRoute>
      <CourseDetailsStudent />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-course/:id/learn"
  element={
    <ProtectedRoute>
      <CourseLearn />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-courses"
  element={
    <ProtectedRoute>
      <Courses />
    </ProtectedRoute>
  }
/>


<Route
  path="/student-conferences"
  element={
    <ProtectedRoute>
      <Conferences />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-certificates"
  element={
    <ProtectedRoute>
      <Certificates />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-downloads"
  element={
    <ProtectedRoute>
      <Downloads />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/courses"
  element={<CoursesCatalog />}
/>

<Route
  path="/certificates"
  element={<CertificatesCatalog />}
/>

<Route
  path="/my-certificates"
  element={<MyCertificates />}
/>

<Route
  path="/certificate-details/:id"
  element={<CertificateDetails />}
/>

{/* MDP */}
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

    </Routes>

  )
}

export default App
import React, { useEffect } from "react";
import Login from "../Components/Login/Login";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "../Components/Home/Home";
import { connect } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import SideDrawer from "../Components/Drawer/SideDrawer";
import { matchRoutes, useLocation } from "react-router-dom";
import Navbar from "../Components/NavigationBar/Navbar";
import ProductTable from "../Components/ProductTable/ProductTable";
import Robots from "../Components/Robots/Robots";
import Inquiries from "../Components/Inquiries/Inquiries";
import ResetPassword from "../Components/resetPassword/ResetPassword";
import CreateProjects from "../Components/createProject/CreateProjects";
import Updateprojects from "../Components/updateProject/UpdateProject";
import DeleteProjects from "../Components/deleteProjects/DeleteProjects";
import Careers from "../Components/careers/Careers";
import UpdateCareers from "../Components/careers/UpdateCareers";
import DeleteCareers from "../Components/careers/DeleteCareers";
import FontColor from "../Components/fontandColor/FontColor";

function Navigation(props) {
  const location = useLocation();
  const navigateTo = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      window.localStorage.clear();
      localStorage.removeItem("access_token");
      navigateTo("/");
      props.loggedOut();
    }
  }, [location.pathname]);

  return (
    <>
      <div>
        {location.pathname !== "/" && props.loggedIn ? (
          <div className="">
            <Navbar />
            <SideDrawer />
          </div>
        ) : (
          ""
        )}

        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/inquiries" element={<Inquiries />} />
              <Route path="/createProjects" element={<CreateProjects />} />
              <Route
                path="/updateProjects"
                element={<ProductTable pageMode="Update" type="Projects" />}
              />
              <Route path="/updateProjectsinner" element={<Updateprojects />} />
              <Route
                path="/deleteProjects"
                element={<ProductTable pageMode="Delete" type="Projects" />}
              />
              <Route path="/deleteProjectsinner" element={<DeleteProjects />} />

              <Route path="/careers" element={<Careers pageMode="Add" />} />
              <Route
                path="/updateCareers"
                element={<ProductTable pageMode="Update" type="Careers" />}
              />
              <Route path="/updateCareersinner" element={<UpdateCareers />} />
              <Route
                path="/deleteCareers"
                element={<ProductTable pageMode="Delete" type="Careers" />}
              />
              <Route path="/deleteCareersinner" element={<DeleteCareers />} />
              <Route path="/font_color" element={<FontColor />} />
            </Route>
            <Route path="*" element={<Robots />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

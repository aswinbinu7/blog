import React from "react";
import { Routes, Route } from "react-router-dom";
// import LandingPage from "../components/landing page/LandingPage";
import Header from "../components/landing page/Header";
// import Content from "../components/landing page/Content";
import ContentButton from "../components/landing page/ContentButton";
import Form from "../components/welcome/Form";
import SignUp from "../components/welcome/SignUp";
import BlogList from "../components/blog list/BlogList";
import MyBlogs from "../components/blog list/MyBlog";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {/* <LandingPage /> */}
            <Header />
            {/* <Content /> */}
            <ContentButton />
          </>
        }
      />

      <Route
        path="/form"
        element={
          <>
            <Form />
          </>
        }
      />

      <Route
        path="/signup"
        element={
          <>
            <SignUp />
          </>
        }
      />

      <Route
        path="/blogs"
        element={
          <>
            <BlogList />
          </>
        }
      />

      <Route
        path="/myblogs"
        element={
          <>
            <MyBlogs />
          </>
        }
      />
    </Routes>
  );
};
export default AppRoutes;

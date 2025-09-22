import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router"; // Use react-router-dom for browser routing

// Components and Pages
import Head from "./components/Head";
import Body from "./components/Body";
import About from "./About";
import Contact from "./Contact";
import Error from "./Error";
import Home from "./Home";
import VenueDetailsnew from "./components/VenueDetailsnew";
import BookingSuccessful from "./components/BookingSuccessful";
import Footer from "./components/Footer"; // Add footer component

// Layout component to wrap routes and maintain layout consistency
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Lift selectedCity state here for sharing between Head and Body
  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  return (
    <>
      {/* Show Head only if NOT home page */}
      {!isHomePage && (
        <Head selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      )}

      {/* Pass selectedCity and setter down via Outlet context */}
      <Outlet context={{ selectedCity, setSelectedCity }} />

      {/* Footer on all pages */}

      {!isHomePage && <Footer />}
    </>
  );
};

// Define app routes
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: ":city", element: <Body /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "venuedetails/:city/:activeKey", element: <VenueDetailsnew /> },
      { path: "booking-successful", element: <BookingSuccessful /> },
    ],
  },
]);

// Render app to root element
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);

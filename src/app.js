import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ReactDOM from "react-dom/client";
import Head from "./components/Head";
import Body from "./components/Body";
import { useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router"; // Use react-router-dom

// Component imports
import About from "./About";
import Contact from "./Contact";
import Error from "./Error";
import Home from "./Home";
import VenueDetailsnew from "./components/VenueDetailsnew";
import BookingSuccessful from "./components/BookingSuccessful"; // ✅ NEW IMPORT

// Layout component
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Lift selectedCity state here to share between Head and Body
  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  return (
    <div id="root">
      {!isHomePage && (
        <Head selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      )}
      {/* Pass selectedCity and setter down to children */}
      <Outlet context={{ selectedCity, setSelectedCity }} />
    </div>
  );
};

// Router configuration
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: ":city",
        element: <Body />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "venuedetails/:city/:activeKey",
        element: <VenueDetailsnew />,
      },
      {
        path: "booking-successful", // ✅ NEW ROUTE
        element: <BookingSuccessful />,
      },
    ],
  },
]);

// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);

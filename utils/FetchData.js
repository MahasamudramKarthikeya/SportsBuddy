// import React, { useEffect, useState } from "react";
// import { cities } from "./constants";

// export default function FetchData({
//   selectedCity,
//   setSelectedCity,
//   pageNo,
//   setPageNo,
// }) {
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [pageNo, setpageNo] = useState(0);

//   useEffect(() => {
//     fetchData(selectedCity, pageNo);
//   }, [selectedCity, pageNo]);

//   const fetchData = async (city, pageNo) => {
//     const { lat, lng } = cities[city];
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/venues?lat=${lat}&lng=${lng}&pageNo=${pageNo}`
//       );
//       const json = await response.json();
//       const venueList = json?.data?.venueList || [];
//       console.log(venueList);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const pageNext = () => {
//     setpageNo(pageNo + 1);
//     console.log(`next ${pageNo}`);
//   };
//   const pagePrev = () => {
//     if (pageNo <= 1) {
//       setpageNo(0);
//     } else setpageNo(pageNo - 1);
//     console.log(`prev ${pageNo}`);
//   };

//   const handleCityChange = (event) => {
//     setSelectedCity(event.target.value); // Update state with the new selected value
//     setpageNo(0);
//   };

//   return (
//     <div>
//       {/* City Dropdown */}
//       <div className="city-selector">
//         <div className="citybtn">
//           <img
//             className="loc-img"
//             src="https://png.pngtree.com/png-vector/20240929/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-png-image_13983760.png"
//           />
//           <select id="city" value={selectedCity} onChange={handleCityChange}>
//             {Object.keys(cities).map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <div className="pagebtn">
//         <button className="spagebtn" onClick={pagePrev}>
//           Prev
//         </button>
//         <button className="spagebtn" onClick={pageNext}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

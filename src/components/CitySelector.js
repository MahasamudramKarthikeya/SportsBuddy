import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCity } from "../features/citySlice";
import Select, { components } from "react-select";
import { cities } from "../../utils/constants";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router"; // ✅ added for navigation

export default function CitySelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ hook to redirect on selection
  const selectedCity = useSelector((state) => state.city.selectedCity);

  const cityOptions = Object.entries(cities).map(([cityName, coords]) => ({
    value: { name: cityName, ...coords },
    label: cityName,
  }));

  const options = selectedCity
    ? cityOptions.some((opt) => opt.value.name === selectedCity.name)
      ? cityOptions
      : [
          ...cityOptions,
          {
            value: selectedCity,
            label: selectedCity.name,
          },
        ]
    : cityOptions;

  const SingleValue = ({ data, ...props }) => (
    <components.SingleValue {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <FaMapMarkerAlt
          style={{
            marginRight: 6,
            color: "#fff",
            flexShrink: 0,
            minWidth: "14px",
          }}
        />
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
            maxWidth: "100%",
          }}
          title={data.label}
        >
          {data.label}
        </span>
      </div>
    </components.SingleValue>
  );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 25,
      border: "2px solid #00b157",
      paddingLeft: 10,
      backgroundColor: "#00b157",
      boxShadow: "none",
      fontSize: "1rem",
      color: "#fff",
      minHeight: "40px",
      maxHeight: "40px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      outline: "none",
      "&:hover": {
        borderColor: "#00b157",
        boxShadow: "none",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
      outline: "none",
      boxShadow: "none",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#e0f7e9",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#fff",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#00b157"
        : state.isFocused
        ? "#00b157"
        : "#fff",
      color: state.isSelected || state.isFocused ? "#fff" : "#00b157",
      fontSize: "1rem",
      padding: 10,
      cursor: "pointer",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const handleCityChange = (selected) => {
    dispatch(setSelectedCity(selected.value));

    // ✅ Redirect to /city/<city-name>
    const cityName = selected.value.name;
    navigate(`/${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="city-selector-modern">
      <Select
        options={options}
        value={
          selectedCity
            ? options.find((opt) => opt.value.name === selectedCity.name)
            : null
        }
        onChange={handleCityChange}
        styles={customStyles}
        placeholder="Select a city..."
        isSearchable
        components={{ SingleValue }}
        classNamePrefix="city"
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
}

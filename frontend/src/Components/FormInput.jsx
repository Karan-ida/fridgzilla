import React from "react";

const FormInput = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
};

export default FormInput;

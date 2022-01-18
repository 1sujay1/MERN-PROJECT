import React from "react";
import './form-input.style.scss';

const FormInput = ({ handleChange, label, ...otherInputProps }) => {
    return (
        <div className="group">
            <input
                {...otherInputProps}
                onChange={handleChange}
                className="form-input"
            />
            {
                label
                    ? <label className={`${otherInputProps.value.length ? 'shrink' : ''} form-input-label`} >{label}</label>
                    : null
            }
        </div>
    )
}
export default FormInput;
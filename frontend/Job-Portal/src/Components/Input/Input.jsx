import './Input.css';

// Input Component - Reusable input field with label and error handling
const Input = ({
    label,
    type = 'text',
    error,
    required = false,
    ...rest
}) => {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`input ${error ? 'input-error' : ''}`}
                {...rest}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Input;

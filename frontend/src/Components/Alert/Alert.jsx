import './Alert.css';

// Alert Component - Shows success, error, info, or warning messages
const Alert = ({ type = 'info', message, onClose }) => {
    if (!message) return null;

    return (
        <div className={`alert alert-${type}`}>
            <span className="alert-message">{message}</span>
            {onClose && (
                <button className="alert-close" onClick={onClose}>
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;

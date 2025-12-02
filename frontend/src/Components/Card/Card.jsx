import './Card.css';

// Card Component - Container with shadow and optional hover effect
const Card = ({ children, className = '', hover = false, ...rest }) => {
    return (
        <div className={`card ${hover ? 'card-hover' : ''} ${className}`} {...rest}>
            {children}
        </div>
    );
};

export default Card;

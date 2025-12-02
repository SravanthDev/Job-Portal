import './Button.css';

// Button Component - Reusable button with different styles and sizes
const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    type = 'button',
    disabled = false,
    onClick,
    ...rest
}) => {
    const className = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`.trim();

    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;

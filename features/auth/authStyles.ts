// authStyles.ts

// Button Styles
export const buttonStyles = {
    primary: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    secondary: {
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

// Input Styles
export const inputStyles = {
    default: {
        border: '1px solid #ced4da',
        padding: '10px',
        borderRadius: '5px',
        width: '100%',
    },
    error: {
        border: '1px solid #dc3545',
    }
};

// Card Styles
export const cardStyles = {
    default: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    highlighted: {
        border: '1px solid #007bff',
        backgroundColor: '#f8f9fa',
    }
};

// Alert Styles
export const alertStyles = {
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #c3e6cb',
    },
    danger: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #f5c6cb',
    }
};

// Export all styles
export default {
    buttonStyles,
    inputStyles,
    cardStyles,
    alertStyles,
};
// validation.ts

// Function to validate email format
export function validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// Function to validate password strength
export function validatePassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number and one special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// Function to validate PIN (4-digit)
export function validatePIN(pin: string): boolean {
    const re = /^\d{4}$/;
    return re.test(pin);
}

// Function to validate display name
export function validateDisplayName(name: string): boolean {
    const re = /^[a-zA-Z0-9 ]{3,30}$/;
    return re.test(name);
}

// Function to sanitize input
export function sanitizeInput(input: string): string {
    return input.replace(/[<>"'&]/g, '');
}
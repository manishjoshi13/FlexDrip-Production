import {body,validationResult} from "express-validator";

export const handleValidationErrors = (req, res, next) => {
    
    const errors = validationResult(req);
    console.log("backend",errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    
    next();
};

export const validateRegister = [

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone must be 10 digits')
        .isNumeric()
        .withMessage('Phone must be numeric'),
    
    body('role')
        .optional()
        .isIn(['buyer', 'seller'])
        .withMessage('Role must be either buyer or seller'),

    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full Name is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('Full Name must be between 3 and 30 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    handleValidationErrors
];

// Login validation rules
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email or Username is required')
        .withMessage('Please provide a valid email address or username'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('role')
        .optional()
        .isIn(['buyer', 'seller'])
        .withMessage('Role must be either buyer or seller'),
        
    handleValidationErrors
];


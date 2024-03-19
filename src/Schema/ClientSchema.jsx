import * as Yup from 'yup';

const clientschema = Yup.object().shape({
    name: Yup.string()
    .min(5, 'User ID must be at least 4 characters')
    .max(50, 'User ID must be less than 20 characters')
    .required('Company Name is required'),
    email: Yup.string()
    .email('Invalid Email')
    .required('Email is required'),
    mobile_number: Yup.string()
    .email('Invalid Email')
    .required('Email is required'),
    country: Yup.string()
    .required('Country is required')
});

export default clientschema;
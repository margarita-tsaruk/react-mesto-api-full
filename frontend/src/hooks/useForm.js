import { useState } from 'react';

export function useForm() {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

  
    const handleChange = (event) => {
      const {value, name} = event.target;
      setValues({...values, [name]: value});
      setErrors({ ...errors, [name]: event.target.validationMessage });
      setIsValid(event.target.checkValidity());
    };

    function resetErrors() {
        setErrors({});
        setValues({});
        setIsValid(false);
    }

    return {values, handleChange, setValues, isValid, errors, resetErrors};
  }
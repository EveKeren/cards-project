import { useState } from "react";
import Joi from "joi";

export default function useForm(initialForm, schemaObj, onSubmit) {
  const [formDetails, setFormDetails] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fullSchema = Joi.object(schemaObj);

  const validateField = (name, value) => {
    const fieldSchema = schemaObj[name];
    if (!fieldSchema) return;
    const { error } = Joi.object({ [name]: fieldSchema }).validate({
      [name]: value,
    });
    setErrors((prev) => ({
      ...prev,
      [name]: error ? error.details[0].message : undefined,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formDetails[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const allTouched = Object.keys(schemaObj).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    setTouched((prev) => ({ ...allTouched, ...prev }));

    const { error } = fullSchema.validate(formDetails, { abortEarly: false });
    if (error) {
      const nextErrors = {};
      for (const d of error.details) nextErrors[d.path[0]] = d.message;
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    await onSubmit(formDetails);
  };

  const resetForm = (next = initialForm) => {
    setFormDetails(next);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  };

  return {
    formDetails,
    errors,
    touched,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
    setFormDetails,
    resetForm,
  };
}

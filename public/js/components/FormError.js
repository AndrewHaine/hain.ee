import React from 'react';

const FormError = (props) => {
  return (
    <span className="form-error" data-erroring={props.erroring.status}>
      <strong>Error: </strong> {props.erroring.message}
    </span>
  );
};

export default FormError;

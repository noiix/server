//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists.`;
    res.send({messages: error});
 }

 //handle field formatting, empty fields, and mismatched passwords
 const handleValidationError = (err, res) => {
    let errors = Object.values(err.errors).map(el => el.message);
  
    let code = 400;
    if(errors.length > 1) {
      const formattedErrors = [] 
      errors.map(err => {
        let error = {title: err, type: 'error'}
        formattedErrors.push(error);
        }).
        res.status(code)
          .json({notification: formattedErrors})
      } else {
           res.status(code).send({notification: {title: errors[0], type: 'error'}})
      }
 }




module.exports = (err, req, res, next) => {
    try {
        console.log('error middleware');
        if(err.name === 'ValidationError') {
            return err = handleValidationError(err, res)
        };
        if(err.code && err.code == 11000) {
            return err = handleDuplicateKeyError(err, res)
        };
    }catch(err) {
        res.status(500).send({notification: {title: 'Ups, something went wrong. Please, try again', type: 'error'}})
    }
}
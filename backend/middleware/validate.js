const validate = (schema) => (req, res, next) => {

    try {
        schema.parse(req.body);
        next();

    } catch (err) {

        return res.status(400).json({
            success: false,
            errors: err.issues || err.errors,
        });
    }
};

export default validate;

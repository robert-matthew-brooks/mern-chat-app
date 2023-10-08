function customErrorHandler(err, _req, res, next) {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
}

function mongoErrorHandler(err, _req, res, next) {
  if (err.code === 11000) {
    res.status(422).send({ code: '11000', msg: 'username already exists' });
  } else next(err);
}

function serverErrorHandler(err, _req, res, _next) {
  res.status(500).send({ msg: `unhandled internal server error: ${err}` });
}

module.exports = { customErrorHandler, mongoErrorHandler, serverErrorHandler };

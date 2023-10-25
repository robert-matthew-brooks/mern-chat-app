function customErrorHandler(err, _req, res, next) {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
}

function jwtErrorHandler(err, _req, res, next) {
  if (err.message === 'jwt malformed') {
    res.status(403).send({ msg: 'invalid json web token' });
  } else next(err);
}

function mongoErrorHandler(err, _req, res, next) {
  if (err.code === 11000) {
    res.status(422).send({ msg: 'username already exists' });
  } else next(err);
}

function serverErrorHandler(err, _req, res, _next) {
  console.log(err);
  res.status(500).send({ msg: `${err}` });
}

module.exports = {
  customErrorHandler,
  jwtErrorHandler,
  mongoErrorHandler,
  serverErrorHandler,
};

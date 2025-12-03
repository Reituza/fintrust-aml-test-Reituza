// Global error handling middleware
exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status
  });
};

exports.notFound = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
};

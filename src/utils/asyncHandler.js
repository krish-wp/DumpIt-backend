const asyncHandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      if (typeof next === 'function') {
        return next(error);
      }
      console.error(error);
      if (res && typeof res.status === 'function') {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  };
};

export { asyncHandler };

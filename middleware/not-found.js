const notFoundMiddleware = (req, res) => {
  res.status(404).send("Page Not Found.");
};

export default notFoundMiddleware;

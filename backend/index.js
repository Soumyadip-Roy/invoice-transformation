const express = require("express");
const cors = require("cors");
const path = require("path");
const documentRoutes = require("./routes/documentRoutes");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/invoice", documentRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running",
  });
});

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

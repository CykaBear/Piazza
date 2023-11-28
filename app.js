const express = require('express');
const app = express();
app.use(express.json()); // for parsing application/json

// Define routes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

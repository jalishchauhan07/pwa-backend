const mongoose = require("mongoose");

module.exports = (async () => {
  try {
    console.log(process.env.DBURL);
    return await mongoose.connect(process.env.DBURL);
  } catch (err) {
    throw err;
  }
})();

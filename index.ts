const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const webpush = require("web-push");

const vapidkeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:demo@gmail.com",
  vapidkeys.publicKey,
  vapidkeys.privatekey
);

dotenv.config("./.env");

const db = require("./db/connectDB");
const userInfo = require("./modal/userInfo");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: `${process.env.proxy}` }));

db.then(() => {
  function isPrime(n: number) {
    if (n <= 1) {
      return false;
    }
    if (n === 2) {
      return true;
    }
    if (n % 2 === 0) {
      return false;
    }
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }

  function generatePrimes() {
    let primes = 0;
    for (let num = 1; num <= 10; num++) {
      if (isPrime(num)) {
        primes = num;
        break;
      }
    }
    return primes;
  }
  app.post("/process-data", async (req: any, res: any) => {
    try {
      const { username, age, favoriteColor, email, skillLevel } = req.body;
      if (!username || !age || !favoriteColor || !email || !skillLevel) {
        return res
          .status(400)
          .send({ message: "Please fill in all required fields." });
      }
      const userInformation = await userInfo({
        username,
        age: age * generatePrimes(),
        favoriteColor,
        email,
        skillLevel,
      }).save();
      if (userInformation) {
        return res.status(200).send({ message: "Data is Successfully save" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/get-data", async (req: any, res: any) => {
    try {
      const { currentPage = 1 } = req.body;
      const userRecord = await userInfo
        .find()
        .skip((currentPage - 1) * 5)
        .limit(5);
      if (!userInfo.length) {
        return res.status(400).send({ message: "No record" });
      }
      return res.status(200).send({ data: userRecord });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/subscribe", (req: any, res: any) => {
    try {
      const subscription = req.body;
      subscription.push(subscription);
      res.status(201).json({});
    } catch (err) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.listen(process.env.port, () => {
    console.log(`Server is listening on ${process.env.port}`);
  });
}).catch((err: any) => {
  console.error(err);
});

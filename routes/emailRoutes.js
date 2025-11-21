const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const multer = require("multer");

const { getDB } = require("../config/db");
const emailQueue = require("../queue/emailQueue");
const communityTemplate = require("../email/template/communityTemplate");


// use multer for file uploads if needed in future

const upload = multer({ dest: "uploads/" });


router.post("/send-community-emails", async (req, res) => {
  const { communityId, subject } = req.body;

  const db = getDB();

const sampleUsers = [ "691f05d03a9b40275804138d", "603ce613e4305500116ffd9a" ];
// convert to ObjectIds

const sampleUserObjectIds = sampleUsers.map(id => new ObjectId(id));

  const users = await db
    .collection("users")
    .find({ community : new ObjectId(communityId), _id: { $in : sampleUserObjectIds } })
    .toArray();

    console.log("Users to email:", users.length);

  for (const user of users) {
    const html = communityTemplate(user.fullName);

    const jobData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.fullName,
      subject,
      html
    };

    // Save into email_log collection
    await db.collection("email_logs").insertOne({
      ...jobData,
      status: "queued",
      createdAt: new Date()
    });

    const job = await emailQueue.add("community-emails", jobData);
    console.log(`📤 Job produced → ID: ${job.id}, Email: ${user.email}`);
  }

  res.json({
    message: `${users.length} emails queued successfully`
  });
});

router.post("/send-excel-emails", upload.single("file"), async (req, res) => {

  const subject = req.body.subject || "Join Us for a Magical 2-Day Birthday Bash at Töölö- Bellandur Library!";
  // get data from excel file in req.file

  const xlsx = require("xlsx");
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  // console.log("Excel data rows:", data);

  const users = data.map(row => ({
    fullName: row["Full Name"],
    email: row["Email"]
  }));


  const db = getDB();

  //validate emails by database
  const userEmails = users.map(u => u.email && u.email.trim().toLowerCase()).filter(email => email);
  const validUsers = await db
    .collection("users")
    .find({ email: { $in: userEmails } })
    .toArray();

    console.log("Total valid users:", validUsers.length);



const sampleUsers = [ "691f05d03a9b40275804138d", "603ce613e4305500116ffd9a" ];
// convert to ObjectIds

const sampleUserObjectIds = sampleUsers.map(id => new ObjectId(id));


  for (const user of validUsers) {
    const html = communityTemplate(user.fullName);

    const jobData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.fullName,
      subject,
      html
    };

    // Save into email_log collection
    await db.collection("email_logs").insertOne({
      ...jobData,
      status: "queued",
      createdAt: new Date()
    });

    const job = await emailQueue.add("send-email", jobData);
    console.log(`📤 Job produced → ID: ${job.id}, Email: ${user.email}`);
  }

  res.json({
    message: `${users.length} emails queued successfully`
  });
});

module.exports = router;

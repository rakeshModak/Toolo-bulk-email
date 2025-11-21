require("dotenv").config();
const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { connectDB, getDB } = require("../config/db");
const sendEmail = require("../email/send");
const path = require("path");

(async () => {
  await connectDB();
  const db = getDB();

  console.log("Worker connected to MongoDB");

  const worker = new Worker(
    "community-emails",
    async (job) => {
      const record = job.data;
      console.log(`🔄 Job consumed → ID: ${job.id}, Email: ${record.email}`);

      try {
        // Send email with attachment
        // add 2 sec setTimeout to simulate delay
        console.log('Delaying for 2 seconds to simulate email sending...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        // await sendEmail({
        //   email: record.email,
        //   subject: record.subject,
        //   html: record.html,
        //   attachments: [
        //     {
        //       filename: 'Schedule.png',
        //       path: path.join(__dirname, '../email/template/img/scheduled.png')
        //     }
        //   ]
        // });

        console.log(`Email sent to ${record.email}`);

        // Update in DB
        await db.collection("email_logs").updateOne(
          { userId: record.userId, subject: record.subject },
          {
            $set: {
              status: "sent",
              sentAt: new Date()
            }
          }
        );

        return true;
      } catch (err) {
        await db.collection("email_logs").updateOne(
          { userId: record.userId, subject: record.subject },
          {
            $set: {
              status: "failed",
              error: err.message
            }
          }
        );
        throw err;
      }
    },
    {
      connection,
      concurrency: 5,
      attempts: 3,
      backoff: { type: "fixed", delay: 4000 }
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job completed → ID: ${job.id}, Email: ${job.data.email}`);
  });

  worker.on("failed", (job, err) => {
    console.log(`Email failed → ${job.data.email} : ${err.message}`);
  });
})();

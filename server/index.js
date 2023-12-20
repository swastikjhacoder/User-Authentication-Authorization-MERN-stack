import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/connect-mongoose.js";
import userRouter from "./routes/user-route.js";
import multer from "multer";
import PdfModel from "./models/document-model.js";

config();

const corsOption = {
  origin: true,
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server 👍🏻" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on PORT: ${process.env.PORT} 🤘🏻`);
});

dbConnect().then(() => {
  console.log(`Successfully connected to mongodb database. 👍🏻`);
});

app.use("/user", userRouter);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;
    const pdf = new PdfModel({
      filename: originalname,
      contentType: mimetype,
      data: buffer,
    });
    await pdf.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/pdf", async (req, res) => {
  try {
    const data = await PdfModel.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/update-pdf/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { isApproved } = req.body;

    const updatedTask = await PdfModel.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

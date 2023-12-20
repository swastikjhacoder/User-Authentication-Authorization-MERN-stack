import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  isApproved: { type: String, default: "pending" },
});

const PdfModel = mongoose.model("Pdf", pdfSchema);

export default PdfModel;

import express from 'express';
import { pdfUpload } from '../controllers/pdf-controller.js';

const pdfRouter = express.Router();

pdfRouter.post( '/upload', pdfUpload );

export default pdfRouter;
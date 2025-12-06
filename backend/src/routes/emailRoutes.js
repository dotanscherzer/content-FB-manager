import express from 'express';
import { getEmails } from '../controllers/emailController.js';

const router = express.Router();

router.get('/', getEmails);

export default router;


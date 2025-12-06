import express from 'express';
import { getFbPosts } from '../controllers/fbPostController.js';

const router = express.Router();

router.get('/', getFbPosts);

export default router;


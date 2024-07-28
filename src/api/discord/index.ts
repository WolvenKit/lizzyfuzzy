import express from 'express';
const router = express.Router();

import roles from './roles';
import user from './user';

router.use('/roles', roles);
router.use('/user', user);

export default router
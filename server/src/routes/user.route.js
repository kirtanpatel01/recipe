import { Router } from "express";
import { userRegister, userLogin, logoutUser } from "../controllers/user.controller.js";
import {verifyJWT} from '../middlewares/verifyUser.js'

const router = Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', verifyJWT, logoutUser);

export default router;
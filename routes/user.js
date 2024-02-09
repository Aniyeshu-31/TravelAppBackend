import express from 'express';
import {UpdateUser,deleteUser,getSingleUser,getAllUsers} from '../controllers/userController.js';
import {verifyToken ,verifyUser,verifyAdmin } from '../Utils/verifyToken.js'
const router = express.Router();
//Update Existing User
router.put('/:id',UpdateUser);
//delete User
router.delete('/:id',deleteUser);
//getSingle User
router.get('/getSingleUser/:id',verifyUser,getSingleUser);
//getAllUser User
router.get('/getAllUser',getAllUsers);


export default router;
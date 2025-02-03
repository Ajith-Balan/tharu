import express from 'express';
import {
  registerController,
  loginController,
  testController,
  updateProfile,
  createOrderController,
  getOrdersController,
  ShowOrdersController,
  updateOrderlist,
  Forget,
  verifyotp,
  updatePassword,
  getoneManager,
} from '../controllers/authcontroller.js';
import { isAdmin, isManager, requireSignIn } from '../middlewares/authmiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerController);

// User login route
router.post('/login', loginController);

// Test route for admin access, protected by sign-in and admin check
router.get('/test', requireSignIn, isAdmin, testController);

router.get('/getmanager/:id',   getoneManager);



// Route to check if a user is authenticated (without admin check)
router.get('/userauth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});


router.get('/adminauth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });

});

router.get('/managerauth', requireSignIn,  isManager, (req, res) => {
  res.status(200).send({ ok: true });
});


router.put('/profile', requireSignIn, updateProfile)

router.post('/resetpassword',  updatePassword)





router.post('/orders', requireSignIn, createOrderController)


router.get('/getorders/:userid', requireSignIn, getOrdersController)

router.get('/getorders', requireSignIn, ShowOrdersController)

router.post('/updateorder/:id', requireSignIn, updateOrderlist)

router.post('/forgetpswd',  Forget)

router.post('/verifyotp',  verifyotp)



export default router;


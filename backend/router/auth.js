import express from 'express';
import {
  registerController,
  loginController,
  testController,
  updateProfile,

  Forget,
  verifyotp,
  updatePassword,
  getoneSupervisor,
} from '../controllers/authcontroller.js';
import {  isManager, requireSignIn } from '../middlewares/authmiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerController);

// User login route
router.post('/login', loginController);

// Test route for admin access, protected by sign-in and admin check
router.get('/test', requireSignIn,  testController);

router.get('/getsupervisor',   getoneSupervisor);



// Route to check if a user is authenticated (without admin check)
router.get('/userauth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});


router.get('/adminauth', requireSignIn,  (req, res) => {
  res.status(200).send({ ok: true });

});

router.get('/managerauth', requireSignIn,  isManager, (req, res) => {
  res.status(200).send({ ok: true });
});


router.put('/profile', requireSignIn, updateProfile)

router.post('/resetpassword',  updatePassword)







router.post('/forgetpswd',  Forget)

router.post('/verifyotp',  verifyotp)



export default router;


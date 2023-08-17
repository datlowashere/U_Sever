const express=require('express');
const router=express.Router();

const controllers=require('../app/controllers/controller');

router.post('/register',controllers.register);
router.post('/login',controllers.login);
router.get('/users/:id',controllers.getUserById);
router.put('/users/:id',controllers.updateUserById);
router.post('/resetpassword/request',controllers.resetpasswordRequest);
router.post('/resetpassword/confirm',controllers.resetpasswordComfirm);
router.post('/employees',controllers.addnewEmployee);
router.get('/employees/:userId',controllers.getEmployees);
router.put('/employees/:id',controllers.updateEmployee);
router.delete('/employees/:id',controllers.deleteEmployee);


module.exports=router;
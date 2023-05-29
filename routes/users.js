const userRouter = require('express').Router();
const { validateUserUpdate, validateAvatarUpdate, validateUserId } = require('../middlewares/validators');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:userId', validateUserId, getUserById);
userRouter.patch('/me', validateUserUpdate, updateUser);
userRouter.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

module.exports = userRouter;

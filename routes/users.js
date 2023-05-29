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
userRouter.patch('/me', validateUserUpdate, updateUser);
userRouter.get('/:userId', validateUserId, getUserById);
userRouter.patch('/me/avatar', validateAvatarUpdate, updateAvatar);
userRouter.get('/me', getUserInfo);

module.exports = userRouter;

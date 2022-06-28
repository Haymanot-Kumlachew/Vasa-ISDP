router.post('/login', userController.login)
router.get('/logout', auth, userController.logout)
router.get('/refresh_token', userController.refreshToken);
router.get('/infor', auth,  userController.getUser)
router.put('/update/password', auth, userController.updatePassword);
router.put('/update/info', auth, userController.updateUserInfo)
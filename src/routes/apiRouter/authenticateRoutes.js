import { Router } from 'express';
import CONFIG from '../../config';
import userController from '../../controller/userController';
import jwt from 'jsonwebtoken';
import { BaseError } from '../../errors';
import authenticateValidate from '../../validate/authenticateValidate';
import userValidate from '../../validate/userValidate';
import { verifyPasswordMd5 } from '../../utils/crypto';
import _ from 'lodash';
// import userController from '../controller/userController'
const router = Router();

router.post('/login', authenticateValidate.authenCreate, async (req, res, next) => {
	try {
		console.log('Authenticate body: ', res.locals.body);
		const { username, password } = res.locals.body;

		const user = {
			username,
			password,
		};

		let token;
		let dataToken;

		if (user && user.username) {
			const userInfo = await userController.find_one(_.omit(user, ['password'])).catch((err) => {
				throw new BaseError({
					type: 'userNotFoundError',
					status: 202,
					code: 'Login',
					err,
				});
			});
			console.log('userInfo: ', userInfo.status);
			if (userInfo && userInfo.status == 1) {
				const passOk = await verifyPasswordMd5(user.password, userInfo.password);
				console.log('passOk: ', passOk);
				if (passOk) {
					dataToken = { user: username, userId: userInfo.id };
					token = jwt.sign(
						{
							...dataToken,
						},
						process.env.JWT_SECRET,
						{
							expiresIn: `${CONFIG.TOKEN_LOGIN_EXPIRE}`,
						}
					);
					const groupUsersId = parseInt(userInfo.groupUsersId);
					if (token) {
						res.status(200).json({
							success: true,
							status: 'ok',
							token,
							role: groupUsersId === 1 ? 'admin' : groupUsersId === 3 ? 'teacher' : 'guest',
							currentAuthority: [],
							...dataToken,
						});
					} else {
						res.status(200).json({
							success: false,
							message: 'Đăng nhập thất bại',
							status: 'error',
							token: null,
							role: {},
							currentAuthority: 'guest',
						});
					}
				} else {
					throw new BaseError({
						statusCode: 200,
						type: 'loginPassError',
						name: 'Login',
					});
				}
			} else {
				if (userInfo && userInfo.status !== 1) {
					throw new BaseError({
						type: 'userInactiveError',
						status: 202,
						code: 'Login',
					});
				} else {
					throw new BaseError({
						statusCode: 200,
						type: 'userNotFoundError',
						name: 'Login',
					});
				}
			}
		} else {
			console.log('not pass');
		}
	} catch (error) {
		next(error);
	}
});

router.post('/signin', userValidate.authenCreate, userController.create);
export default router;

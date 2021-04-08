import { Router } from "express";
import CONFIG from "../config";
import userController from "../controller/userController";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    console.log("Authenticate body: ", req.body);
    const { username, password } = req.body;

    const user = {
      username,
      password
    };

    let token;
    let dataToken;

    if (user && user.username) {
      const userInfo = await userController.find_one(user).catch(err => {
        throw new Error({
          type: "userNotFoundError",
          status: 202,
          code: "Login",
          err
        });
      });

      if (userInfo && userInfo.status === '1') {

        if (user.password === userInfo.password) {
          dataToken = { user: username, userId: userInfo.id };
          token = jwt.sign(
            {
              ...dataToken
            },
            process.env.JWT_SECRET,
            {
              expiresIn: `${CONFIG.TOKEN_LOGIN_EXPIRE}`
            }
          );

          if (token) {
            res.status(200).json({
              success: true,
              status: "ok",
              token,
              role: [],
              currentAuthority: [],
              ...dataToken
            });
          } else {
            res
              .status(200)
              .json({
                success: false,
                message: "Đăng nhập thất bại",
                status: "error",
                token: null,
                role: {},
                currentAuthority: "guest"
              });
          }
        } else {
            throw new Error({
                statusCode: 200,
                type: 'loginPassError',
                name: 'Login'
            })
        }
      } else {
        if (userInfo && userInfo.status !== '1') {
            throw new Error({
                statusCode: 200,
                type: 'loginActiveError',
                name: 'Login'
            })
        } else {
            throw new Error({
                statusCode: 200,
                type: 'userNotFoundError',
                name: 'Login'
            })
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

export default router;

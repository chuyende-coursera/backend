import { Router } from "express";

import userController from "../../controller/userController";
import userValidate from "../../validate/userValidate";

const router = Router();

router.get("/", userValidate.authenFilter, userController.get_list);
// router.post("/changepass/:id", userController.changePass)
router.put("/:id", userValidate.authenUpdate, userController.update);
export default router;

import { Router } from "express";

import groupUserController from "../../controller/groupUserController";
import groupUserValidate from "../../validate/groupUserValidate";

const router = Router();

router.get("/", groupUserValidate.authenFilter, groupUserController.get_list);
router.post("/", groupUserValidate.authenCreate, groupUserController.create);
router.put("/:id", groupUserValidate.authenUpdate, groupUserController.update);
router.get("/:id", groupUserController.get_one);
router.get("/get/all", groupUserController.get_all);
export default router;

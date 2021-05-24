import { Router } from "express";

import skillController from "../../controller/skillController";
import skillValidate from "../../validate/skillValidate";

const router = Router();

router.get("/", skillValidate.authenFilter, skillController.get_list);
router.post("/", skillValidate.authenCreate, skillController.create);
router.put("/:id", skillValidate.authenUpdate, skillController.update);
router.get("/:id", skillController.get_one);
router.get("/get/all", skillController.get_all);
export default router;

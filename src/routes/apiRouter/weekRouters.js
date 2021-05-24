import { Router } from "express";

import weekController from "../../controller/weekController";
import weekValidate from "../../validate/weekValidate";

const router = Router();

router.get("/", weekValidate.authenFilter, weekController.get_list);
router.post("/", weekValidate.authenCreate, weekController.create);
router.put("/:id", weekValidate.authenUpdate, weekController.update);
router.get("/:id", weekController.get_one);
router.get("/get/all", weekController.get_all);
export default router;

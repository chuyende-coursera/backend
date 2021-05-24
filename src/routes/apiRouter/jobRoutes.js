import { Router } from "express";

import jobController from "../../controller/jobController";
import jobValidate from "../../validate/jobValidate";

const router = Router();

router.get("/", jobValidate.authenFilter, jobController.get_list);
router.post("/", jobValidate.authenCreate, jobController.create);
router.put("/:id", jobValidate.authenUpdate, jobController.update);
router.get("/:id", jobController.get_one);
router.get("/get/all", jobController.get_all);
export default router;

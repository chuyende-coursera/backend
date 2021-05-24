import { Router } from "express";

import courseController from "../../controller/courseController";
import courseValidate from "../../validate/courseValidate";

const router = Router();

router.get("/", courseValidate.authenFilter, courseController.get_list);
router.get("/:id", courseController.get_one);
router.get("/get/all", courseController.get_all);
export default router;

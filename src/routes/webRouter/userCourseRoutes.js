import { Router } from "express";

import userCourseController from "../../controller/userCourseController";
import userCourseValidate from "../../validate/userCourseValidate";

const router = Router();

router.get("/", userCourseValidate.authenFilter, userCourseController.get_list);
router.get("/:id", userCourseController.get_one);
router.get("/get/all", userCourseController.get_all);
export default router;

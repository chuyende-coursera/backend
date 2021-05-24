import { Router } from "express";

import userCourseController from "../../controller/userCourseController";
import userCourseValidate from "../../validate/userCourseValidate";

const router = Router();

router.get("/", userCourseValidate.authenFilter, userCourseController.get_list);
router.post("/", userCourseValidate.authenCreate, userCourseController.create);
router.post(
  "/new",
  userCourseValidate.authenCreate,
  userCourseController.createNew
);
router.put(
  "/:id",
  userCourseValidate.authenUpdate,
  userCourseController.update
);
router.put(
  "/update/userId",
  userCourseValidate.authenUpdate,
  userCourseController.updateByUserId
);
router.get("/:id", userCourseController.get_one);
router.get("/get/all", userCourseController.get_all);
export default router;

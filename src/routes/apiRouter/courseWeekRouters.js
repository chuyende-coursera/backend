import { Router } from "express";

import courseWeekController from "../../controller/courseWeekController";
import courseWeekValidate from "../../validate/courseWeekValidate";

const router = Router();

router.get("/", courseWeekValidate.authenFilter, courseWeekController.get_list);
router.post("/", courseWeekValidate.authenCreate, courseWeekController.create);
router.put(
  "/:id",
  courseWeekValidate.authenUpdate,
  courseWeekController.update
);
router.get("/:id", courseWeekController.get_one);
router.get("/get/all", courseWeekController.get_all);
export default router;

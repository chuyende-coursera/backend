import { Router } from "express";

import videoWeekController from "../../controller/videoWeekController";
import videoWeekValidate from "../../validate/videoWeekValidate";

const router = Router();

router.get("/", videoWeekValidate.authenFilter, videoWeekController.get_list);
router.post("/", videoWeekValidate.authenCreate, videoWeekController.create);
router.put("/:id", videoWeekValidate.authenUpdate, videoWeekController.update);
router.get("/:id", videoWeekController.get_one);
router.get("/get/all", videoWeekController.get_all);
export default router;

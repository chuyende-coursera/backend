import { Router } from "express";

import videoWeekController from "../../controller/videoWeekController";
import videoWeekValidate from "../../validate/videoWeekValidate";

const router = Router();

router.get("/", videoWeekValidate.authenFilter, videoWeekController.get_list);
router.get("/:id", videoWeekController.get_one);
router.get("/get/all", videoWeekController.get_all);
export default router;

import { Router } from "express";

import topicController from "../../controller/topicController";
import topicValidate from "../../validate/topicValidate";

const router = Router();

router.get("/", topicValidate.authenFilter, topicController.get_list);
router.post("/", topicValidate.authenCreate, topicController.create);
router.put("/:id", topicValidate.authenUpdate, topicController.update);
router.get("/:id", topicController.get_one);
router.get("/get/all", topicController.get_all);
export default router;

import { Router } from "express";

import languageController from "../../controller/languageController";
import languageValidate from "../../validate/languageValidate";

const router = Router();

router.get("/", languageValidate.authenFilter, languageController.get_list);
router.post("/", languageValidate.authenCreate, languageController.create);
router.put("/:id", languageValidate.authenUpdate, languageController.update);
router.get("/:id", languageController.get_one);
router.get("/get/all", languageController.get_all);
export default router;

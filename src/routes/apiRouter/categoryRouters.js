import { Router } from "express";

import catogoryController from "../../controller/catogoryController";
import categoryValidate from "../../validate/categoryValidate";

const router = Router();

router.get("/", categoryValidate.authenFilter, catogoryController.get_list);
router.post("/", categoryValidate.authenCreate, catogoryController.create);
router.put("/:id", categoryValidate.authenUpdate, catogoryController.update);
router.get("/:id", catogoryController.get_one);
router.get("/get/all", catogoryController.get_all);
export default router;

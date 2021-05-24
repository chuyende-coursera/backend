import { Router } from "express";

import topicRouters from "./routes/webRouter/topicRoutes";
import categoryRouters from "./routes/webRouter/categoryRouters";
import courseWeekRouters from "./routes/webRouter/courseWeekRouters";
import courseRouters from "./routes/webRouter/courseRouters";
import weekRouters from "./routes/webRouter/weekRouters";
import videoWeekRoutes from "./routes/webRouter/videoWeekRoutes";
import jobRoutes from "./routes/webRouter/jobRoutes";
import languageRoutes from "./routes/webRouter/languageRoutes";
import skillRoutes from "./routes/webRouter/skillRoutes";
import uploadRoutes from "./routes/webRouter/uploadRoutes";
import userCourseRoutes from "./routes/webRouter/userCourseRoutes";

const router = Router();

router.use("/topics", topicRouters);
router.use("/categories", categoryRouters);
router.use("/courses", courseRouters);
router.use("/courseWeeks", courseWeekRouters);
router.use("/weeks", weekRouters);
router.use("/videoWeek", videoWeekRoutes);
router.use("/jobs", jobRoutes);
router.use("/languages", languageRoutes);
router.use("/skills", skillRoutes);
router.use("/upload", uploadRoutes);
router.use("/userCourse", userCourseRoutes);
export default router;

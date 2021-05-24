import { Router } from "express";

import userRoutes from "./routes/apiRouter/userRoutes";
import topicRouters from "./routes/apiRouter/topicRouters";
import categoryRouters from "./routes/apiRouter/categoryRouters";
import courseWeekRouters from "./routes/apiRouter/courseWeekRouters";
import courseRouters from "./routes/apiRouter/courseRouters";
import weekRouters from "./routes/apiRouter/weekRouters";
import videoWeekRoutes from "./routes/apiRouter/videoWeekRoutes";
import jobRoutes from "./routes/apiRouter/jobRoutes";
import languageRoutes from "./routes/apiRouter/languageRoutes";
import skillRoutes from "./routes/apiRouter/skillRoutes";
import uploadRoutes from "./routes/apiRouter/uploadRoutes";
import userCourseRoutes from "./routes/apiRouter/userCourseRoutes";
import groupUserRoutes from "./routes/apiRouter/groupUserRoutes";
import currentUserRoutes from "./routes/apiRouter/currentUserRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version,
  });
});

router.use("/users", userRoutes);
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
router.use("/groupUsers", groupUserRoutes);
router.use("/currentUsers", currentUserRoutes);

export default router;

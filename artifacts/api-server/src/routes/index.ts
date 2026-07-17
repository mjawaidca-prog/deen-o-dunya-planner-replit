import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clipsRouter from "./clips";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clipsRouter);

export default router;

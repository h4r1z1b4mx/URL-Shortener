import { Router } from "express";
import { shortenUrl } from "../controllers/urlControllers";

const router = Router();


router.post("/shorten", shortenUrl);
router.get("/:shortUrlKey", );
router.get();

export default router;

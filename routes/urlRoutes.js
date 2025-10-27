import { Router } from "express";
import { redirectToLongUrl, shortenUrl } from "../controllers/urlControllers";

const router = Router();


router.post("/shorten", shortenUrl);
router.get("/:shortUrlKey", redirectToLongUrl);
router.get("/stats/:shortUrlKey", );

export default router;0

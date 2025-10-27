import { customAlphabet } from "nanoid";
import isURL from "validator/lib/isURL";
import URL from "../models/URL";



const nonoid = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    7
);


const BASE_URL = `${process.env.BASE_URL}:${process.env.PORT}`


export const shortenUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;
        originalUrl.trim();
        
        if (isURL(originalUrl) === false){
            throw new AppError("Invalid URL", 400);
        }

        const url = await URL.findOneAndUpdate(
            {originalUrl}, 
            {$setOnInsert: {originalUrl, shortUrlKey: nonoid()}},
            {new: true, upsert: true, setDefaultsOnInsert: true, lean: true }
        ).exec();

        const shortUrl = `${BASE_URL}/api/v1/${url.shortUrlKey}`;

        res.status(200).json({
            message:"URL shortened successfully",
            originalUrl, 
            shortUrl, 
            expiresIn: Math.floor(url.expiresAt - new Date())
        });

    } catch(err) {
        next(err);
    }
};


export const redirectToLongUrl = async (req, res, next) => {
    try {
        const {shortUrlKey} = req.params;
        shortUrlKey.trim();

        if (!shortUrlKey) {
            throw new AppError("Short URL is required", 400);
        }

        if (!shortUrlKey.length !== 7) {
            throw new AppError("Incorrect Short URL", 400);
        }

        const url = URL.findOne({shortUrlKey}).lean().exec();

        if (!url || !url.originalUrl) {
            throw new AppError(`Short URL Key not found: ${shortUrlKey} `, 404);
        }

        if (url.expiresAt < new Date()) {
            throw new AppError("Short URL has expired", 410);
        }   

        res.redirect(301, url.originalUrl);
    } catch(err) { 
        next(err);
    }
}


export const getUrlStats = async (req, res, next) => {
    try {
        const {shortUrlKey} = req.params;
        
        shortUrlKey.trim();

        if (!shortUrlKey) {
            throw new AppError("Short URL is required", 400);
        }

        if (shortUrlKey.length !== 7) {
            throw new AppError("Incorrect Short URL", 400);
        }

        const url = await URL.findOne({
            shortUrlKey,
        }, {originalUrl: 1,clickCount: 1, createdAt:1, expiresAt: 1}).lean().exec();

        if (!url || !url.originalUrl) {
            throw new AppError(`Short URL Key not found: ${shortUrlKey}`, 404);
        }

        res.status(200).json({
            message:"URL stats fetched successfully",
            originalUrl: url.originalUrl, 
            clickCount: url.clickCount, 
             createdAt: url.createdAt.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }),   
            expiresIn: Math.floor(url.expiresAt - new Date()),
            status: url.expiresAt > new Date() ? "active" : "expired"
        });

    } catch (err) {
        next(err);
    }
}
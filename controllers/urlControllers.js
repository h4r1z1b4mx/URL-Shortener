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

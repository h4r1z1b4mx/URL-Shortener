import { customAlphabet } from "nanoid";
import isURL from "validator/lib/isURL";



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



    } catch(err) {
        next(err);
    }
}

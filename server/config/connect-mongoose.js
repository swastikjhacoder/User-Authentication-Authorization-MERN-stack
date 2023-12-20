import { connect } from "mongoose";
import { config } from "dotenv";

config();

export const dbConnect = async () =>
{
    try
    {
        await connect(process.env.MONGO_URL);
    } catch ( error )
    {
        console.log( `Error in mongodb database connection. Error: ${ error.message }` );
    }
}

import { UPLOADTHING_TOKEN } from "../config";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
 token: UPLOADTHING_TOKEN 
});

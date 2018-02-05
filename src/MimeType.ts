import { getType } from "mime";
import { extname } from "path";

export default class MimeType {

    public static getType(extname: string): string {
        return getType(extname);
    }

}
import DataURIParser from "datauri/parser.js";
import path from "path";

const getDataUrl = (file)=>{
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname);
    const dataUrl = parser.format(extName, file.buffer);
    return dataUrl;
}

export default getDataUrl;
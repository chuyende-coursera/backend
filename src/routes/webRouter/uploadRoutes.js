import { Router } from "express";
import fs from "fs";
import path from "path";
const router = Router();

const ROOT_DIR = process.cwd();
const ROOT_DIR_CONTAINER = `${ROOT_DIR}/uploads`;

const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line no-unused-vars

      console.log(`File ${fileName} exists.`);
      fs.readFile(fileName, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
router.get("/getFile/*", (req, res, next) => {
  try {
    // recordStartTime.call(req);
    let filePath = req.path.replace(/\/+\//g, "/");
    filePath = filePath.replace("/getFile/", "");
    readFile(`${ROOT_DIR_CONTAINER}/${filePath}`)
      .then((data) => {
        const file = Buffer.from(data, "base64");

        console.log("file: ", file);
        res.writeHead(200, {
          "Content-Type": `*`,
          "Content-Length": file.length,
          "Cache-Control": "public, max-age=7776000",
          Expires: new Date(Date.now() + 7776000000).toUTCString(),
        });
        res.end(file);
      })
      .catch((error) => {
        console.log("readFile catch: ", error);
        res.send({
          err: error,
        });
      });
  } catch (error) {
    next(error);
  }
});

export default router;

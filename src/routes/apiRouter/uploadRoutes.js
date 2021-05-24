import { Router } from "express";
import multer from "multer";
const router = Router();
import fs from "fs";
import path from "path";
import encodeStr from "../../utils/encodeStr";
import * as ApiErrors from "../../errors";

const ROOT_DIR = process.cwd();
const ROOT_DIR_CONTAINER = `${ROOT_DIR}/uploads`;
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const originalname = encodeStr(file.originalname);
    cb(null, file.fieldname + "-" + originalname);
  },
});

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

const fileFilter = (req, file, cb) => {
  // // console.log("file: ", file);
  // // console.log("req: ", req.file);
  const regex = /^video/;
  // // console.log("file.mimetype: ", regex.test(file.mimetype));
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    regex.test(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new ApiErrors.BaseError({
        statusCode: 202,
        type: "crudError",
        error: "Không hỗ trợ định dạng",
      }),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: 1024 * 1024 * 1024,
});
router.post("/uploadfile", upload.single("myFiles"), (req, res, next) => {
  // // console.log(res);
  // // console.log(next);
  const file = req.file;
  let objReturn;
  console.log("req: ", req.file);
  if (!file) {
    throw new ApiErrors.BaseError({
      statusCode: 202,
      type: "crudError",
      error: "Có lỗi trong lúc upload",
    });
  } else {
    const dirPath = path.resolve(file.path).replace(/\\/g, "/");
    const dirRelativePath = `myFiles${dirPath.split("myFiles")[1]}`;

    objReturn = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename,
      path: dirRelativePath,
    };
  }
  res.send(objReturn);
});
router.post(
  "/uploadMultifile",
  upload.array("myFiles", 12),
  (req, res, next) => {
    const file = req.files;
    // console.log("req: ", file);
    if (!file) {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "crudError",
        error: "Có lỗi trong lúc upload",
      });
    }
    res.send(file);
  }
);
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

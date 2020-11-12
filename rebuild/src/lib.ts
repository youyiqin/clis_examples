const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
const Colors = require("colors");

export default async function getTargetData(target: string) {
  const targetStat = await fsPromise.lstat(target);
  const modeStr = (targetStat.mode & parseInt("777", 8)).toString(8);
  const permString =
    "0" +
    Colors.blue(modeStr[0]) +
    Colors.green(modeStr[1]) +
    Colors.yellow(modeStr[2]);
  const size = targetStat.size;
  const dataObj = {
    name: Colors.green(target),
    mode: permString,
    size: Colors.yellow(
      size > 1024 * 1024
        ? `${(size / 1024 / 1024).toFixed(2)} MB`
        : `${(targetStat.size / 1024).toFixed(2)} KB`
    ),
    type: targetStat.isDirectory() ? "directory" : "file",
    lastUpdateTime: new Date(targetStat.ctime),
  };
  return Promise.resolve(dataObj);
  if (targetStat.isFile()) {
  } else if (targetStat.isDirectory()) {
  }
}

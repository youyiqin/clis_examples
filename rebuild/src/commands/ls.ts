import { Command, flags } from "@oclif/command";
const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
import cli from "cli-ux";
const Colors = require("colors");
const assert = require("assert");
import getTargetData from "../lib";

export default class Ls extends Command {
  static description = "rebuild command: ls";

  static examples = [`$ rebuild ls`];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    details: flags.boolean({
      char: "d",
      description: "print the details of the file and directory.",
      default: false,
    }),
  };

  static args = [{ name: "target", default: process.cwd() }];

  async run() {
    const { args, flags } = this.parse(Ls);
    const isDetail = flags.details;
    const target = args.target;
    const targetLstat = await fsPromise.lstat(target);
    if (targetLstat.isDirectory()) {
      console.log("is directory");
      const dirData = await fsPromise.readdir(target);
      // console.log(dirData);

      dirData.forEach(async (item: string) => {
        await getTargetData(item);
      });
    } else if (targetLstat.isFile()) {
      const size = targetLstat.size;
      const data = [
        {
          name: Colors.green(target),
          size: Colors.yellow(
            size > 1024 * 1024
              ? `${(size / 1024 / 1024).toFixed(2)} MB`
              : `${(targetLstat.size / 1024).toFixed(2)} KB`
          ),
          type: targetLstat.isDirectory() ? "directory" : "file",
          lastUpdateTime: new Date(targetLstat.ctime),
        },
      ];
      // console.log(data);
      cli.table(data, {
        type: {
          header: "",
          get: (row) => (row.type === "file" ? "📝" : "🗂️"),
          minWidth: 4,
        },
        name: {
          minWidth: 18,
          get: (row) => row.name,
        },
        size: {
          minWidth: 10,
          get: (row) => row.size,
        },
        lastUpdateTime: {
          get: (row) =>
            `${row.lastUpdateTime.toLocaleDateString()} ${row.lastUpdateTime.toLocaleTimeString()}`,
        },
      });
    }
  }
}

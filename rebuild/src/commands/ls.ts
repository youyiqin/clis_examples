import { Command, flags } from "@oclif/command";
const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
import cli from "cli-ux";
const Colors = require("colors");

const assert = require("assert");

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
    } else if (targetLstat.isFile()) {
      const size = targetLstat.size();
      const accessData = await fsPromise.access(target);
      const data = [
        {
          name: Colors.green(target),
          size: Colors.yellow(
            size > 1024 * 1024
              ? `${size / 1024 / 1024} MB`
              : `${targetLstat.size / 1024} KB`
          ),
        },
      ];
      cli.table();
    }
    // const parentPath = path.join(_path, "..");
    // const currentPathData = await fs.readdirAsync;
  }
}

import { exec as ExecCallback } from "child_process";
import { promisify } from "util";

export const exec = promisify(ExecCallback);

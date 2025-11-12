import type { Request, Response } from "express";

export async function helloWorld(req: Request, res: Response) {
  return res.send("Hello, World!");
}

export async function exampleController(req: Request, res: Response) {
  const { msg } = req.params;
  if (!msg)
    return res.status(400).json({ error: "Message parameter is required" });
  return res.status(200).json({ message: `You sent: ${msg}` });
}

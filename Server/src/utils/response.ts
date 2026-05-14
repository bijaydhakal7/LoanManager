import type { Response } from "express";

export const ok = <T>(res: Response, data: T, message?: string): Response =>
  res.status(200).json({ success: true, message, data });

export const created = <T>(res: Response, data: T, message?: string): Response =>
  res.status(201).json({ success: true, message, data });

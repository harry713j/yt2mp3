import type { Request, Response, NextFunction } from "express";

function logging(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Request Details - ${req.method} ${req.url} | Address: ${
      req.socket.remoteAddress
    } | ${new Date(Date.now()).toLocaleString()}`
  );

  next();
}

export { logging };

import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { EviePhotos } from "../../utils/constants";

import { Canvas, Image } from "skia-canvas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const image = (
    await axios.get(EviePhotos[Math.floor(Math.random() * EviePhotos.length)], {
      responseType: "arraybuffer",
    })
  ).data as Buffer;

  const { width, height } = (() => {
    const { width: w, height: h } = req.query;

    if (typeof w !== "string" || typeof h !== "string")
      return { width: 500, height: 500 };

    const width = parseInt(w);
    const height = parseInt(h);

    if (isNaN(width) || isNaN(height)) return { width: 500, height: 500 };

    return { width, height };
  })();

  const resizedImage = sharp(image);

  resizedImage.resize(width, height);

  resizedImage.jpeg({ quality: 80 });

  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = await resizedImage.toBuffer();

  ctx.drawImage(img, 0, 0, width, height);

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.rect(5, 5, width - 10, height - 10);
  ctx.stroke();

  ctx.font = "30px Roboto";
  ctx.fillStyle = "white";
  ctx.globalAlpha = 0.5;
  ctx.fillText(`${width} x ${height}`, width / 2 - 50, height / 2 + 10);

  const buffer = await canvas.toBuffer("jpeg");

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "no-cache");
  res.status(200).send(buffer);
}

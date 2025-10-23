import s3, { S3_BUCKET_NAME as BUCKET, S3_REGION as REGION } from "../server/aws/s3.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";
import path from "node:path";

function buildPublicUrl(key) {
  if (!key) return key;
  // Virtual-hosted–style URL
  // https://sabai-booking-app-serista.s3.us-east-1.amazonaws.com/images/hero-background.png
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/images/${key}`;
}

class UploadController {
  static async getS3UploadUrl(req, res) {
    try {
      const { fileName, contentType, hotelId } = req.query;
      console.log(BUCKET, REGION);
      if (!BUCKET) {
        return res.status(500).json({ error: "S3 bucket is not configured" });
      }

      const ext = (path.extname(String(fileName || "")).toLowerCase().replace(".", "")) || "jpg";
      const random = crypto.randomUUID();
      const keyPrefix = hotelId ? `hotels/${hotelId}` : "hotels";
      const key = `${keyPrefix}/${random}.${ext}`;

      const putParams = {
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType || "application/octet-stream",
      };

      // Optional ACL when you want public objects and the IAM policy allows it
      if ((process.env.S3_UPLOAD_ACL || "").toLowerCase() === "public-read") {
        putParams.ACL = "public-read";
      }

      const command = new PutObjectCommand(putParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 60 });

      res.json({ url, key, publicUrl: buildPublicUrl(key) });
    } catch (err) {
      console.error("Error creating presigned URL:", err);
      res.status(500).json({ error: "Failed to create S3 upload URL", detail: err.message });
    }
  }

  static async deleteS3Object(req, res) {
    try {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "key is required" });
      if (!BUCKET) return res.status(500).json({ error: "S3 bucket is not configured" });

      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      res.json({ ok: true });
    } catch (err) {
      console.error("Error deleting S3 object:", err);
      res.status(500).json({ error: "Failed to delete image", detail: err.message });
    }
  }
}

export default UploadController;

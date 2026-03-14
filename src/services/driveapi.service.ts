import { Readable } from "stream";
import driveApi from "../configs/driveapi.config";

export class DriveApiService {
  static async upload(req: {
    filename: string;
    fileBuffer: Buffer;
    mimeType: string;
    allowMimeType: string[];
  }): Promise<{ success: boolean; message: string; fileId?: string }> {
    // request
    const { allowMimeType, fileBuffer, filename, mimeType } = req;
    // check mime type
    if (!allowMimeType.includes(mimeType)) {
      return {
        success: false,
        message: "Invalid mime type",
      };
    }

    // create stream
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    // upload
    const result = await driveApi.files.create({
      requestBody: {
        name: filename,
        mimeType,
        parents: ["1cEKV2IlrHP1aBDW0cfsy_aoZW7kgt9za"],
      },
      media: {
        mimeType,
        body: bufferStream,
      },
      fields: "id",
    });

    return {
      success: true,
      message: "File uploaded successfully",
      fileId: result.data.id!,
    };
  }

  //   delete file
  static async deleteFile(fileId: string): Promise<boolean> {
    const result = await driveApi.files.delete({
      fileId,
    });

    return result.status === 200;
  }

  //   download file
  static async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await driveApi.files.get(
        {
          fileId,
          alt: "media",
        },
        {
          responseType: "stream",
        },
      );

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        // data
        response.data.on("data", (chunk) => {
          chunks.push(chunk);
        });

        // end
        response.data.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        // error
        response.data.on("error", (error) => {
          reject(error);
        });
      });
    } catch (error) {
      throw error;
    }
  }
}

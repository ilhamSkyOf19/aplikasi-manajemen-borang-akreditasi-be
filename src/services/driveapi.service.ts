import { Readable } from "stream";
import driveApi from "../configs/driveapi.config";
import { drive_v3 } from "googleapis";
import { TipeDokumentasi } from "../utils/contstanst";
import { ENV } from "../utils/env";

export class DriveApiService {
  // check nama folder
  private static escapeDriveQuery(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  // get nama folder by tipe
  private static getFolderNameByTipe(tipe: TipeDokumentasi): string {
    switch (tipe) {
      case TipeDokumentasi.PENELITIAN:
        return "penelitian";

      case TipeDokumentasi.DEFAULT:
      default:
        return "default";
    }
  }

  // find folder by nama di google drive
  static async findFolderByName(params: {
    folderName: string;
    parentFolderId: string;
  }): Promise<string | null> {
    const { folderName, parentFolderId } = params;

    const safeFolderName = this.escapeDriveQuery(folderName);

    const result = await driveApi.files.list({
      q: [
        `name = '${safeFolderName}'`,
        `mimeType = '${ENV.GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
        `'${parentFolderId}' in parents`,
        `trashed = false`,
      ].join(" and "),
      fields: "files(id, name)",
      pageSize: 1,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    return result.data.files?.[0]?.id ?? null;
  }

  // fungsi create folder
  static async createFolder(params: {
    folderName: string;
    parentFolderId: string;
  }): Promise<string> {
    const { folderName, parentFolderId } = params;

    const result = await driveApi.files.create({
      requestBody: {
        name: folderName,
        mimeType: ENV.GOOGLE_DRIVE_FOLDER_MIME_TYPE,
        parents: [parentFolderId],
      },
      fields: "id",
      supportsAllDrives: true,
    });

    return result.data.id!;
  }

  // fungsi check folder ada atau tidak, jika tidak ada buat folder
  static async ensureFolder(params: {
    folderName: string;
    parentFolderId: string;
  }): Promise<string> {
    const existingFolderId = await this.findFolderByName(params);

    if (existingFolderId) {
      return existingFolderId;
    }

    return this.createFolder(params);
  }

  // upload ke google drive
  static async upload(req: {
    filename: string;
    fileBuffer: Buffer;
    mimeType: string;
    allowMimeType: string[];
    tipeFile: TipeDokumentasi;
  }): Promise<{ success: boolean; message: string; fileId?: string }> {
    const { allowMimeType, fileBuffer, filename, mimeType, tipeFile } = req;

    if (!allowMimeType.includes(mimeType)) {
      return {
        success: false,
        message: "Invalid mime type",
      };
    }

    // buat folder jika belum ada
    const folderName = this.getFolderNameByTipe(tipeFile);

    // check folder dalam google drive
    const targetFolderId = await this.ensureFolder({
      folderName,
      parentFolderId: ENV.ROOT_FOLDER_ID,
    });

    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    const result = await driveApi.files.create({
      requestBody: {
        name: filename,
        mimeType,
        parents: [targetFolderId],
      },
      media: {
        mimeType,
        body: bufferStream,
      },
      fields: "id",
      supportsAllDrives: true,
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

  static async getFileMetadata(
    providerFileId: string,
  ): Promise<drive_v3.Schema$File> {
    const metadata = await driveApi.files.get({
      fileId: providerFileId,
      fields: "id, name, mimeType, size",
      supportsAllDrives: true,
    });

    return metadata.data;
  }

  static async getFileStream(providerFileId: string): Promise<Readable> {
    const response = await driveApi.files.get(
      {
        fileId: providerFileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
      },
    );

    return response.data as unknown as Readable;
  }

  static async getFileForPreview(providerFileId: string): Promise<{
    metadata: drive_v3.Schema$File;
    stream: Readable;
  }> {
    const metadata = await this.getFileMetadata(providerFileId);
    const stream = await this.getFileStream(providerFileId);

    return {
      metadata,
      stream,
    };
  }
}

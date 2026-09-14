import { Request, Response } from "express";

import { LaporanServices } from "../services/laporan.service";
import { StatistikService } from "../services/statistik.service";
import { enrichKriteria } from "../helpers/helper";
import { AuthRequest } from "../types/authRequest";

export class LaporanController {
  static async exportLaporanPdf(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      // get periode
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        throw new Error("periode not found");
      }

      const data = await StatistikService.getStatistikForDownload({
        periode_id: periodeId,
        dosen_id: req?.data?.id,
        role: req?.data?.role,
      });

      //   chekc data
      if (!data) {
        throw new Error("data not found");
      }

      const kriteriaList = (data?.grafik_kriteria || []).map(enrichKriteria);

      const pdfBuffer = await LaporanServices.generateLaporanPdf({
        generatedAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),

        // lanjutkan

        summary: {
          total_dokumentasi: data.total_dokumentasi,
          total_dokumentasi_borang_belum_selesai:
            data.total_dokumentasi_borang_belum_selesai,
          total_dokumentasi_borang_selesai:
            data.total_dokumentasi_borang_selesai,
          total_dosen: data.total_dosen,
          total_kebutuhan_dokumentasi: data.total_kebutuhan_dokumentasi,
          total_kebutuhan_dokumentasi_belum_selesai:
            data.total_kebutuhan_dokumentasi_belum_selesai,
          total_kebutuhan_dokumentasi_selesai:
            data.total_kebutuhan_dokumentasi_selesai,
          total_file_selesai: data.total_file_selesai,
          total_kriteria: data.total_kriteria,
        },

        kriteriaList,
      });

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="laporan-statistik-akreditasi.pdf"',
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error("Gagal generate PDF:", error);

      res.status(500).json({
        message: "Gagal membuat laporan PDF",
      });
    }
  }
}

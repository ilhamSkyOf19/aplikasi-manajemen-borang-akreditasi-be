import PDFDocument from "pdfkit";
import {
  GrafikKriteriaType,
  ResponseStatistikType,
} from "../models/statistik.model";
import path from "path";
// ===== Palet warna (samain dengan desain HTML sebelumnya) =====
const COLOR = {
  navy: "#101828",
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  gray700: "#374151",
  gray500: "#6b7280",
  gray300: "#d1d5db",
  gray200: "#e5e7eb",
  gray100: "#f3f4f6",
  gray50: "#f9fafb",
  line: "#e7e9ee",
  white: "#ffffff",
};

const PAGE_MARGIN = 40;

interface KpiCardOptions {
  label: string;
  value: string | number;
  footer: string;
  accent: string;
}

interface DosenPic {
  nama: string;
}

interface KriteriaSnapshot extends GrafikKriteriaType {
  persen: number;
}

interface GenerateLaporanPdfParams {
  generatedAt: string;
  summary: Omit<ResponseStatistikType, "grafik_kriteria">;
  kriteriaList: KriteriaSnapshot[];
}

export class LaporanServices {
  static statusColor(persen: number) {
    if (persen >= 70) return COLOR.green;
    if (persen >= 40) return COLOR.amber;
    return COLOR.red;
  }

  // ---------- Helper: pastikan cukup ruang, kalau tidak -> halaman baru ----------
  static ensureSpace(doc: PDFKit.PDFDocument, neededHeight: number): void {
    const bottomLimit = doc.page.height - doc.page.margins.bottom;

    if (doc.y + neededHeight > bottomLimit) {
      doc.addPage();
    }
  }
  // ---------- Header dokumen ----------

  static drawPageHeader(doc: PDFKit.PDFDocument, generatedAt: string): void {
    const logoPath = path.join(process.cwd(), "public", "assets", "fikom.png");

    const startY = PAGE_MARGIN;
    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    const boxSize = 34;
    const logoSize = 30;

    doc.image(
      logoPath,
      PAGE_MARGIN + (boxSize - logoSize) / 2,
      startY + (boxSize - logoSize) / 2,
      {
        width: logoSize,
        height: logoSize,
      },
    );

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("FAKULTAS ILMU KOMPUTER", PAGE_MARGIN + 44, startY + 2);

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("Universitas Muhammadiyah Metro", PAGE_MARGIN + 44, startY + 12);

    doc
      .fillColor(COLOR.navy)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(
        "Aplikasi Manajemen Dokumentasi Borang",
        PAGE_MARGIN + 44,
        startY + 24,
      );

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica")
      .fontSize(8)
      .text(`Dicetak pada ${generatedAt}`, PAGE_MARGIN, startY + 4, {
        width: pageWidth,
        align: "right",
      });

    const lineY = startY + 44;

    doc
      .moveTo(PAGE_MARGIN, lineY)
      .lineTo(PAGE_MARGIN + pageWidth, lineY)
      .lineWidth(1.5)
      .strokeColor(COLOR.navy)
      .stroke();

    doc.y = lineY + 16;
  }
  // ---------- Footer (nomor halaman) ----------
  static drawPageFooter(doc: PDFKit.PDFDocument, pageLabel: string): void {
    const y = doc.page.height - PAGE_MARGIN + 6;
    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    const originalBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    doc
      .moveTo(PAGE_MARGIN, y - 8)
      .lineTo(PAGE_MARGIN + pageWidth, y - 8)
      .lineWidth(0.5)
      .strokeColor(COLOR.line)
      .stroke();

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica")
      .fontSize(8)
      .text("Laporan Statistik Dokumentasi Akreditasi", PAGE_MARGIN, y, {
        lineBreak: false,
      });

    doc.text(pageLabel, PAGE_MARGIN, y, {
      width: pageWidth,
      align: "right",
      lineBreak: false,
    });

    doc.page.margins.bottom = originalBottomMargin;
  }

  // ---------- Section label (judul kecil dengan garis) ----------
  static drawSectionLabel(doc: PDFKit.PDFDocument, label: string): void {
    this.ensureSpace(doc, 30);

    const y = doc.y;
    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    doc.roundedRect(PAGE_MARGIN, y, 6, 6, 1).fill(COLOR.blue);

    doc
      .fillColor(COLOR.gray700)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(label.toUpperCase(), PAGE_MARGIN + 12, y);

    const textWidth = doc.widthOfString(label.toUpperCase());
    const lineStartX = PAGE_MARGIN + 12 + textWidth + 10;

    doc
      .moveTo(lineStartX, y + 5)
      .lineTo(PAGE_MARGIN + pageWidth, y + 5)
      .lineWidth(1)
      .strokeColor(COLOR.line)
      .stroke();

    doc.y = y + 20;
  }

  // ---------- KPI Card ----------
  static drawKpiCard(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    w: number,
    h: number,
    options: KpiCardOptions,
  ): void {
    const { label, value, footer, accent } = options;

    doc.roundedRect(x, y, w, h, 6).fillAndStroke(COLOR.gray50, COLOR.line);

    // Aksen warna kiri
    doc.rect(x, y, 3, h).fill(accent);

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text(label.toUpperCase(), x + 12, y + 10, {
        width: w - 20,
      });

    doc
      .fillColor(COLOR.navy)
      .font("Helvetica-Bold")
      .fontSize(19)
      .text(String(value), x + 12, y + 31, {
        width: w - 20,
      });

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica")
      .fontSize(7.5)
      .text(footer, x + 12, y + h - 18, {
        width: w - 20,
      });
  }

  // ---------- Progress bar tipis ----------
  static drawProgressBar(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    w: number,
    h: number,
    percent: number,
    color: string,
  ): void {
    doc.roundedRect(x, y, w, h, h / 2).fill(COLOR.gray200);

    const fillWidth = Math.max((w * percent) / 100, h);

    if (percent > 0) {
      doc.roundedRect(x, y, fillWidth, h, h / 2).fill(color);
    }
  }

  static drawSnapshotTable(
    doc: PDFKit.PDFDocument,
    kriteriaList: KriteriaSnapshot[],
  ): void {
    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    const colX = {
      no: PAGE_MARGIN,
      nama: PAGE_MARGIN + 24,
      pic: PAGE_MARGIN + 190,
      dok: PAGE_MARGIN + 355,
      selesai: PAGE_MARGIN + 395,
      belum: PAGE_MARGIN + 435,
      bar: PAGE_MARGIN + 475,
    };

    const namaWidth = colX.pic - colX.nama - 8;
    const picWidth = colX.dok - colX.pic - 8;
    const barWidth = PAGE_MARGIN + pageWidth - colX.bar;

    this.ensureSpace(doc, 30);

    const headerY = doc.y;

    doc.rect(PAGE_MARGIN, headerY, pageWidth, 20).fill(COLOR.gray50);

    doc.fillColor(COLOR.gray500).font("Helvetica-Bold").fontSize(7);

    doc.text("#", colX.no + 4, headerY + 6);
    doc.text("NAMA KRITERIA", colX.nama, headerY + 6);
    doc.text("PIC", colX.pic, headerY + 6);
    doc.text("DOK", colX.dok, headerY + 6);
    doc.text("SLS", colX.selesai, headerY + 6);
    doc.text("BLM", colX.belum, headerY + 6);
    doc.text("CAPAIAN", colX.bar, headerY + 6);

    doc.y = headerY + 20;

    kriteriaList.forEach((k) => {
      const picNames = k.dosen_pic.map((d) => d.nama).join(", ");

      doc.font("Helvetica-Bold").fontSize(8);

      const namaHeight = doc.heightOfString(k.nama_kriteria, {
        width: namaWidth,
      });

      doc.font("Helvetica").fontSize(7.5);

      const picHeight = doc.heightOfString(picNames, {
        width: picWidth,
      });

      const rowHeight = Math.max(24, namaHeight + 8, picHeight + 8);

      this.ensureSpace(doc, rowHeight + 4);

      const rowY = doc.y;
      const textY = rowY + 6;

      // Nomor
      doc
        .fillColor(COLOR.navy)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text(String(k.kode_kriteria), colX.no + 4, textY);

      // Nama
      doc.text(k.nama_kriteria, colX.nama, textY, {
        width: namaWidth,
      });

      // PIC
      doc
        .fillColor(COLOR.gray500)
        .font("Helvetica")
        .fontSize(7.5)
        .text(picNames, colX.pic, textY, {
          width: picWidth,
        });

      // Statistik
      doc.fillColor(COLOR.gray700).font("Helvetica").fontSize(8);

      doc.text(String(k.total_dokumentasi_in_kriteria), colX.dok, textY, {
        width: 30,
        align: "center",
      });

      doc.text(
        String(k.total_dokumentasi_selesai_in_kriteria),
        colX.selesai,
        textY,
        {
          width: 30,
          align: "center",
        },
      );

      doc.text(
        String(k.total_dokumentasi_belum_selesai_in_kriteria),
        colX.belum,
        textY,
        {
          width: 30,
          align: "center",
        },
      );

      // Progress bar berada di tengah tinggi row
      this.drawProgressBar(
        doc,
        colX.bar,
        rowY + rowHeight / 2 - 3,
        barWidth,
        6,
        k.persen,
        this.statusColor(k.persen),
      );

      doc.y = rowY + rowHeight;
      doc
        .moveTo(PAGE_MARGIN, doc.y)
        .lineTo(PAGE_MARGIN + pageWidth, doc.y)
        .lineWidth(0.5)
        .strokeColor(COLOR.gray100)
        .stroke();
    });
  }

  // ---------- Card detail per kriteria (halaman 2 dst) ----------
  static drawKriteriaCard(
    doc: PDFKit.PDFDocument,
    kriteria: KriteriaSnapshot,
  ): void {
    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    const rowHeight = 16;
    const tableHeaderHeight = 16;
    const cardPaddingTop = 46;

    const cardBodyHeight =
      14 + tableHeaderHeight + rowHeight * kriteria.pendekatan.length + 10;

    const cardHeight = cardPaddingTop + cardBodyHeight;

    this.ensureSpace(doc, cardHeight + 14);

    const cardX = PAGE_MARGIN;
    const cardY = doc.y;

    doc
      .roundedRect(cardX, cardY, pageWidth, cardHeight, 6)
      .lineWidth(1)
      .strokeColor(COLOR.line)
      .stroke();

    doc.roundedRect(cardX, cardY, pageWidth, 46, 6).fill(COLOR.gray50);

    doc.rect(cardX, cardY + 30, pageWidth, 16).fill(COLOR.gray50);

    doc
      .moveTo(cardX, cardY + 46)
      .lineTo(cardX + pageWidth, cardY + 46)
      .lineWidth(1)
      .strokeColor(COLOR.line)
      .stroke();

    doc.roundedRect(cardX + 12, cardY + 10, 22, 22, 5).fill(COLOR.blue);

    doc
      .fillColor(COLOR.white)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(String(kriteria.kode_kriteria), cardX + 12, cardY + 17, {
        width: 22,
        align: "center",
      });

    doc
      .fillColor(COLOR.navy)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(kriteria.nama_kriteria, cardX + 44, cardY + 10, {
        width: pageWidth - 200,
      });

    const picText = "PIC: " + kriteria.dosen_pic.map((d) => d.nama).join(" · ");

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica")
      .fontSize(7.5)
      .text(picText, cardX + 44, cardY + 25, {
        width: pageWidth - 200,
      });

    const persen = kriteria.persen;

    doc
      .fillColor(this.statusColor(persen))
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(`${persen}%`, cardX + pageWidth - 110, cardY + 8, {
        width: 98,
        align: "right",
      });

    doc
      .fillColor(COLOR.gray500)
      .font("Helvetica")
      .fontSize(7.5)
      .text(
        `${kriteria.total_dokumentasi_selesai_in_kriteria} / ${kriteria.total_dokumentasi_in_kriteria} dokumen`,
        cardX + pageWidth - 110,
        cardY + 26,
        {
          width: 98,
          align: "right",
        },
      );

    let y = cardY + 56;

    this.drawProgressBar(
      doc,
      cardX + 14,
      y,
      pageWidth - 28,
      5,
      persen,
      this.statusColor(persen),
    );

    y += 14;

    const colX = {
      nama: cardX + 14,
      approve: cardX + pageWidth - 275,
      total: cardX + pageWidth - 220,
      belum: cardX + pageWidth - 165,
      pending: cardX + pageWidth - 110,
      revisi: cardX + pageWidth - 55,
    };

    doc.fillColor(COLOR.gray500).font("Helvetica-Bold").fontSize(7);

    doc.text("PENDEKATAN", colX.nama, y);

    doc.text("APPROVE", colX.approve, y, {
      width: 50,
      align: "center",
    });

    doc.text("TOTAL", colX.total, y, {
      width: 50,
      align: "center",
    });

    doc.text("BELUM", colX.belum, y, {
      width: 50,
      align: "center",
    });

    doc.text("PENDING", colX.pending, y, {
      width: 50,
      align: "center",
    });

    doc.text("REVISI", colX.revisi, y, {
      width: 50,
      align: "center",
    });

    y += tableHeaderHeight;

    doc
      .moveTo(cardX + 14, y - 4)
      .lineTo(cardX + pageWidth - 14, y - 4)
      .lineWidth(0.5)
      .strokeColor(COLOR.line)
      .stroke();

    kriteria.pendekatan.forEach((p) => {
      const approve = p.dokumentasi_borang_approve ?? 0;
      const total = p.dokumentasi_borang_total ?? 0;
      const pending = p.dokumentasi_pending ?? 0;
      const revisi = p.dokumentasi_revisi ?? 0;

      const belumDiproses = Math.max(0, total - approve - pending - revisi);

      doc.fillColor(COLOR.navy).font("Helvetica-Bold").fontSize(8);

      doc.text(p.nama_pendekatan, colX.nama, y);

      doc.fillColor(COLOR.gray700).font("Helvetica").fontSize(8);

      // Approve
      doc.text(String(approve), colX.approve, y, {
        width: 50,
        align: "center",
      });

      // Total
      doc.text(String(total), colX.total, y, {
        width: 50,
        align: "center",
      });

      // Belum Diproses
      doc
        .fillColor(belumDiproses > 0 ? COLOR.gray700 : COLOR.gray300)
        .text(String(belumDiproses), colX.belum, y, {
          width: 50,
          align: "center",
        });

      // Pending
      doc
        .fillColor(pending > 0 ? COLOR.red : COLOR.gray300)
        .text(String(pending), colX.pending, y, {
          width: 50,
          align: "center",
        });

      // Revisi
      doc
        .fillColor(revisi > 0 ? COLOR.amber : COLOR.gray300)
        .text(String(revisi), colX.revisi, y, {
          width: 50,
          align: "center",
        });

      y += rowHeight;
    });

    doc.y = cardY + cardHeight + 12;
  }

  // ============================================================
  // MAIN: generate PDF -> return Buffer (dipakai controller)
  // ============================================================
  static generateLaporanPdf({
    generatedAt,
    summary,
    kriteriaList,
  }: GenerateLaporanPdfParams): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: PAGE_MARGIN,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      doc.on("pageAdded", () => {
        this.drawPageHeader(doc, generatedAt);
      });

      // halaman pertama tidak memicu pageAdded
      this.drawPageHeader(doc, generatedAt);

      // ---------- HALAMAN 1 : RINGKASAN ----------
      doc
        .fillColor(COLOR.navy)
        .font("Helvetica-Bold")
        .fontSize(17)
        .text("Laporan Statistik Dokumentasi Akreditasi", PAGE_MARGIN, doc.y);

      doc
        .fillColor(COLOR.gray500)
        .font("Helvetica")
        .fontSize(9)
        .text(
          "Rekapitulasi capaian dokumentasi borang berdasarkan kriteria akreditasi dan 5 pendekatan",
          PAGE_MARGIN,
          doc.y + 4,
        );

      doc.y += 22;

      this.drawSectionLabel(doc, "Ringkasan Umum");

      const pageWidth = doc.page.width - PAGE_MARGIN * 2;
      const gap = 8;
      const cardW = (pageWidth - gap * 2) / 3;
      const cardHeight = 70;
      const rowGap = 12;

      const firstRowY = doc.y;
      const secondRowY = firstRowY + cardHeight + rowGap;
      const thirdRowY = secondRowY + cardHeight + rowGap;

      // FIRST ROW
      this.drawKpiCard(doc, PAGE_MARGIN, firstRowY, cardW, cardHeight, {
        label: "Total Kriteria",
        value: String(summary.total_kriteria),
        footer: `Jumlah kriteria`,
        accent: COLOR.green,
      });

      this.drawKpiCard(
        doc,
        PAGE_MARGIN + (cardW + gap),
        firstRowY,
        cardW,
        cardHeight,
        {
          label: "Total Dosen",
          value: String(summary.total_dosen),
          footer: `Jumlah dosen`,
          accent: COLOR.amber,
        },
      );

      this.drawKpiCard(
        doc,
        PAGE_MARGIN + (cardW + gap) * 2,
        firstRowY,
        cardW,
        cardHeight,
        {
          label: "Kebutuhan Dokumentasi",
          value: String(summary.total_kebutuhan_dokumentasi),
          footer: "total kebutuhan dokumentasi",
          accent: COLOR.green,
        },
      );

      // SECOND ROW

      this.drawKpiCard(doc, PAGE_MARGIN, secondRowY, cardW, cardHeight, {
        label: "Kebutuhan Dokumentasi Selesai",
        value: String(summary.total_kebutuhan_dokumentasi_selesai),
        footer: "total kebutuhan dokumentasi selesai",
        accent: COLOR.green,
      });

      this.drawKpiCard(
        doc,
        PAGE_MARGIN + (cardW + gap),
        secondRowY,
        cardW,
        cardHeight,
        {
          label: "Kebutuhan Dokumentasi Belum Selesai",
          value: String(summary.total_kebutuhan_dokumentasi_belum_selesai),
          footer: "total kebutuhan dokumentasi belum selesai",
          accent: COLOR.red,
        },
      );

      this.drawKpiCard(
        doc,
        PAGE_MARGIN + (cardW + gap) * 2,
        secondRowY,
        cardW,
        cardHeight,
        {
          label: "Dokumentasi Borang",
          value: String(summary.total_dokumentasi),
          footer: "total dokumentasi borang",
          accent: COLOR.blue,
        },
      );

      // THIRD ROW

      this.drawKpiCard(doc, PAGE_MARGIN, thirdRowY, cardW, cardHeight, {
        label: "Dokumentasi Selesai",
        value: String(summary.total_dokumentasi_borang_selesai),
        footer: "total dokumentasi selesai",
        accent: COLOR.green,
      });

      this.drawKpiCard(
        doc,
        PAGE_MARGIN + (cardW + gap),
        thirdRowY,
        cardW,
        cardHeight,
        {
          label: "Dokumentasi Borang Belum Selesai",
          value: String(summary.total_dokumentasi_borang_belum_selesai),
          footer: "total dokumentasi borang belum selesai",
          accent: COLOR.red,
        },
      );

      this.drawKpiCard(
        doc,
        PAGE_MARGIN + (cardW + gap) * 2,
        thirdRowY,
        cardW,
        cardHeight,
        {
          label: "File Terkumpul",
          value: String(summary.total_file_selesai),
          footer: "total file selesai",
          accent: COLOR.green,
        },
      );

      doc.y = secondRowY + 190;

      this.drawSectionLabel(doc, "Snapshot per Kriteria");
      this.drawSnapshotTable(doc, kriteriaList);

      // ---------- HALAMAN 2 ----------
      doc.addPage();

      this.drawSectionLabel(doc, "Detail Capaian per Kriteria & Pendekatan");

      kriteriaList.forEach((k) => {
        this.drawKriteriaCard(doc, k);
      });

      // ---------- FOOTER ----------
      const range = doc.bufferedPageRange();

      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        const pageNumber = i - range.start + 1;

        this.drawPageFooter(doc, `Halaman ${pageNumber} dari ${range.count}`);
      }

      doc.end();
    });
  }
}

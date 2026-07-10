import { GrafikKriteriaType } from "../models/statistik.model";

export const enrichKriteria = (value: GrafikKriteriaType) => {
  const total = value?.total_dokumentasi_in_kriteria || 0;
  const selesai = value?.total_dokumentasi_selesai_in_kriteria || 0;
  const persen = total === 0 ? 0 : Math.round((selesai / total) * 100);

  let statusClass = "low";
  if (persen >= 70) statusClass = "good";
  else if (persen >= 40) statusClass = "mid";

  return { ...value, persen, statusClass };
};

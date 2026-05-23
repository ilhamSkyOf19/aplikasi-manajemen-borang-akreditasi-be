export interface ITimeline {
  id: number;
  periode: {
    id: number;
    start_date: Date;
    end_date: Date;
  };
  deadline_kebutuhan_dokumentasi: Date | null;
  deadline_dokumentasi_borang: Date | null;
  is_active_deadline_kebutuhan_dokumentasi: boolean;
  is_active_deadline_dokumentasi_borang: boolean;
  created_at: Date;
  updated_at: Date;
}

// create timeline
export interface CreateTimelineType extends Pick<
  ITimeline,
  "deadline_dokumentasi_borang" | "deadline_kebutuhan_dokumentasi"
> {
  periode_id: number;
}

// update timeline
export interface UpdateTimelineType extends Partial<
  Omit<CreateTimelineType, "periode_id">
> {}

// update is active
export interface UpdateIsActiveTimelineType extends Partial<
  Pick<
    ITimeline,
    | "is_active_deadline_dokumentasi_borang"
    | "is_active_deadline_kebutuhan_dokumentasi"
  >
> {}

// response
export interface ResponseTimelineType extends Omit<ITimeline, "periode"> {}

// to response
export const toResponseTimelineType = (
  timeline: ResponseTimelineType,
): ResponseTimelineType => timeline;

export interface ITimeline {
  id: number;
  periode: {
    id: number;
    start_date: Date;
    end_date: Date;
  };
  deadline_kebutuhan_dokumentasi: Date | null;
  deadline_dokumentasi_borang: Date | null;
  created_at: Date;
  updated_at: Date;
}

// create timeline
export interface CreateTimelineType extends Omit<
  ITimeline,
  "id" | "created_at" | "updated_at" | "periode"
> {
  periode_id: number;
}

// update timeline
export interface UpdateTimelineType extends Partial<
  Omit<CreateTimelineType, "periode_id">
> {}

// response
export interface ResponseTimelineType extends Omit<ITimeline, "periode"> {}

// to response
export const toResponseTimelineType = (
  timeline: ResponseTimelineType,
): ResponseTimelineType => timeline;

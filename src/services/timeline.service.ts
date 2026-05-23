import prisma from "../libs/prisma";
import {
  CreateTimelineType,
  ResponseTimelineType,
  toResponseTimelineType,
  UpdateIsActiveTimelineType,
  UpdateTimelineType,
} from "../models/timeline.model";

export class TimelineService {
  // create timeline
  static async create(
    data: CreateTimelineType,
  ): Promise<ResponseTimelineType | null> {
    const {
      deadline_dokumentasi_borang,
      deadline_kebutuhan_dokumentasi,
      periode_id,
    } = data;
    // call db
    const result = await prisma.timeline.create({
      data: {
        deadline_dokumentasi_borang,
        deadline_kebutuhan_dokumentasi,
        periode_id,
      },
      select: {
        id: true,
        deadline_dokumentasi_borang: true,
        deadline_kebutuhan_dokumentasi: true,
        is_active_deadline_dokumentasi_borang: true,
        is_active_deadline_kebutuhan_dokumentasi: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseTimelineType(result);
  }

  // update timeline
  static async update(params: {
    id: number;
    data: UpdateTimelineType;
  }): Promise<ResponseTimelineType | null> {
    const {
      data: { deadline_dokumentasi_borang, deadline_kebutuhan_dokumentasi },
      id,
    } = params;
    // call db
    const result = await prisma.timeline.update({
      where: {
        id,
      },
      data: {
        deadline_dokumentasi_borang,
        deadline_kebutuhan_dokumentasi,
      },
      select: {
        id: true,
        deadline_dokumentasi_borang: true,
        deadline_kebutuhan_dokumentasi: true,
        is_active_deadline_dokumentasi_borang: true,
        is_active_deadline_kebutuhan_dokumentasi: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseTimelineType(result);
  }

  //   find by periode
  static async findByPeriode(
    periode_id: number,
  ): Promise<ResponseTimelineType | null> {
    // call db
    const result = await prisma.timeline.findFirst({
      where: {
        periode_id,
      },
      select: {
        id: true,
        deadline_dokumentasi_borang: true,
        deadline_kebutuhan_dokumentasi: true,
        created_at: true,
        updated_at: true,
        is_active_deadline_dokumentasi_borang: true,
        is_active_deadline_kebutuhan_dokumentasi: true,
      },
    });

    // return null
    if (!result) return null;

    return toResponseTimelineType(result);
  }

  // update is active
  static async updateIsActive(params: {
    id: number;
    data: UpdateIsActiveTimelineType;
  }): Promise<ResponseTimelineType | null> {
    // get data
    const {
      id,
      data: {
        is_active_deadline_dokumentasi_borang,
        is_active_deadline_kebutuhan_dokumentasi,
      },
    } = params;

    // cal db
    const result = await prisma.timeline.update({
      where: {
        id,
      },
      data: {
        is_active_deadline_dokumentasi_borang,
        is_active_deadline_kebutuhan_dokumentasi,
      },
      select: {
        id: true,
        deadline_dokumentasi_borang: true,
        deadline_kebutuhan_dokumentasi: true,
        is_active_deadline_dokumentasi_borang: true,
        is_active_deadline_kebutuhan_dokumentasi: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseTimelineType(result);
  }
}

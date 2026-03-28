import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import * as schema from '../database/schema';
import { sql, eq, and, gte, lte, desc } from 'drizzle-orm';
import * as rep from './dashboard-reports.helpers';

@Injectable()
export class DashboardService {
  constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total Employees
    const totalEmployees = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.employee);

    // 2. Working Today (Check-ins)
    const workingToday = await this.db
      .select({ count: sql<number>`count(distinct employee_id)` })
      .from(schema.checkinLogs)
      .where(
        and(
          gte(schema.checkinLogs.checkinTime, today),
          lte(schema.checkinLogs.checkinTime, tomorrow),
        ),
      );

    // 3. Pending Requests
    const pendingRequests = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.leaveRequests)
      .where(eq(schema.leaveRequests.status, 'Pending'));

    // 4. On Leave/Absent Today (Simulated for now based on approved leave requests covering today)
    const onLeaveToday = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.leaveRequests)
      .where(
        and(
          eq(schema.leaveRequests.status, 'Approved'),
          lte(schema.leaveRequests.startDate, today),
          gte(schema.leaveRequests.endDate, today),
        ),
      );

    // 5. Recent Announcements
    const recentAnnouncements = await this.db
      .select()
      .from(schema.announcements)
      .orderBy(desc(schema.announcements.createdAt))
      .limit(5);

    // 6. Recent Requests (for the list)
    const recentRequests = await this.db
      .select({
        id: schema.leaveRequests.id,
        employeeId: schema.leaveRequests.employeeId,
        type: schema.leaveRequests.type,
        status: schema.leaveRequests.status,
        startDate: schema.leaveRequests.startDate,
        endDate: schema.leaveRequests.endDate,
        reason: schema.leaveRequests.reason,
        employeeName: sql<string>`concat(${schema.employee.firstName}, ' ', ${schema.employee.lastName})`,
      })
      .from(schema.leaveRequests)
      .leftJoin(
        schema.employee,
        eq(schema.leaveRequests.employeeId, schema.employee.id),
      )
      .orderBy(desc(schema.leaveRequests.createdAt))
      .limit(10);

    // 7. Upcoming Leaves (Approved leaves starting from tomorrow)
    const upcomingLeaves = await this.db
      .select({
        id: schema.leaveRequests.id,
        employeeName: sql<string>`concat(${schema.employee.firstName}, ' ', ${schema.employee.lastName})`,
        type: schema.leaveRequests.type,
        startDate: schema.leaveRequests.startDate,
        endDate: schema.leaveRequests.endDate,
      })
      .from(schema.leaveRequests)
      .leftJoin(
        schema.employee,
        eq(schema.leaveRequests.employeeId, schema.employee.id),
      )
      .where(
        and(
          eq(schema.leaveRequests.status, 'Approved'),
          gte(schema.leaveRequests.startDate, tomorrow),
        ),
      )
      .orderBy(schema.leaveRequests.startDate)
      .limit(10);

    return {
      stats: {
        totalEmployees: Number(totalEmployees[0].count),
        workingToday: Number(workingToday[0].count),
        pendingRequests: Number(pendingRequests[0].count),
        onLeaveToday: Number(onLeaveToday[0].count),
      },
      recentAnnouncements,
      recentRequests,
      upcomingLeaves,
    };
  }

  async getReports(rangeRaw: string) {
    const range = rep.normalizeReportsRange(rangeRaw);
    const { from, to, prevFrom, prevTo } = rep.getRangeBounds(range);

    const wideFrom =
      prevFrom.getTime() < from.getTime() ? prevFrom : from;

    const [
      empRows,
      logRows,
      pendingRow,
      approvedLeaves,
      jobRows,
    ] = await Promise.all([
      this.db
        .select({
          id: schema.employee.id,
          createdAt: schema.employee.createdAt,
          department: schema.jobInfo.department,
          workLocation: schema.jobInfo.workLocation,
        })
        .from(schema.employee)
        .leftJoin(
          schema.jobInfo,
          eq(schema.jobInfo.employeeId, schema.employee.id),
        ),
      this.db
        .select({
          employeeId: schema.checkinLogs.employeeId,
          checkinTime: schema.checkinLogs.checkinTime,
        })
        .from(schema.checkinLogs)
        .where(
          and(
            gte(schema.checkinLogs.checkinTime, wideFrom),
            lte(schema.checkinLogs.checkinTime, to),
          ),
        ),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(schema.leaveRequests)
        .where(eq(schema.leaveRequests.status, 'Pending')),
      this.db
        .select({
          type: schema.leaveRequests.type,
          days: schema.leaveRequests.days,
          startDate: schema.leaveRequests.startDate,
          endDate: schema.leaveRequests.endDate,
        })
        .from(schema.leaveRequests)
        .where(eq(schema.leaveRequests.status, 'Approved')),
      this.db
        .select({
          employeeId: schema.jobInfo.employeeId,
          startDate: schema.jobInfo.startDate,
          endDate: schema.jobInfo.endDate,
        })
        .from(schema.jobInfo),
    ]);

    const empById = new Map<
      number,
      {
        id: number;
        createdAt: Date | null;
        department: string | null;
        workLocation: string | null;
      }
    >();
    for (const r of empRows) {
      if (!empById.has(r.id)) empById.set(r.id, r);
    }
    const employees = [...empById.values()];
    const totalEmployees = employees.length;

    const logsCurrent = rep.filterLogsByRange(logRows, from, to);
    const logsPrev = rep.filterLogsByRange(logRows, prevFrom, prevTo);

    const checkInTrend = rep.buildCheckInTrend(
      range,
      logRows,
      totalEmployees,
      from,
      to,
    );
    const prevTrend = rep.buildCheckInTrend(
      range,
      logRows,
      totalEmployees,
      prevFrom,
      prevTo,
    );

    const avgAttendance = (t: typeof checkInTrend) =>
      t.length && totalEmployees > 0
        ? Math.round(
            t.reduce(
              (s, row) => s + (row.checkedIn / totalEmployees) * 100,
              0,
            ) / t.length,
          )
        : 0;

    const curAtt = avgAttendance(checkInTrend);
    const prevAtt = avgAttendance(prevTrend);
    const attDelta = curAtt - prevAtt;
    const attDeltaStr =
      attDelta === 0
        ? '0%'
        : `${attDelta > 0 ? '+' : ''}${attDelta}%`;

    const checkInByHour = rep.buildCheckInByHour(logsCurrent);
    let peakLabel = '—';
    if (checkInByHour.length) {
      const max = checkInByHour.reduce(
        (a, b) => (b.count > a.count ? b : a),
        checkInByHour[0]!,
      );
      if (max.count > 0) peakLabel = max.hour;
    }

    const workLocByEmp = new Map<number, string>();
    for (const e of employees) {
      workLocByEmp.set(
        e.id,
        (e.workLocation ?? 'Office').toString(),
      );
    }
    const locAgg = { Office: 0, Remote: 0, Hybrid: 0 };
    for (const l of logsCurrent) {
      const w = workLocByEmp.get(l.employeeId) ?? 'Office';
      if (w === 'Remote') locAgg.Remote += 1;
      else if (w === 'Hybrid') locAgg.Hybrid += 1;
      else locAgg.Office += 1;
    }
    const locationSplit = [
      {
        name: 'In Office',
        value: locAgg.Office,
        fill: '#6366f1',
      },
      { name: 'Remote', value: locAgg.Remote, fill: '#14b8a6' },
      {
        name: 'Out / Field',
        value: locAgg.Hybrid,
        fill: '#f59e0b',
      },
    ];
    const locTotal = locationSplit.reduce((s, x) => s + x.value, 0);
    const locationSplitOut =
      locTotal === 0
        ? [{ name: 'No check-ins', value: 1, fill: '#e2e8f0' }]
        : locationSplit;

    const deptCounts = new Map<string, number>();
    for (const e of employees) {
      const d = (e.department ?? 'Unassigned').trim() || 'Unassigned';
      deptCounts.set(d, (deptCounts.get(d) ?? 0) + 1);
    }
    const headcountByTeam = [...deptCounts.entries()]
      .map(([team, count], i) => ({
        team,
        count,
        fill: rep.CHART_COLORS[i % rep.CHART_COLORS.length]!,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const now = new Date();
    const headcountGrowth: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endM = rep.endOfDay(
        new Date(ref.getFullYear(), ref.getMonth() + 1, 0),
      );
      const cnt = employees.filter(
        (e) => e.createdAt && new Date(e.createdAt) <= endM,
      ).length;
      headcountGrowth.push({
        month: ref.toLocaleString('en-US', { month: 'short' }),
        count: cnt,
      });
    }

    const turnoverData: { month: string; joined: number; left: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = rep.startOfDay(ref);
      const mEnd = rep.endOfDay(
        new Date(ref.getFullYear(), ref.getMonth() + 1, 0),
      );
      const joined = employees.filter((e) => {
        if (!e.createdAt) return false;
        const c = new Date(e.createdAt);
        return c >= mStart && c <= mEnd;
      }).length;
      const left = jobRows.filter((j) => {
        if (!j.endDate) return false;
        const x = new Date(j.endDate);
        return x >= mStart && x <= mEnd;
      }).length;
      turnoverData.push({
        month: ref.toLocaleString('en-US', { month: 'short' }),
        joined,
        left,
      });
    }

    const leavesInRange = approvedLeaves.filter((lr) => {
      const s = new Date(lr.startDate);
      const e = new Date(lr.endDate);
      return s <= to && e >= from;
    });

    const byType = new Map<string, number>();
    for (const lr of leavesInRange) {
      const d = Number(lr.days);
      const n = Number.isFinite(d) ? d : 0;
      const key = rep.leaveTypeShort(lr.type);
      byType.set(key, (byType.get(key) ?? 0) + n);
    }
    const timeOffByType = [...byType.entries()]
      .map(([name, days], i) => ({
        name,
        days: Math.round(days * 10) / 10,
        fill: rep.CHART_COLORS[i % rep.CHART_COLORS.length]!,
      }))
      .sort((a, b) => b.days - a.days);

    const timeOffTrend: { month: string; days: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = rep.startOfDay(ref);
      const mEnd = rep.endOfDay(
        new Date(ref.getFullYear(), ref.getMonth() + 1, 0),
      );
      let sum = 0;
      for (const lr of approvedLeaves) {
        const s = new Date(lr.startDate);
        const e = new Date(lr.endDate);
        if (s <= mEnd && e >= mStart) {
          const d = Number(lr.days);
          sum += Number.isFinite(d) ? d : 0;
        }
      }
      timeOffTrend.push({
        month: ref.toLocaleString('en-US', { month: 'short' }),
        days: Math.round(sum * 10) / 10,
      });
    }

    const minuteVals = logsCurrent
      .filter((l) => l.checkinTime)
      .map((l) => {
        const d = new Date(l.checkinTime!);
        return d.getHours() * 60 + d.getMinutes();
      });
    let avgCheckInLabel = '—';
    if (minuteVals.length) {
      const avg =
        minuteVals.reduce((a, b) => a + b, 0) / minuteVals.length;
      const h24 = Math.floor(avg / 60);
      const m = Math.round(avg % 60);
      const ampm = h24 >= 12 ? 'PM' : 'AM';
      const h12 = h24 % 12 || 12;
      avgCheckInLabel = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    }

    const prevMinutes = logsPrev
      .filter((l) => l.checkinTime)
      .map((l) => {
        const d = new Date(l.checkinTime!);
        return d.getHours() * 60 + d.getMinutes();
      });
    let checkInDeltaStr = '—';
    let checkInDeltaType: 'up' | 'down' = 'up';
    if (minuteVals.length && prevMinutes.length) {
      const cur =
        minuteVals.reduce((a, b) => a + b, 0) / minuteVals.length;
      const prev =
        prevMinutes.reduce((a, b) => a + b, 0) / prevMinutes.length;
      const diffMin = Math.round(cur - prev);
      checkInDeltaStr = `${diffMin >= 0 ? '+' : ''}${diffMin}m`;
      checkInDeltaType = diffMin <= 0 ? 'up' : 'down';
    }

    const pending = Number(pendingRow[0]?.count ?? 0);

    const newHiresInPeriod = employees.filter((e) => {
      if (!e.createdAt) return false;
      const c = new Date(e.createdAt);
      return c >= from && c <= to;
    }).length;

    const kpis = [
      {
        label: 'Total Employees',
        value: String(totalEmployees),
        delta: newHiresInPeriod === 0 ? '0' : `+${newHiresInPeriod}`,
        deltaType:
          newHiresInPeriod === 0 ? ('neutral' as const) : ('up' as const),
        sub: 'new hires in period',
      },
      {
        label: 'Avg Attendance',
        value: `${curAtt}%`,
        delta: attDeltaStr,
        deltaType: attDelta >= 0 ? ('up' as const) : ('down' as const),
        sub: 'avg daily check-in rate',
      },
      {
        label: 'Open Requests',
        value: String(pending),
        delta: '—',
        deltaType: 'neutral' as const,
        sub: 'pending approval',
      },
      {
        label: 'Avg Check-in Time',
        value: avgCheckInLabel,
        delta: checkInDeltaStr,
        deltaType:
          checkInDeltaStr === '—' ? ('neutral' as const) : checkInDeltaType,
        sub: 'vs prior period',
      },
    ];

    return {
      range: { key: range, from: from.toISOString(), to: to.toISOString() },
      kpis,
      checkInTrend,
      checkInByHour,
      peakCheckinHourLabel: peakLabel,
      locationSplit: locationSplitOut,
      headcountByTeam,
      headcountGrowth,
      turnoverData,
      timeOffByType:
        timeOffByType.length > 0
          ? timeOffByType
          : [
              {
                name: 'No data',
                days: 0,
                fill: '#e2e8f0',
              },
            ],
      timeOffTrend,
    };
  }
}

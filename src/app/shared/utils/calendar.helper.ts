export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export class CalendarHelper {
  static generateCalendarDays(year: number, month: number): CalendarWeek[] {
    const weeks: CalendarWeek[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentWeek: CalendarDay[] = [];

    // Add empty days for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, -(startingDayOfWeek - i - 1));
      currentWeek.push(this.createCalendarDay(prevMonthDate, false, today));
    }

    // Add days of current month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      currentWeek.push(this.createCalendarDay(date, true, today));

      // If week is complete (Sunday), start new week
      if (currentWeek.length === 7) {
        weeks.push({ days: currentWeek });
        currentWeek = [];
      }
    }

    // Add empty days for next month to complete last week
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDate = new Date(year, month + 1, i);
        currentWeek.push(this.createCalendarDay(nextMonthDate, false, today));
      }
      weeks.push({ days: currentWeek });
    }

    return weeks;
  }

  private static createCalendarDay(date: Date, isCurrentMonth: boolean, today: Date): CalendarDay {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    return {
      date: dateOnly,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: dateOnly.getTime() === today.getTime(),
      isPast: dateOnly < today,
      isFuture: dateOnly > today
    };
  }

  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
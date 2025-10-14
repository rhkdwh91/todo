import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export function formatDateTime(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

export function getCurrentISODate(): string {
  return dayjs().toISOString();
}

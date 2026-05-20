import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('ko');
dayjs.extend(relativeTime);

export function formatDate(iso: string): string {
  return dayjs(iso).format('YYYY년 MM월 DD일');
}

export function formatDateShort(iso: string): string {
  return dayjs(iso).format('YY.MM.DD');
}

export function formatRelative(iso: string): string {
  return dayjs(iso).fromNow();
}

export function nowISO(): string {
  return dayjs().toISOString();
}

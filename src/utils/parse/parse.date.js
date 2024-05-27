import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

export function parseDate(date, withInstance = false) {
	if (date && dayjs(date).isValid()) {
		if (withInstance) return dayjs(date);
		return dayjs(date).format('YYYY-MM-DD');
	}
	return null;
}

export const getDate = dayjs;

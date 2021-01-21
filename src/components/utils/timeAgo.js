import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

const timeObj = new TimeAgo('en-UK');

export default (isoDateTime) => timeObj.format(Date.parse(isoDateTime));

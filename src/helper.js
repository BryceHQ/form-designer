import lang from './lang.js';

const helper = {
  timeToFriendlyText(time) {
    var ms = Math.abs(new Date(time) - new Date()),
      s = ms / 1000,
      m = s / 60,
      h = m / 60,
      d = h / 24;
    var langTime = lang.time;
    if (s < 60) return langTime.justnow;
    if (m < 60) return langTime.minutesago(m || 0);
    if (h < 24) return langTime.hoursago(h || 0);
    if (d < 2) return langTime.yesterday;
    if (d <= 30) return langTime.daysago(d || 0);

    return langTime.longago;
  }
};

export default helper;

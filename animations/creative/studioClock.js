let timerId = null;

function getFormattedIST() {
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const timeStr = new Intl.DateTimeFormat("en-US", options).format(new Date());
  return `Hyderabad, IN • ${timeStr} IST`;
}

export function init() {
  if (typeof document === "undefined") return;

  cleanup();

  const updateClockElements = () => {
    const clockElements = document.querySelectorAll("[data-studio-clock='true']");
    const formatted = getFormattedIST();
    clockElements.forEach((el) => {
      el.textContent = formatted;
    });
  };

  updateClockElements();
  timerId = setInterval(updateClockElements, 10000);
}

export function cleanup() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

export default { init, cleanup };

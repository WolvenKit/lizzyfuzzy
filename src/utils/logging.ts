const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

export function log(message: any) {
  console.log(`[${time}] `, message);
}
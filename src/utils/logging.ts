export function log(message: any, ...args: any[]) {
  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] \x1b[32m[INFO]\x1b[0m`, message, ...args);
}

export function debug(message: any, ...args: any[]) {
  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.log(`[${time}] \x1b[35m[DEBUG]\x1b[0m`, message, ...args);
}


export function errorLog(message: any, ...args: any[]) {
  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeStyle: "medium",
  });

  console.error(`[${time}] \x1b[31m[ERORR]\x1b[0m`, message, ...args);
}

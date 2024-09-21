function envCheck(env: string) {
  if (
    process.env[env] !== undefined &&
    process.env[env] !== null &&
    Object.keys(process.env["CLIENT_TOKEN"] as string).length !== 0
  ) {
    return true;
  } else {
    return false;
  }
}

export function checkENVS(extras: string[] = []) {
  const envs = [
    "GUILD",
    "CLIENT_TOKEN",
    "NODE_ENV",
    "API_RATE_WINDOW",
    "API_MAX_REQUESTS",
    "BOT_TOKEN",
    "API_ENDPOINT",
    "API_ENDPOINT_NEXT",
    "IMAGE",
    "MESSAGE",
    ...extras,
  ];

  envs.forEach((element) => {
    if (envCheck(element) === false) {
      throw new Error(`Environment Variable: ${element} is not set.`);
    }
  });

  return true;
}

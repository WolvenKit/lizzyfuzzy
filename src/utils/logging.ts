export function log(message: any, ...args: any[]) {
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: true,
        timeStyle: 'medium',
    })

    console.log(`[${time}]  \x1b[32m[INFO]\x1b[0m`, message, ...args)
}

export function errorLog(message: any, ...args: any[]) {
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: true,
        timeStyle: 'medium',
    })

    console.error(`[${time}] \x1b[31m[ERROR]\x1b[0m`, message, ...args)
}

export function warnLog(message: any, ...args: any[]) {
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: true,
        timeStyle: 'medium',
    })

    console.error(`[${time}]  \x1b[33m[WARN]\x1b[0m`, message, ...args)
}

import { COLOR_TYPES, COLORS, LogLevel } from '@types'

let lLevel: LogLevel = LogLevel.ALL

const getDate = (): [Date, string] => {
    const date = new Date()

    return [date, date.toLocaleString('ru-RU')]
}

export class Logger {
    public static info(...data: any[]): void {
        if (lLevel > LogLevel.INFO) return

        const [, date] = getDate()

        console.log(
            `${COLORS.CYAN + COLOR_TYPES.BOLD}[INFO]${COLORS.NONE + COLOR_TYPES.NONE} ${
                COLORS.YELLOW + COLOR_TYPES.NONE
            }(${date})${COLORS.NONE + COLOR_TYPES.NONE}:`,
            ...data
        )
    }

    public static debug(...data: any[]): void {
        if (lLevel > LogLevel.DEBUG) return

        const [, date] = getDate()

        console.log(
            `${COLORS.PINK + COLOR_TYPES.BOLD}[DEBUG]${COLORS.NONE + COLOR_TYPES.NONE} ${
                COLORS.YELLOW + COLOR_TYPES.NONE
            }(${date})${COLORS.NONE + COLOR_TYPES.NONE}:`,
            ...data
        )
    }

    public static warn(...data: any[]): void {
        if (lLevel > LogLevel.WARN) return

        const [, date] = getDate()

        console.log(
            `${COLORS.YELLOW + COLOR_TYPES.BOLD}[WARN] ${COLORS.NONE + COLOR_TYPES.NONE} ${
                COLORS.YELLOW + COLOR_TYPES.NONE
            }(${date})${COLORS.NONE + COLOR_TYPES.NONE}:`,
            ...data
        )
    }

    public static error(...data: any[]): void {
        if (lLevel > LogLevel.ERROR) return

        const [, date] = getDate()

        console.log(
            `${COLORS.RED + COLOR_TYPES.BOLD}[ERROR]${COLORS.NONE + COLOR_TYPES.NONE} ${
                COLORS.YELLOW + COLOR_TYPES.NONE
            }(${date})${COLORS.NONE + COLOR_TYPES.NONE}:`,
            ...data
        )
    }

    public static setLevel(level: LogLevel): void {
        lLevel = level
    }
}

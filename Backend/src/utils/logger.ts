/* 
  Simple centralized logger
  Replace console usage across the app with this
*/

type LogMeta = Record<string, unknown>;

const formatMeta = (meta?: LogMeta) => {
  if (!meta || Object.keys(meta).length === 0) return "";
  return ` | meta=${JSON.stringify(meta)}`;
};

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(
      `[INFO] ${new Date().toISOString()} - ${message}${formatMeta(meta)}`
    );
  },

  warn(message: string, meta?: LogMeta) {
    console.warn(
      `[WARN] ${new Date().toISOString()} - ${message}${formatMeta(meta)}`
    );
  },

  error(message: string, meta?: LogMeta) {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}${formatMeta(meta)}`
    );
  },

  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}${formatMeta(meta)}`
      );
    }
  }
};

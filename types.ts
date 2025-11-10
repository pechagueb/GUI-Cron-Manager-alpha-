
export interface CronTask {
  id: string;
  name: string;
  command: string;
  schedule: string; // standard cron format: min hour day(month) month day(week)
  isEnabled: boolean;
}

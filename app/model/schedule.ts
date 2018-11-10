export class Schedule {
  /**
   * 予定開始日
   */
  expectedStartDay: string;
  /**
   * 予定終了日
   */
  expectedEndDay: string;
  /**
   * 予定工数(秒)
   */
  expectedCost: number;
  /**
   * 実績開始日
   */
  actualStartDay: string;
  /**
   * 実績終了日
   */
  actualEndDay: string;
  /**
   * 実績工数(秒)
   */
  actualCost: number;
  /**
   * 進捗率
   */
  progress: number;
}

/**
 * Supported report formats
 */
export enum ReportFormat {
  PDF = "pdf",
  EXCEL = "excel",
  CSV = "csv",
}

/**
 * Report format configuration
 */
export interface ReportFormatConfig {
  format: ReportFormat;
  options?: Record<string, any>;
}

/**
 * Base report data structure
 */
export interface BaseReportData {
  title: string;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Base interface for all report generators
 * This allows for extensibility to support multiple formats (PDF, Excel, CSV, etc.)
 */
export interface IReportGenerator<TData, TOptions = any> {
  /**
   * Generate a report from the provided data
   * @param data The data to generate the report from
   * @param options Optional configuration options
   * @returns Buffer containing the generated report
   */
  generate(data: TData, options?: TOptions): Promise<Buffer>;

  /**
   * Get the filename for the generated report
   * @param data The data used to generate the report
   * @returns The filename string
   */
  getFilename(data: TData): string;

  /**
   * Get the MIME type for the generated report
   * @returns The MIME type string (e.g., 'application/pdf', 'application/vnd.ms-excel')
   */
  getMimeType(): string;
}

/**
 * Base interface for format-specific services
 */
export interface IFormatService {
  /**
   * Generate a report in this format
   * @param type The type of report to generate
   * @param data The data for the report
   * @param options Optional configuration
   * @returns Buffer containing the generated report
   */
  generate(type: string, data: any, options?: any): Promise<Buffer>;
}

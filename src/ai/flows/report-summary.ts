import { ai } from '../genkit';
import { z } from 'zod';

const ReportSummaryOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the medical report."),
  keyInsights: z.array(z.string()).describe("A list of 3-4 key insights from the report as bullet points."),
});

const summaryPrompt = ai.definePrompt({
    name: 'summarizeReportPrompt',
    input: { schema: z.string() },
    output: { schema: ReportSummaryOutputSchema },
    prompt: `You are a medical assistant in a futuristic, sci-fi world.
    Summarize the following medical report. Be concise. Identify key insights from the report.
    The output must be a valid JSON object with two keys: "summary" and "keyInsights".
    "summary" should be a short paragraph. "keyInsights" should be an array of 3-4 bullet points.

    Report:
    {{{input}}}
    `,
});

export const summarizeReportFlow = ai.defineFlow(
  {
    name: 'summarizeReportFlow',
    inputSchema: z.string(),
    outputSchema: ReportSummaryOutputSchema,
  },
  async (reportText) => {
    const { output } = await summaryPrompt(reportText);
    return output ?? { summary: 'Could not generate summary.', keyInsights: [] };
  }
);

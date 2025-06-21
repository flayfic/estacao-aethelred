"use server";

import { run } from '@genkit-ai/next';
import { summarizeReportFlow } from '@/ai/flows';

export async function getReportSummary(reportText: string) {
  try {
    return await run(summarizeReportFlow, reportText);
  } catch (error) {
    console.error("Error running Genkit flow:", error);
    return null;
  }
}

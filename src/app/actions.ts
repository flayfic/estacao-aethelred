"use server";

import { summarizeReportFlow } from '@/ai/flows';

export async function getReportSummary(reportText: string) {
  try {
    return await summarizeReportFlow(reportText);
  } catch (error) {
    console.error("Error running Genkit flow:", error);
    return null;
  }
}

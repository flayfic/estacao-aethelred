"use client";

import { useState } from 'react';
import { mockReports } from "@/lib/mock-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report, AISummary } from '@/lib/types';
import { getReportSummary } from '@/app/actions';
import { Button } from './ui/button';
import { Bot, Loader2, HeartPulse, BrainCircuit, Signal, Waves, Info } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import DashboardMetrics from './dashboard-metrics';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const severityVariantMap: Record<Report['severity'], 'destructive' | 'secondary' | 'default'> = {
    'Critical': 'destructive',
    'High': 'destructive',
    'Medium': 'secondary',
    'Low': 'default',
};

const severityOutlineMap: Record<Report['severity'], boolean> = {
    'Critical': false,
    'High': true,
    'Medium': false,
    'Low': false,
}

const VitalSignIcon = ({ vitalName }: { vitalName: string }) => {
    if (vitalName.includes('Heart Rate')) return <HeartPulse className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Neuro-Synaptic')) return <BrainCircuit className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Bio-Field')) return <Signal className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Aetheric')) return <Waves className="h-5 w-5 text-primary" />;
    return <Info className="h-5 w-5 text-primary" />;
};

const ReportDetails = ({ report }: { report: Report }) => (
    <div className="space-y-4">
        <div>
            <h4 className="font-semibold text-foreground">Diagnosis</h4>
            <p className="text-muted-foreground">{report.diagnosis}</p>
        </div>
        <div>
            <h4 className="font-semibold text-foreground">Vital Signs</h4>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(report.vitals).map(([key, value]) => (
                    <Card key={key} className="p-3">
                        <div className="flex items-center gap-3">
                            <VitalSignIcon vitalName={key} />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{key}</p>
                                <p className="text-base font-semibold text-foreground">{value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-foreground">Treatment Notes</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{report.treatmentNotes}</p>
        </div>
    </div>
);

const AiSummaryDisplay = ({ summary, isLoading }: { summary: AISummary | null, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-6 w-1/3 mt-4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            </div>
        );
    }

    if (!summary) return null;

    return (
         <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>AI-Generated Summary</AlertTitle>
            <AlertDescription className="space-y-4">
                <p>{summary.summary}</p>
                 <div>
                    <h5 className="font-semibold">Key Insights:</h5>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                        {summary.keyInsights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                        ))}
                    </ul>
                </div>
            </AlertDescription>
        </Alert>
    );
};


export default function ReportViewer() {
    const { toast } = useToast();
    const [summaries, setSummaries] = useState<Record<string, AISummary | null>>({});
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const handleSummarize = async (report: Report) => {
        if (summaries[report.id] || loadingStates[report.id]) return;

        setLoadingStates(prev => ({ ...prev, [report.id]: true }));
        try {
            const result = await getReportSummary(report.fullReportText);
            if(result) {
                 setSummaries(prev => ({ ...prev, [report.id]: result }));
            } else {
                throw new Error("AI summary generation failed.");
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not generate AI summary. Please try again later.",
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [report.id]: false }));
        }
    };

    return (
        <div className="space-y-6">
            <DashboardMetrics reports={mockReports} />
            <Card>
                <CardHeader>
                    <CardTitle>Patient Reports</CardTitle>
                    <CardDescription>Select a report to view details and generate an AI summary.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {mockReports.map(report => (
                            <AccordionItem key={report.id} value={report.id}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold">{report.patientName}</p>
                                            <p className="text-sm text-muted-foreground">ID: {report.patientId} &bull; {report.date}</p>
                                        </div>
                                        <Badge variant={severityVariantMap[report.severity]} className={severityOutlineMap[report.severity] ? 'border-destructive text-destructive' : ''}>
                                            {report.severity}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-background/50 rounded-b-md">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <ReportDetails report={report} />
                                        <div className="space-y-4">
                                            <Button 
                                                onClick={() => handleSummarize(report)}
                                                disabled={loadingStates[report.id]}
                                                className="w-full"
                                            >
                                                {loadingStates[report.id] ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Bot className="mr-2 h-4 w-4" />
                                                )}
                                                {summaries[report.id] ? 'Summary Generated' : 'Summarize with AI'}
                                            </Button>
                                            <AiSummaryDisplay summary={summaries[report.id] ?? null} isLoading={loadingStates[report.id] ?? false} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}

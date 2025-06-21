"use client";

import { mockReports } from "@/lib/mock-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report } from '@/lib/types';
import { HeartPulse, Activity, Thermometer, AirVent, Info } from 'lucide-react';
import DashboardMetrics from './dashboard-metrics';

const severityVariantMap: Record<Report['severity'], 'destructive' | 'secondary' | 'default'> = {
    'Crítica': 'destructive',
    'Alta': 'destructive',
    'Média': 'secondary',
    'Baixa': 'default',
};

const severityOutlineMap: Record<Report['severity'], boolean> = {
    'Crítica': false,
    'Alta': true,
    'Média': false,
    'Baixa': false,
}

const VitalSignIcon = ({ vitalName }: { vitalName: string }) => {
    if (vitalName.includes('Frequência Cardíaca')) return <HeartPulse className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Pressão Arterial')) return <Activity className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Temperatura Corporal')) return <Thermometer className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Saturação de Oxigênio')) return <AirVent className="h-5 w-5 text-primary" />;
    return <Info className="h-5 w-5 text-primary" />;
};

const ReportDetails = ({ report }: { report: Report }) => (
    <div className="space-y-4">
        <div>
            <h4 className="font-semibold text-foreground">Diagnóstico</h4>
            <p className="text-muted-foreground">{report.diagnosis}</p>
        </div>
        <div>
            <h4 className="font-semibold text-foreground">Sinais Vitais</h4>
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
            <h4 className="font-semibold text-foreground">Notas de Tratamento</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{report.treatmentNotes}</p>
        </div>
    </div>
);


export default function ReportViewer() {
    return (
        <div className="space-y-6">
            <DashboardMetrics reports={mockReports} />
            <Card>
                <CardHeader>
                    <CardTitle>Relatórios dos Pacientes</CardTitle>
                    <CardDescription>Selecione um relatório para ver os detalhes.</CardDescription>
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
                                    <ReportDetails report={report} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { mockReports } from "@/lib/mock-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report } from '@/lib/types';
import { HeartPulse, Activity, Thermometer, AirVent, Info, FileText } from 'lucide-react';
import DashboardMetrics from './dashboard-metrics';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const severityVariantMap: Record<Report['severity'], 'destructive' | 'secondary' | 'default' | 'outline'> = {
    'Crítica': 'destructive',
    'Alta': 'outline',
    'Média': 'secondary',
    'Baixa': 'default',
};

const VitalSignIcon = ({ vitalName }: { vitalName: string }) => {
    if (vitalName.includes('Frequência Cardíaca')) return <HeartPulse className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Pressão Arterial')) return <Activity className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Temperatura Corporal')) return <Thermometer className="h-5 w-5 text-primary" />;
    if (vitalName.includes('Saturação de Oxigênio')) return <AirVent className="h-5 w-5 text-primary" />;
    return <Info className="h-5 w-5 text-primary" />;
};

const ReportDetails = ({ report }: { report: Report }) => (
    <div className="space-y-6">
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
        <div className="flex justify-end pt-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Relatório Completo
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Relatório Completo</DialogTitle>
                        <DialogDescription>
                            Paciente: {report.patientName} (ID: {report.patientId})
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 pr-6">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {report.fullReportText}
                        </p>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
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
                                        <Badge variant={severityVariantMap[report.severity]} className={report.severity === 'Alta' ? 'border-destructive text-destructive' : ''}>
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

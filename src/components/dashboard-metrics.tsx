import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report } from "@/lib/types";
import { Users, BarChartHorizontal } from "lucide-react";

type Props = {
  reports: Report[];
};

const severityToNumber = (severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica'): number => {
  switch (severity) {
    case 'Baixa': return 1;
    case 'Média': return 2;
    case 'Alta': return 3;
    case 'Crítica': return 4;
    default: return 0;
  }
}

const numberToSeverity = (num: number): string => {
  if (num < 1.5) return 'Baixa';
  if (num < 2.5) return 'Média';
  if (num < 3.5) return 'Alta';
  return 'Crítica';
}

export default function DashboardMetrics({ reports }: Props) {
  const totalPatients = new Set(reports.map(r => r.patientId)).size;
  const averageSeverityScore = reports.reduce((acc, r) => acc + severityToNumber(r.severity), 0) / reports.length;
  const averageSeverity = numberToSeverity(averageSeverityScore);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">Indivíduos únicos no sistema</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gravidade Média</CardTitle>
          <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageSeverity}</div>
          <p className="text-xs text-muted-foreground">Em todos os relatórios ativos</p>
        </CardContent>
      </Card>
    </div>
  );
}

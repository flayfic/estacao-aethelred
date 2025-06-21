export type VitalSigns = {
  'Frequência Cardíaca': string;
  'Pressão Arterial': string;
  'Temperatura Corporal': string;
  'Saturação de Oxigênio': string;
};

export type Report = {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  diagnosis: string;
  vitals: VitalSigns;
  treatmentNotes: string;
  fullReportText: string;
};

export type VitalSigns = {
  'Frequência Cardíaca Quântica Entrelaçada': string;
  'Atividade Neuro-Sináptica': string;
  'Flutuação do Biocampo': string;
  'Ressonância Etérea': string;
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

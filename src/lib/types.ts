export type VitalSigns = {
  'Quantum-Entangled Heart Rate': string;
  'Neuro-Synaptic Activity': string;
  'Bio-Field Fluctuation': string;
  'Aetheric Resonance': string;
};

export type Report = {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  diagnosis: string;
  vitals: VitalSigns;
  treatmentNotes: string;
  fullReportText: string;
};

export type AISummary = {
    summary: string;
    keyInsights: string[];
}

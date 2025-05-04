export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

export interface PositionInterviewFlow {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface CandidateData {
  id?: number; // Asumimos que podría estar disponible
  fullName: string;
  currentInterviewStep: string; // Nombre de la fase actual
  averageScore: number;
  applicationId?: string; // Necesario para la actualización de fase
}

export interface StageUpdateResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: any[];
  };
} 
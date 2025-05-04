import axios from 'axios';
import { PositionInterviewFlow, CandidateData, StageUpdateResponse } from '../types/kanban';

const API_URL = 'http://localhost:3010'; // Asumimos que es el mismo endpoint base que candidateService

export const getPositionInterviewFlow = async (positionId: string): Promise<PositionInterviewFlow> => {
  try {
    const response = await axios.get(`${API_URL}/positions/${positionId}/interviewFlow`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el flujo de entrevistas:', error);
    throw new Error('No se pudo cargar el flujo de entrevistas para esta posición');
  }
};

export const getPositionCandidates = async (positionId: string): Promise<CandidateData[]> => {
  try {
    const response = await axios.get(`${API_URL}/positions/${positionId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los candidatos:', error);
    throw new Error('No se pudo cargar la lista de candidatos para esta posición');
  }
};

export const updateCandidateStage = async (
  candidateId: string,
  applicationId: string,
  newStageId: string
): Promise<StageUpdateResponse> => {
  try {
    const response = await axios.put(`${API_URL}/candidates/${candidateId}/stage`, {
      applicationId,
      currentInterviewStep: newStageId
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la fase del candidato:', error);
    throw new Error('No se pudo actualizar la fase del candidato');
  }
}; 
import React, { useMemo } from 'react';
import { Container, Row } from 'react-bootstrap';
import KanbanColumn from './KanbanColumn';
import { CandidateData, InterviewStep } from '../../types/kanban';
import './KanbanStyles.css';

interface KanbanBoardProps {
  steps: InterviewStep[];
  candidates: CandidateData[];
  onStageUpdate: (candidateId: string, applicationId: string, newStageId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ steps, candidates, onStageUpdate }) => {
  // Ordenar pasos según orderIndex
  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [steps]);

  // Crear un mapa de nombres de fase a IDs para hacer la correspondencia
  const stepNameToId = useMemo(() => {
    const map = new Map<string, number>();
    steps.forEach(step => {
      map.set(step.name, step.id);
    });
    return map;
  }, [steps]);

  // Agrupar candidatos por fase
  const candidatesByStep = useMemo(() => {
    const grouped = new Map<number, CandidateData[]>();
    
    // Inicializar todas las fases con un array vacío
    steps.forEach(step => {
      grouped.set(step.id, []);
    });
    
    // Agrupar candidatos por su fase actual
    candidates.forEach(candidate => {
      const stepName = candidate.currentInterviewStep;
      const stepId = stepNameToId.get(stepName);
      
      if (stepId !== undefined) {
        const stepsForPhase = grouped.get(stepId) || [];
        stepsForPhase.push(candidate);
        grouped.set(stepId, stepsForPhase);
      } else {
        console.warn(`No se encontró un ID de fase para "${stepName}"`);
      }
    });
    
    return grouped;
  }, [candidates, steps, stepNameToId]);

  return (
    <Container fluid className="kanban-board">
      <Row className="flex-nowrap kanban-container">
        {sortedSteps.map(step => (
          <KanbanColumn
            key={step.id}
            step={step}
            candidates={candidatesByStep.get(step.id) || []}
            onDrop={onStageUpdate}
          />
        ))}
      </Row>
    </Container>
  );
};

export default KanbanBoard; 
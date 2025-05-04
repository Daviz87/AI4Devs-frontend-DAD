import React from 'react';
import { Card } from 'react-bootstrap';
import CandidateCard from './CandidateCard';
import { CandidateData, InterviewStep } from '../../types/kanban';
import './KanbanStyles.css';

interface KanbanColumnProps {
  step: InterviewStep;
  candidates: CandidateData[];
  onDrop: (candidateId: string, applicationId: string, newStepId: number) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ step, candidates, onDrop }) => {
  // Prevenir el comportamiento por defecto para permitir el drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Manejar el evento drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      const { candidateId, applicationId } = JSON.parse(jsonData);
      
      // Llamar a la función onDrop pasada como prop
      onDrop(candidateId, applicationId, step.id);
    } catch (error) {
      console.error('Error al procesar la acción de arrastrar y soltar:', error);
    }
  };

  return (
    <div 
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className="column-header mb-3">
        <Card.Body>
          <Card.Title>{step.name}</Card.Title>
        </Card.Body>
      </Card>

      <div className="candidates-container">
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <CandidateCard 
              key={`${candidate.fullName}-${index}`} 
              candidate={candidate} 
              candidateId={candidate.id?.toString() || `temp-${index}`}
            />
          ))
        ) : (
          <p className="text-muted text-center">No hay candidatos en esta fase</p>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn; 
import React from 'react';
import { Card } from 'react-bootstrap';
import { CandidateData } from '../../types/kanban';
import './KanbanStyles.css';

interface CandidateCardProps {
  candidate: CandidateData;
  candidateId: string; // ID para la API PUT
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, candidateId }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Guardamos los datos necesarios para la actualización en el objeto dataTransfer
    e.dataTransfer.setData('application/json', JSON.stringify({
      candidateId,
      applicationId: candidate.applicationId || '1', // Fallback por si no está disponible
      fullName: candidate.fullName
    }));
    
    // Establecemos el efecto de arrastre
    e.dataTransfer.effectAllowed = 'move';
  };

  // Función para renderizar estrellas basadas en la puntuación (0-5)
  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < score ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Card 
      className="candidate-card mb-3"
      draggable
      onDragStart={handleDragStart}
    >
      <Card.Body>
        <Card.Title>{candidate.fullName}</Card.Title>
        <div className="score-container">
          {renderStars(candidate.averageScore)}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CandidateCard; 
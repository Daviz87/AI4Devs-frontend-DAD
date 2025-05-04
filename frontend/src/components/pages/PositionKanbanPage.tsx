import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import KanbanBoard from '../kanban/KanbanBoard';
import { InterviewStep, CandidateData } from '../../types/kanban';
import { 
  getPositionInterviewFlow, 
  getPositionCandidates, 
  updateCandidateStage 
} from '../../services/positionService';
import '../kanban/KanbanStyles.css';

const PositionKanbanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [positionName, setPositionName] = useState<string>('');
  const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [updateMessage, setUpdateMessage] = useState<{ text: string, type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID de posición no encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obtener los datos del flujo de entrevistas
        const flowData = await getPositionInterviewFlow(id);
        setPositionName(flowData.positionName);
        setInterviewSteps(flowData.interviewFlow.interviewSteps);
        
        // Obtener los candidatos para la posición
        const candidatesData = await getPositionCandidates(id);
        setCandidates(candidatesData);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id]);

  // Función para actualizar la fase de un candidato
  const handleStageUpdate = async (candidateId: string, applicationId: string, newStageId: number) => {
    try {
      // Mostrar indicador de carga o mensaje
      setUpdateMessage({ text: 'Actualizando...', type: 'success' });

      // Llamar a la API para actualizar la fase
      await updateCandidateStage(candidateId, applicationId, newStageId.toString());

      // Encontrar el nombre de la fase para la actualización local de la UI
      const newStepName = interviewSteps.find(step => step.id === newStageId)?.name || '';
      
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => 
          candidate.id?.toString() === candidateId
            ? { ...candidate, currentInterviewStep: newStepName }
            : candidate
        )
      );

      // Mostrar mensaje de éxito
      setUpdateMessage({ text: 'Fase actualizada correctamente', type: 'success' });
      
      // Limpiar el mensaje después de unos segundos
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating candidate stage:', err);
      setUpdateMessage({ 
        text: 'Error al actualizar la fase. Por favor, intente nuevamente.', 
        type: 'danger' 
      });
      
      // Limpiar el mensaje de error después de unos segundos
      setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
    }
  };

  return (
    <Container fluid className="position-kanban-page">
      <Row className="header-container my-4">
        <Col>
          <Button 
            variant="link" 
            className="back-button p-0 me-3"
            onClick={() => navigate('/positions')}
          >
            <ArrowLeft size={24} />
          </Button>
          <h2 className="d-inline-block">{positionName}</h2>
        </Col>
      </Row>

      {updateMessage && (
        <Alert variant={updateMessage.type} dismissible onClose={() => setUpdateMessage(null)}>
          {updateMessage.text}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <KanbanBoard 
          steps={interviewSteps}
          candidates={candidates}
          onStageUpdate={handleStageUpdate}
        />
      )}
    </Container>
  );
};

export default PositionKanbanPage; 
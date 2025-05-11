
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import LearningPathStep from './LearningPathStep';
import { toast } from 'sonner';

const LearningPath = () => {
  const [path, setPath] = useState({
    title: '',
    objectives: '',
    steps: [
      {
        id: 1,
        title: 'Première étape',
        task: '',
        resources: []
      },
      {
        id: 2,
        title: 'Deuxième étape',
        task: '',
        resources: []
      },
      {
        id: 3,
        title: 'Troisième étape',
        task: '',
        resources: []
      }
    ]
  });
  
  const [nextId, setNextId] = useState(4);
  
  useEffect(() => {
    // Charger depuis le local storage si disponible
    const savedPath = localStorage.getItem('learningPath');
    if (savedPath) {
      try {
        const parsedPath = JSON.parse(savedPath);
        setPath(parsedPath);
        
        // Déterminer le prochain ID disponible
        const maxId = Math.max(...parsedPath.steps.map(step => step.id), 0);
        setNextId(maxId + 1);
      } catch (error) {
        console.error('Erreur lors du chargement du parcours:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Sauvegarder dans le local storage à chaque changement
    localStorage.setItem('learningPath', JSON.stringify(path));
  }, [path]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(path.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setPath({
      ...path,
      steps: items
    });
    
    toast.success('Étape déplacée avec succès');
  };

  const addNewStep = () => {
    const newStep = {
      id: nextId,
      title: `Étape ${nextId}`,
      task: '',
      resources: []
    };
    
    setPath({
      ...path,
      steps: [...path.steps, newStep]
    });
    
    setNextId(nextId + 1);
    toast.success('Nouvelle étape ajoutée');
    
    // Faire défiler vers le bas pour voir la nouvelle étape
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const updateStep = (updatedStep) => {
    setPath({
      ...path,
      steps: path.steps.map(step => 
        step.id === updatedStep.id ? updatedStep : step
      )
    });
  };

  const deleteStep = (stepId) => {
    setPath({
      ...path,
      steps: path.steps.filter(step => step.id !== stepId)
    });
    toast.success('Étape supprimée');
  };

  return (
    <div className="learning-path-container">
      <div className="path-header">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer un Parcours d'Apprentissage</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="path-title" className="text-sm font-medium block mb-1">
              Titre du parcours
            </label>
            <Input
              id="path-title"
              value={path.title}
              onChange={(e) => setPath({ ...path, title: e.target.value })}
              placeholder="Ex: Apprendre le développement web"
              className="text-lg"
            />
          </div>
          
          <div>
            <label htmlFor="path-objectives" className="text-sm font-medium block mb-1">
              Objectifs d'apprentissage
            </label>
            <Textarea
              id="path-objectives"
              value={path.objectives}
              onChange={(e) => setPath({ ...path, objectives: e.target.value })}
              placeholder="Décrivez les compétences et objectifs à atteindre..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Étapes du parcours</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div
              className="steps-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {path.steps.map((step, index) => (
                <Draggable key={step.id} draggableId={`step-${step.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <LearningPathStep
                        step={step}
                        onUpdate={updateStep}
                        onDelete={deleteStep}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="flex justify-center mt-8">
        <Button onClick={addNewStep} className="gap-2">
          <Plus size={18} />
          Ajouter une étape
        </Button>
      </div>
    </div>
  );
};

export default LearningPath;

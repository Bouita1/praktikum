
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

const LearningPathStep = ({ 
  step, 
  onUpdate, 
  onDelete, 
  dragHandleProps 
}) => {
  const [newResource, setNewResource] = useState({ title: '', url: '' });
  const [showResourceForm, setShowResourceForm] = useState(false);

  const handleTaskChange = (e) => {
    onUpdate({
      ...step,
      task: e.target.value
    });
  };

  const handleAddResource = () => {
    if (newResource.title.trim()) {
      const updatedStep = {
        ...step,
        resources: [...step.resources, { ...newResource, id: Date.now() }]
      };
      onUpdate(updatedStep);
      setNewResource({ title: '', url: '' });
      setShowResourceForm(false);
    }
  };

  const handleDeleteResource = (resourceId) => {
    const updatedStep = {
      ...step,
      resources: step.resources.filter(resource => resource.id !== resourceId)
    };
    onUpdate(updatedStep);
  };

  return (
    <Card className="step-card fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="drag-handle p-1">
            <GripVertical size={18} className="text-muted-foreground" />
          </div>
          <Input 
            value={step.title} 
            onChange={(e) => onUpdate({ ...step, title: e.target.value })}
            className="font-medium text-lg border-none focus-visible:ring-0 px-0"
            placeholder="Titre de l'étape"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(step.id)} 
          className="text-destructive hover:bg-destructive/10">
          <Trash2 size={18} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Tâche:</p>
          <Textarea 
            value={step.task} 
            onChange={handleTaskChange} 
            placeholder="Décrivez la tâche à accomplir..."
            rows={3}
            className="resize-none"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Ressources et liens:</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowResourceForm(!showResourceForm)}
              className="text-xs"
            >
              <Plus size={16} className="mr-1" /> Ajouter
            </Button>
          </div>
          
          {showResourceForm && (
            <div className="bg-muted p-3 rounded-md mb-3 space-y-2 fade-in">
              <Input
                placeholder="Titre du document ou lien"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                className="text-sm"
              />
              <Input
                placeholder="URL (optionnel)"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                className="text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowResourceForm(false)}
                >
                  Annuler
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddResource}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          )}
          
          {step.resources.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">Aucune ressource ajoutée</p>
          ) : (
            <ul className="space-y-1">
              {step.resources.map((resource) => (
                <li key={resource.id} className="resource-item flex items-center justify-between text-sm p-2 rounded-md">
                  <div className="flex-1 truncate">
                    {resource.url ? (
                      <a 
                        href={resource.url.startsWith('http') ? resource.url : `https://${resource.url}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block"
                      >
                        {resource.title}
                      </a>
                    ) : (
                      <span>{resource.title}</span>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-destructive" 
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathStep;

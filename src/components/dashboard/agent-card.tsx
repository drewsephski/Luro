import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BotIcon, 
  MicIcon, 
  Volume2Icon,
  EditIcon,
  Trash2Icon,
  PlayIcon
} from 'lucide-react';
import { ConfigureAgentModal } from './configure-agent-modal';

interface Agent {
  id: string;
  name: string;
  personality: string;
  voiceStyle: string;
  expertise: string;
  greeting: string;
  tone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentCardProps {
  agent: Agent;
  onUpdate: (id: string, config: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onDelete: (id: string) => void;
  onChat?: (agent: Agent) => void;
}

export function AgentCard({ agent, onUpdate, onDelete, onChat }: AgentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(agent.id);
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'training':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-primary" />
            {agent.name}
          </CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(agent.status)}`}>
            {agent.status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MicIcon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{agent.voiceStyle.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Volume2Icon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{agent.expertise.replace('-', ' ')}</span>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            "{agent.greeting}"
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {onChat && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onChat(agent)}
              className="flex-1"
            >
              <PlayIcon className="mr-1 h-3 w-3" />
              Chat
            </Button>
          )}
          
          <ConfigureAgentModal 
            agent={agent}
            onUpdate={onUpdate} onConfigure={function (): void {
              throw new Error('Function not implemented.');
            } } children={undefined}          >
            <Button size="sm" variant="outline">
              <EditIcon className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </ConfigureAgentModal>

          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleDelete}
                className="text-xs"
              >
                Confirm
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon className="mr-1 h-3 w-3" />
              Delete
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-2">
          Created {new Date(agent.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
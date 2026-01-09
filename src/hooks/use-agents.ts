import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

interface UseAgentsReturn {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  createAgent: (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Agent | null>;
  updateAgent: (id: string, agentData: Partial<Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Agent | null>;
  deleteAgent: (id: string) => Promise<boolean>;
  refreshAgents: () => Promise<void>;
}

export function useAgents(): UseAgentsReturn {
  const [agents, setAgents] = useState<Agent[]>([]);

  // Ensure agents is always an array
  const safeAgents = Array.isArray(agents) ? agents : [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      console.log('Fetching agents...');
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/agents', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      
      const result = await response.json();
      console.log('Fetched agents raw result:', result);
      
      // Handle both response formats
      let agentsData = [];
      if (Array.isArray(result)) {
        // Direct array response
        agentsData = result;
      } else if (result && Array.isArray(result.data)) {
        // Wrapped in data property
        agentsData = result.data;
      } else if (result && result.success && Array.isArray(result.data)) {
        // Success object with data array
        agentsData = result.data;
      }
      
      console.log('Processed agents data:', agentsData);
      setAgents(agentsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Creating agent:', agentData);
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create agent');
      }

      const result = await response.json();
      console.log('Create agent raw result:', result);
      
      // Extract agent data from response
      let newAgent;
      if (result && result.data) {
        newAgent = result.data;
      } else {
        newAgent = result;
      }
      
      console.log('Created agent extracted:', newAgent);
      
      // Validate that we have a proper agent object
      if (!newAgent || !newAgent.id) {
        throw new Error('Invalid agent data received');
      }
      
      // Update local state immediately
      setAgents(prev => {
        const currentAgents = Array.isArray(prev) ? prev : [];
        const updated = [...currentAgents, newAgent];
        console.log('Updated agents state:', updated);
        return updated;
      });
      
      // Refresh from server to ensure consistency
      setTimeout(() => {
        fetchAgents();
      }, 100);
      
      toast.success(`Agent "${newAgent.name}" created successfully`);
      
      return newAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create agent';
      console.error('Agent creation error:', err);
      toast.error(errorMessage);
      return null;
    }
  };

  const updateAgent = async (id: string, agentData: Partial<Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      console.log('Updating agent:', id, agentData);
      const response = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update agent');
      }

      const updatedAgent = await response.json();
      console.log('Updated agent:', updatedAgent);
      
      setAgents(prev => {
        const currentAgents = Array.isArray(prev) ? prev : [];
        const updated = currentAgents.map(agent => agent.id === id ? updatedAgent : agent);
        console.log('Updated agents state:', updated);
        return updated;
      });
      
      toast.success(`Agent "${updatedAgent.name}" updated successfully`);
      
      return updatedAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update agent';
      toast.error(errorMessage);
      return null;
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      console.log('Deleting agent:', id);
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete agent');
      }

      setAgents(prev => {
        const currentAgents = Array.isArray(prev) ? prev : [];
        const updated = currentAgents.filter(agent => agent.id !== id);
        console.log('Updated agents state:', updated);
        return updated;
      });
      
      toast.success("Agent deleted successfully");
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete agent';
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    console.log('useAgents hook mounted, fetching agents');
    fetchAgents();
  }, []);

  // Log agents state changes for debugging
  useEffect(() => {
    console.log('Agents state updated:', agents);
  }, [agents]);

  return {
    agents: safeAgents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    refreshAgents: fetchAgents,
  };
}
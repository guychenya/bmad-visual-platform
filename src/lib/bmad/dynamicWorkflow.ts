
import { Workflow, WorkflowStep, BMAD_WORKFLOWS } from './workflows';

/**
 * Generates a dynamic workflow based on a list of selected agent IDs.
 * It includes the selected agents and any of their dependencies recursively.
 * The final steps are topologically sorted to respect the execution order.
 *
 * @param selectedAgentIds - An array of agent IDs that the user has selected.
 * @param baseWorkflowId - The ID of the base workflow to use (e.g., 'greenfield-complete').
 * @returns A new Workflow object tailored to the selected agents, or null if an error occurs.
 */
export function generateDynamicWorkflow(
  selectedAgentIds: string[],
  baseWorkflowId: string = 'greenfield-complete'
): Workflow | null {
  const baseWorkflow = BMAD_WORKFLOWS.find(w => w.id === baseWorkflowId);
  if (!baseWorkflow) {
    console.error(`Base workflow with id "${baseWorkflowId}" not found.`);
    return null;
  }

  const allSteps = baseWorkflow.steps;
  const stepsByAgentId = new Map<string, WorkflowStep>(allSteps.map(step => [step.agentId, step]));
  
  // Map all possible outputs to the agent that produces them
  const outputToProducerMap = new Map<string, string>();
  allSteps.forEach(step => {
    step.outputs.forEach(output => {
      outputToProducerMap.set(output, step.agentId);
    });
  });

  // 1. Resolve all dependencies to get the full set of required agents
  const requiredAgentIds = new Set<string>();
  const queue = [...selectedAgentIds];

  while (queue.length > 0) {
    const agentId = queue.shift();
    if (!agentId || requiredAgentIds.has(agentId)) continue;

    requiredAgentIds.add(agentId);
    const step = stepsByAgentId.get(agentId);
    if (!step) continue;

    for (const dependencyOutput of step.dependencies) {
      const producerAgentId = outputToProducerMap.get(dependencyOutput);
      if (producerAgentId && !requiredAgentIds.has(producerAgentId)) {
        queue.push(producerAgentId);
      }
    }
  }

  // 2. Filter the steps to include only the required ones
  const requiredSteps = allSteps.filter(step => requiredAgentIds.has(step.agentId));

  // 3. Topologically sort the required steps to maintain execution order
  const sortedSteps: WorkflowStep[] = [];
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  requiredSteps.forEach(step => {
    adj.set(step.agentId, []);
    inDegree.set(step.agentId, 0);
  });

  requiredSteps.forEach(step => {
    step.dependencies.forEach(dep => {
      const producerAgentId = outputToProducerMap.get(dep);
      if (producerAgentId && requiredAgentIds.has(producerAgentId)) {
        adj.get(producerAgentId)!.push(step.agentId);
        inDegree.set(step.agentId, (inDegree.get(step.agentId) || 0) + 1);
      }
    });
  });

  const sortQueue: string[] = [];
  requiredSteps.forEach(step => {
    if (inDegree.get(step.agentId) === 0) {
      sortQueue.push(step.agentId);
    }
  });

  while (sortQueue.length > 0) {
    const agentId = sortQueue.shift()!;
    const step = requiredSteps.find(s => s.agentId === agentId)!;
    sortedSteps.push(step);

    adj.get(agentId)!.forEach(neighborAgentId => {
      inDegree.set(neighborAgentId, inDegree.get(neighborAgentId)! - 1);
      if (inDegree.get(neighborAgentId) === 0) {
        sortQueue.push(neighborAgentId);
      }
    });
  }
  
  if (sortedSteps.length !== requiredSteps.length) {
    console.error("A cycle was detected in the workflow dependencies, or a dependency is missing.");
    return null;
  }

  // 4. Create the new dynamic workflow object
  const dynamicWorkflow: Workflow = {
    ...baseWorkflow,
    id: `dynamic-${selectedAgentIds.join('-')}`,
    name: `Dynamic Workflow`,
    description: `A dynamically generated workflow for the selected agents.`,
    steps: sortedSteps,
    totalEstimatedTime: sortedSteps.reduce((acc, step) => acc + step.estimatedDuration, 0),
  };

  return dynamicWorkflow;
}

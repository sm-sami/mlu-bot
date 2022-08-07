export interface TriggersWithResponse {
  response: string;
  triggers: Array<Trigger>;
}

export interface Trigger {
  triggerId: string;
  trigger: string;
}

export type TriggersWithResponse = {
  response: string;
  triggers: Array<Trigger>;
};

export type Trigger = {
  triggerId: string;
  trigger: string;
};

export interface Framework {
  name: string;
  description: string;
  version: string;
}

export interface FrameworkCategory {
  name: string;
  description: string;
  code: string;
}

export interface Control {
  name: string;
  description: string;
  domain: string;
  requirements: ControlRequirement[];
}

export interface ControlRequirement {
  id: string;
  type: string;
  description: string;
  policyId?: string;
}

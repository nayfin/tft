import { CrisprControlConfig, CrisprFieldConfig } from "../models";

/**
 * Determines if the field config is for a form control (not a divider, heading or other non-control field)
 *  */
 export function isControlConfig(fieldConfig: CrisprFieldConfig): fieldConfig is CrisprControlConfig {
  return 'controlName' in fieldConfig;
}

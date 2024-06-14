import { ControlType, CrisprControlConfig } from "./crispr-field.config";

export type MapFieldConfig = CrisprControlConfig & {
  controlType: ControlType.MAP;
  label: string;
}
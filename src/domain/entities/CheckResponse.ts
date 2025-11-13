import { Check } from "./Check";

export interface CheckResponse {
  message: string;
  check?: Check;
}
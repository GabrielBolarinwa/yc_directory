export interface StartupFormValues {
  title: string;
  description: string;
  category: string;
  link: string;
  pitch: string;
}
export interface errors {
  title?:
    | {
        errors: string[];
      }
    | undefined;
  description?:
    | {
        errors: string[];
      }
    | undefined;
  category?:
    | {
        errors: string[];
      }
    | undefined;
  link?:
    | {
        errors: string[];
      }
    | undefined;
  pitch?:
    | {
        errors: string[];
      }
    | undefined;
}

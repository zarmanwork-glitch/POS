import { FormikProps } from 'formik';

export interface SecondaryControlsSectionProps {
  formik: FormikProps<any>;
  t: (key: string) => string;
}

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent as ReactChangeEvent } from "react";

type FormFields = Record<string, unknown>;

type ChangeTarget = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type ChangeEvent =
  | ReactChangeEvent<ChangeTarget>
  | {
      name: string;
      value: unknown;
    };

type InitialInput<TValues> = TValues | (() => TValues);

interface UseFormOptions {
  /**
   * When true, the form state reinitializes whenever the provided initialValues reference changes.
   * Defaults to false to avoid unintentional resets when inline literals are used.
   */
  reinitialize?: boolean;
}

interface UseFormResult<TValues extends FormFields> {
  values: TValues;
  handleChange: (event: ChangeEvent) => void;
  setFieldValue: <K extends keyof TValues>(field: K, value: TValues[K]) => void;
  resetForm: (nextValues?: TValues) => void;
}

function resolveInitial<TValues>(initial: InitialInput<TValues>): TValues {
  return typeof initial === "function" ? (initial as () => TValues)() : initial;
}

/**
 * Generic form helper that exposes a single onChange handler
 * and keeps the initial values stable unless explicit reinitialization is requested.
 */
export function useForm<TValues extends FormFields>(
  initialValues: InitialInput<TValues>,
  options?: UseFormOptions
): UseFormResult<TValues> {
  const { reinitialize = false } = options ?? {};

  const initialRef = useRef<TValues>(resolveInitial(initialValues));
  const [values, setValues] = useState<TValues>(() => initialRef.current);

  useEffect(() => {
    if (!reinitialize) {
      return;
    }
    const nextInitial = resolveInitial(initialValues);
    initialRef.current = nextInitial;
    setValues(nextInitial);
  }, [initialValues, reinitialize]);

  const handleChange = useCallback((event: ChangeEvent) => {
    if ("target" in event) {
      const target = event.target as ChangeTarget;
      const { name, type } = target;

      let nextValue: unknown;
      if (type === "checkbox") {
        nextValue = (target as HTMLInputElement).checked;
      } else if (type === "file") {
        nextValue = (target as HTMLInputElement).files;
      } else {
        nextValue = target.value;
      }

      setValues((prev) => ({
        ...prev,
        [name]: nextValue,
      }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      [event.name]: event.value,
    }));
  }, []);

  const setFieldValue = useCallback(
    <K extends keyof TValues>(field: K, value: TValues[K]) => {
      setValues((prev) => ({
        ...prev,
        [field as string]: value,
      }));
    },
    []
  );

  const resetForm = useCallback((nextValues?: TValues) => {
    if (nextValues) {
      initialRef.current = nextValues;
      setValues(nextValues);
      return;
    }

    setValues(initialRef.current);
  }, []);

  return {
    values,
    handleChange,
    setFieldValue,
    resetForm,
  };
}

export default useForm;

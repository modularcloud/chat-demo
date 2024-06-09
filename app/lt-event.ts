export type LTEvent = CustomEvent<{
  stage: number;
}>;

export function emitLTEvent(stage: number) {
  const event: LTEvent = new CustomEvent("lt", { detail: { stage } });
  window.dispatchEvent(event);
}

export function addLTEventListener(listener: (event: LTEvent) => void) {
  const wrappedListener = (event: Event) => {
    listener(event as LTEvent);
  };
  window.addEventListener("lt", wrappedListener);
  return wrappedListener;
}

export function removeLTEventListener(wrappedListener: (event: Event) => void) {
  window.removeEventListener("lt", wrappedListener);
}

export async function wrapServerAction<T>(action: Promise<T>): Promise<T> {
  emitLTEvent(0);
  const result = await action;
  const sleep = new Promise((resolve) => setTimeout(resolve, 1000));
  await sleep;
  emitLTEvent(1);
  return result;
}

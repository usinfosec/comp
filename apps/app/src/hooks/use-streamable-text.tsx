import { type StreamableValue, readStreamableValue } from "ai/rsc";
import { useEffect, useState } from "react";

export const useStreamableText = (
  content: string | StreamableValue<string>,
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === "string" ? content : "",
  );

  useEffect(() => {
    if (typeof content === "string") {
      setRawContent(content);
      return;
    }

    let isMounted = true;

    (async () => {
      let accumulated = "";
      for await (const delta of readStreamableValue(content)) {
        if (!isMounted) break;
        if (typeof delta === "string") {
          accumulated += delta;
          setRawContent(accumulated);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [content]);

  return rawContent;
};

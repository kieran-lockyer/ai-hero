import { isToolUIPart, getToolName } from "ai";
import type { MessagePart } from "./chat-message";

interface ToolInvocationProps {
  part: MessagePart;
}

export const ToolInvocation = ({ part }: ToolInvocationProps) => {
  if (!isToolUIPart(part)) {
    return null;
  }
  
  const toolName = getToolName(part);

  const { state, input, output, errorText } = part;

  return (
    <div className="mb-4 rounded-md border border-gray-700 bg-gray-900 p-3">
      <div className="mb-2 flex items-center">
        <span className="mr-2 rounded bg-blue-900 px-2 py-1 text-xs font-medium text-blue-200">
          Tool:
        </span>
        <span className="font-mono text-sm font-semibold text-blue-400">{toolName}</span>
      </div>

      {(state === 'input-streaming' || state === 'input-available') && !!input && (
        <div className="mb-2">
          <p className="mb-1 text-xs text-gray-400">Input:</p>
          <pre className="overflow-x-auto rounded bg-gray-800 p-2 text-xs">
            <code>{JSON.stringify(input, null, 2)}</code>
          </pre>
        </div>
      )}

      {state === "output-available" && !!output && (
        <div>
          <p className="mb-1 text-xs text-gray-400">Output:</p>
          <pre className="overflow-x-auto rounded bg-gray-800 p-2 text-xs">
            <code>{JSON.stringify(output, null, 2)}</code>
          </pre>
        </div>
      )}

      {state === "output-error" && errorText && (
        <div>
          <p className="mb-1 text-xs text-gray-400 text-red-400">Error:</p>
          <pre className="overflow-x-auto rounded bg-gray-800 p-2 text-xs text-red-400">
            <code>{errorText}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

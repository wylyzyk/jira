import { useProjectIdInUrl } from "../kanban/until";

export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() });
export const useEpicQueryKey = () => ["epics", useEpicSearchParams()];

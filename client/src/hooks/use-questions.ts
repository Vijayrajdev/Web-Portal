import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type QuestionResponse, type AttemptResponse, type CreateAttemptRequest } from "@shared/routes";
import { z } from "zod";

export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      return api.questions.list.responses[200].parse(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAttempts() {
  return useQuery({
    queryKey: [api.attempts.list.path],
    queryFn: async () => {
      const res = await fetch(api.attempts.list.path);
      if (!res.ok) throw new Error("Failed to fetch attempts");
      const data = await res.json();
      return api.attempts.list.responses[200].parse(data);
    },
  });
}

export function useCreateAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attempt: CreateAttemptRequest) => {
      // Validate input before sending
      const validated = api.attempts.create.input.parse(attempt);
      
      const res = await fetch(api.attempts.create.path, {
        method: api.attempts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to submit attempt");
      }
      
      const data = await res.json();
      return api.attempts.create.responses[201].parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attempts.list.path] });
    },
  });
}

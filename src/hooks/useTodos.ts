import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import type { Todo, TodoFormData, TodoFilter } from '../types/todo';

const QUERY_KEY = 'todos';

export const useTodos = (page: number, limit: number, filter: TodoFilter) => {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit, filter],
    queryFn: () => todoApi.getTodos(page, limit, filter),
  });
};

export const useTodosByIds = (ids: string[]) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'by-ids', ids],
    queryFn: () => todoApi.getTodosByIds(ids),
    enabled: ids.length > 0,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoFormData) => todoApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) => todoApi.updateTodo(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousData = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [QUERY_KEY] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((todo: Todo) =>
            todo.id === id ? { ...todo, ...data, updatedAt: new Date().toISOString() } : todo
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useBatchUpdateTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { id: string; data: Partial<Todo> }[]) => {
      return todoApi.batchUpdateTodos(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

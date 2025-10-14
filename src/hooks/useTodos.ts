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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Todo> }) => {
      console.log('updateTodo', id, data);
      await todoApi.updateTodo(id, data);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousData = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [QUERY_KEY] }, (old: any) => {
        if (!old) return old;

        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((todo: Todo) => (todo.id === id ? { ...todo, ...data } : todo)),
          };
        }

        return old;
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
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
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousData = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [QUERY_KEY] }, (old: any) => {
        if (!old) return old;

        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((todo: Todo) => {
              const update = updates.find((u) => u.id === todo.id);
              return update ? { ...todo, ...update.data } : todo;
            }),
          };
        }

        return old;
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
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

import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import type { Todo, TodoFormData, TodoFilter, PaginatedResponse } from '../types/todo';

const QUERY_KEY = 'todos';

const updateTodosInCache = (queryClient: QueryClient, updater: (todos: Todo[]) => Todo[]) => {
  queryClient.setQueriesData<PaginatedResponse<Todo>>({ queryKey: [QUERY_KEY] }, (old) => {
    if (!old?.data || !Array.isArray(old.data)) return old;
    return { ...old, data: updater(old.data) };
  });
};

const handleOptimisticUpdate = async (
  queryClient: QueryClient,
  updater: (todos: Todo[]) => Todo[]
) => {
  await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
  const previousData = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });
  updateTodosInCache(queryClient, updater);
  return { previousData };
};

const handleOptimisticError = (
  queryClient: QueryClient,
  context: { previousData: [queryKey: unknown, data: unknown][] } | undefined
) => {
  if (context?.previousData) {
    context.previousData.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey as Parameters<typeof queryClient.setQueryData>[0], data);
    });
  }
};

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
      await todoApi.updateTodo(id, data);
    },
    onMutate: async ({ id, data }) => {
      return handleOptimisticUpdate(queryClient, (todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo))
      );
    },
    onError: (_err, _variables, context) => {
      handleOptimisticError(queryClient, context);
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
      return handleOptimisticUpdate(queryClient, (todos) =>
        todos.map((todo) => {
          const update = updates.find((u) => u.id === todo.id);
          return update ? { ...todo, ...update.data } : todo;
        })
      );
    },
    onError: (_err, _variables, context) => {
      handleOptimisticError(queryClient, context);
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

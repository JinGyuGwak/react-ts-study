import { updateTodo } from "@/api/update-todos";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    //mutate함수의 인수로 전달되는 값이 onMutate의 매개변수로 전달된다.

    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.todo.detail(updatedTodo.id),
      });

      const prevTodo = queryClient.getQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id)
      );

      queryClient.setQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id),
        (prevTodo) => {
          if (!prevTodo) return;
          return {
            ...prevTodo,
            ...updatedTodo,
          };
        }
      );

      //onMutate의 반환값
      return {
        prevTodo,
      };
    },
    //error : 현재 발생한 에러 정보,
    //variable : mutationFn을 호출할 때 들어온 매개변수
    //context : onMutate가 반환하는 반환값
    onError: (error, variable, context) => {
      if (context && context.prevTodo) {
        queryClient.setQueryData<Todo>(
          QUERY_KEYS.todo.detail(context.prevTodo.id),
          context.prevTodo
        );
      }
    },
    // onSettled 메서드가 호출되면 캐시를 무효화 한다.
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: QUERY_KEYS.todo.list,
    //   });
    // },
  });
}

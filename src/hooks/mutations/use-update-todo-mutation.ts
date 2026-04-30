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
        //key값에 해당하는 데이터 조회 요청은 전부 취소하는 기능
        queryKey: QUERY_KEYS.todo.list,
      });

      //원상 복구에 활용할 데이터 선언
      const prevTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todo.list);

      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
        if (!prevTodos) return [];
        return prevTodos.map((prevTodo) =>
          prevTodo.id === updatedTodo.id
            ? { ...prevTodo, ...updatedTodo }
            : prevTodo
        );
      });

      return {
        prevTodos,
      };
    },
    //error : 현재 발생한 에러 정보,
    //variable : mutationFn을 호출할 때 들어온 매개변수
    //context : onMutate가 반환하는 반환값
    onError: (error, variable, context) => {
      if (context && context.prevTodos) {
        queryClient.setQueryData<Todo[]>(
          QUERY_KEYS.todo.list,
          context.prevTodos
        );
      }
    },
    //onSettled 메서드가 호출되면 캐시를 무효화 한다.
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.todo.list,
      });
    },
  });
}

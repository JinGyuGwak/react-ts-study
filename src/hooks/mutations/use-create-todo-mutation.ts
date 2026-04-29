import { createTodo } from "@/api/create-todo";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// tanstack query 를 사용해서 서버에서 데이터를 가져오고,
// 이를 캐싱하는 역할을 한다.
// useQuery — 데이터 조회
// useMutation — 데이터 변경
export function useCreateTodoMutation() {
  //QueryClient는 일종의 저장소이며 서버상태 전용의 저장소라고 생각하자
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      //캐시에 데이터가 초기화 되면, 페이지는 서버에 다시 요청을 보내게 된다.
      // queryClient.invalidateQueries({
      //   queryKey: QUERY_KEYS.todo.list,
      // });

      //단, 새로운 요청을 보내는 것 보다는 새로운 데이터를 화면에 반영하는 방향이 올바르다.
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
        if (!prevTodos) return [newTodo];
        return [...prevTodos, newTodo];
      });
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
}
